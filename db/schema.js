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

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
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
    input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }

    type Query {
       # Usuarios
       obtenerUsuario(token: String!) : Usuario

       # Productos
       obtenerProductos: [Producto]
       getProductById(id: ID!) : Producto
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
        nuevoCliente(input: ClienteInput) : Cliente
    }
    
`;

module.exports = typeDefs;