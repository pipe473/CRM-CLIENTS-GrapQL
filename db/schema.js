const { gql } = require('apollo-server');

// SCHEMA
const typeDefs = gql `

    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String        
    }

    type Token {
        token: String
    }

    type Producto {
        id: ID
        nombre: String
        stock: Int
        price: Float
        creado: String
    }

    type Customer {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

    type Order {
        id: ID
        #pedido
        order: [PedidoGrupo]
        total: Float!
        cliente: ID!
        vendedor: ID
        fecha: String
        estado: EstadoPedido
    }

    type PedidoGrupo {
        id: ID
        quantity: Int
    }

    type TopCliente {
        total: Float
        cliente: [Customer]
    }
    type TopVendedor {
        total: Float
        vendedor: [Usuario]
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    input AutenticarInput {
        email: String!
        password: String!
    }

    input ProductoInput {
        nombre: String!
        stock: Int!
        price: Float!
    }
    input CustomerInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        cliente: ID
        estado: EstadoPedido
    }

    enum EstadoPedido {
        PENDIENTE
        COMPLETE
        CANCELED
    }



    type Query {
       # Usuarios
       obtenerUsuario(token: String!) : Usuario

       # Productos
       obtenerProductos: [Producto]
       getProductById(id: ID!) : Producto

       # Clientes
       getCustomers: [Customer]
       getCustomerSeller: [Customer]
       getCustomer(id: ID!) : Customer

       # Pedidos
       getOrders: [Order]
       getOrdersBySeller: [Order]
       getOderById(id: ID!) : Order
       getOrderByState(estado: String!): [Order]

       #Busquedas avanzadas
       mejoresClientes: [TopCliente]
       mejoresVendedores: [TopVendedor]
       searchProduct(text: String!) : [Producto]
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        # Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto( id: ID!, input: ProductoInput ) : Producto
        eliminarProducto( id: ID!) : String

        # Clientes
        newCustomer(input: CustomerInput) : Customer
        updateCustomer(id: ID!, input: CustomerInput): Customer
        deleteCustomer(id: ID!) : String

        #Orders
        newOrder(input: OrderInput) : Order
        updateOrder(id: ID!, input: OrderInput ) : Order
        deleteOrder(id: ID!) : String
    }
    
`;

module.exports = typeDefs;