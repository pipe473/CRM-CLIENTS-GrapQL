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

    type Query {
       # Usuarios
       obtenerUsuario(token: String!) : Usuario

       # Productos
       obtenerProductos: [Producto]
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        # Productos
        nuevoProducto(input: ProductoInput) : Producto
    }
    
`;

module.exports = typeDefs;