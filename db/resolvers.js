const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const CustomerData = require('../models/Cliente');
const Order = require('../models/Pedido');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Config para conexión a db
require('dotenv').config({ path: 'conf.env' });

const crearToken = ( usuario, secreta, expiresIn ) => {
  // console.log(usuario);
  const { id, email, nombre, apellido} = usuario;

  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn } )
}


// RESOLVERS

const resolvers = {

  Query: {
    obtenerUsuario: async(_, { token }) =>{
      const usuarioId = await jwt.verify(token, process.env.SECRETA );

      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const mostrarProductos = await Producto.find({});

        return mostrarProductos;
      } catch (error) {
        console.log(error);        
      }
    },
    getProductById: async(_, { id }) => {
      // Revisar si el producto existe
      const productFound = await Producto.findById(id);

      if (!productFound) {
        throw new Error('Producto no encontrado');
      }

      return productFound;
    },
    getCustomers: async() => {
      try {
        const clientes = await CustomerData.find({});
        return clientes;
      } catch (error) {
        console.log(error);        
      }
    },
    getCustomerSeller: async(_, {}, ctx ) => {
      try {
        const clientes = await CustomerData.find({ seller: ctx.usuario.id.toString() });
        return clientes;
      } catch (error) {
        console.log(error);        
      }
    },
    getCustomer: async(_, { id }, ctx ) => {
      //REVISAR SI EXISTE UN CLIENTE O NO
       const cliente = await CustomerData.findById(id);
       if(!cliente) {
         throw new Error('Cliente no encontrado...');
       }
      //QUE EL CLIENTE LO PUEDA VER SOLO QUIEN LO CREO
      if(cliente.vendedor.toString() !== ctx.usuario.id ) {
        throw new Error('No estas autorizado para ver este cliente');
      }

      return cliente;
    },
    getOrders: async () => {
      try {
        const misPedidos = await Order.find({});
        return misPedidos;
      } catch (error) {
        console.log(error);        
      }
    },
    getOrdersBySeller: async (_, {}, ctx) => {
      try {
        const pedidos = await Order.find({ vendedor: ctx.usuario.id });
        return pedidos;
      } catch (error) {
        console.log(error);        
      }
    },
    getOderById: async(_, {id}, ctx) => {
      // Si el pedido existe o no
      const order = await Order.findById(id);
      if(!order) {
        throw new Error('Pedido no encontrado :-(');
      }

      // Solo quien lo creo puede verlo
      if(order.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales... :-(');
      }

      // Retornar el resultado
      return order;

    },
    getOrderByState: async(_, { estado }, ctx) => {
      const getOrder = await Order.find({ vendedor: ctx.usuario.id, estado });

      return getOrder;
    },
    mejoresClientes: async() => {
      const clientes = await Order.aggregate([
        { $match : { estado : "COMPLETE" }},
        { $group : {
          _id : "$cliente",
          total: { $sum : '$total'}
        }},
        {
          $lookup: {
            from: 'clientes',
            localField: '_id',
            foreignField: "_id",
            as: "cliente"
          }
        },
        {
          $limit: 10
        },
        {
          $sort : { total : -1 }
        }
      ]);

      return clientes;

    },
    mejoresVendedores: async() => {
      const vendedores = await Order.aggregate([
        { $match : { estado: "COMPLETE" }},
        { $group: {
          _id: "$vendedor",
          total: { $sum : "$total"}
        }},
        {
          $lookup: {
            from: 'usuarios',
            localField: '_id',
            foreignField: '_id',
            as: 'vendedor'
          }
        },
          {
            $limit: 3
          },
          {
            $sort: { total : -1 }
          }      
      ]);
      return vendedores;
    },
    searchProduct: async(_, { text }) => {
      const products = await Producto.find({ $text: { $search: text }}).limit(10);

      return products;
    }
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {

      const { email, password } = input;
      
      // REVISAR SI EL USUARIO ESTA REGITRADO
      const existeUsuario = await Usuario.findOne({email});
      if (existeUsuario) {
        throw new Error('El usuario ya esta registrado');
      }
      

      // HASHEAR SU PASSWORD

      const salt = bcrypt.genSaltSync(10);
      input.password = bcrypt.hashSync(password, salt);

      try {
        // GUARDARLO EN LA BASE DE DATOS
        const usuario = new Usuario(input);
        usuario.save(); // guardarlo
        return usuario;
      } catch (error) {
        console.log(error);        
      }

      
    },
    autenticarUsuario: async (_, {input}) =>{

      const { email, password } = input;

      // SI EL USUARIO EXISTE
      const existeUsuario = await Usuario.findOne({email});
      if (!existeUsuario){
        throw new Error('El usuario no existe');
      }

      // REVISAR SI EL PASSWORD ES CORRECTO
      const passwordCorrecto = await bcrypt.compare( password, existeUsuario.password );
      if(!passwordCorrecto) {
        throw new Error('El Password es incorrecto');
      }

      // CREAR EL TOKEN
      return{
        token: crearToken( existeUsuario, process.env.SECRETA, '24h' )
      }
    },
    nuevoProducto: async (_, {input}) => {
        try {
          const producto = new Producto(input);

          // Almacenar en la db
          const resultado = await producto.save();

          return resultado;

        } catch (error) {
          console.log(error);          
        }
    },
    actualizarProducto: async (_, {id, input}) => {
      // Revisar si el producto existe
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // guardarlo en la db
      producto = await Producto.findByIdAndUpdate({ _id : id }, input, { new: true } );

      return producto;
    },
    eliminarProducto: async (_, {id}) => {
      // Revisar si el producto que se quiere eliminar existe
      let deleteProduct = await Producto.findById(id);

      if (!deleteProduct) {
        throw new Error('Producto no encontrado');
      }

      // ELIMINAR
      await Producto.findOneAndDelete({_id: id});

      return "Producto eliminado correctamente";
    },
    newCustomer: async(_, { input }, ctx) => {

      // console.log(ctx);      

      const { email } = input;
      // VERIFICAR SI EL CLIENTE YA ESTA REGISTRADO
      // console.log(input);
      
      const cliente = await CustomerData.findOne({ email });
      if(cliente) {
        throw new Error('Este cliente ya está registrado');
      }
      const nuevoCliente = new CustomerData(input);

      // ASIGNAR EL VENDEDOR
      nuevoCliente.vendedor = ctx.usuario.id;

      // GUARDARLO EN LA DB

      try {
        const result = await nuevoCliente.save();
        return result;
      } catch (error) {
        console.log(error);        
      }
    },
    updateCustomer: async(_, {id, input}, ctx) => {
      // Verificar si existe o no
      let cliente = await CustomerData.findById(id);

      if(!cliente) {
        throw new Error('Este cliente no existe!');
      }

      //Verificar si el vendedor es quien edita
      if(cliente.vendedor.toString() !== ctx.usuario.id ){
        throw new Error('No tienes credenciales');
      }

      // Guardar al cliente
      cliente = await CustomerData.findOneAndUpdate({_id: id}, input, {new: true} );
      return cliente;
    },
    deleteCustomer : async(_, {id, input}, ctx) => {
       // Verificar si existe o no
       let cliente = await CustomerData.findById(id);

       if(!cliente) {
         throw new Error('Este cliente no existe!');
       }
 
       //Verificar si el vendedor es quien edita
       if(cliente.vendedor.toString() !== ctx.usuario.id ){
         throw new Error('No tienes credenciales');
       }

       // Eliminar cliente
       await CustomerData.findOneAndDelete({_id : id});
       return "Cliente eliminado correctamente!!"
    },
    newOrder: async (_, {input}, ctx) => {
      const { cliente } = input;

       // Verificar si el cliente existe o no
       let clienteExiste = await CustomerData.findById(cliente);

       if(!clienteExiste) {
         throw new Error('Este cliente no existe');
       }

        // Verificar si el cliente es del vendedor
        if(clienteExiste.vendedor.toString() !== ctx.usuario.id ) {
          throw new Error('No tienes credenciales para acceder a los datos de este cliente');
        }

        // Verificar que el stock este disponible

       for await ( const articulo of input.order ) {
          const { id } = articulo;
          
          const producto = await Producto.findById(id);

          if(articulo.quantity > producto.stock) {
            throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
          }  else {
            // Restar la cantidad  a lo disponible en stock
            producto.stock = producto.stock - articulo.quantity;

            await producto.save();
          }        
        }

        // Crear un nuevo pedido
        const nuevoPedido = new Order(input);        


        // Asignarle a un vendedor
        nuevoPedido.vendedor = ctx.usuario.id;


        // Guardarlo en la base de datos
        const resultado = await nuevoPedido.save();
        return resultado;

    },
    updateOrder: async(_, {id, input}, ctx) => {
      const { cliente } = input;

      // Verificar si el pedido existe
      const existePedido = await Order.findById(id);
      if(!existePedido) {
        throw new Error('El pedido no existe!');
      }

      // Verificar si el cliente existe
      const existeCliente = await CustomerData.findById(cliente);
      if(!existeCliente) {
        throw new Error('El cliente no existe!');
      }

      // verificar si el cliente y pedido pertenece al vendedor
      if(existeCliente.vendedor.toString() !== ctx.usuario.id ) {
        throw new Error('')
      }

      // Revisar el stock
      if( input.order ) {
        for await ( const articulo of input.order ) {
          const { id } = articulo;
          
          const producto = await Producto.findById(id);
  
          if(articulo.quantity > producto.stock) {
            throw new Error(`El articulo ${producto.nombre} excede la cantidad disponible`);
          }  else {
            // Restar la cantidad  a lo disponible en stock
            producto.stock = producto.stock - articulo.quantity;
  
            await producto.save();
          }        
        }
      }

      // Guardar el pedido
      const resultado = await Order.findByIdAndUpdate({_id: id}, input, { new: true });
      return resultado;
      
    },
    deleteOrder: async(_, { id }, ctx ) => {
      // Verificar si el pedido existe o no
      const pedido = await Order.findById(id);
      if(!pedido) {
        throw new Error('El pedido no existe...')
      }

      // Verificar si el vendedor es quien lo borra
      if(pedido.vendedor.toString() !== ctx.usuario.id) {
        throw new Error('No tienes las credenciales necesarias!');
      }
      // Eliminar de la base de datos
      await Order.findOneAndDelete({_id: id});
      return 'Pedido eliminado correctamente!!'
    }
  }
}

module.exports = resolvers;
