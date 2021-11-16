const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
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
    }
  }
}

module.exports = resolvers;
