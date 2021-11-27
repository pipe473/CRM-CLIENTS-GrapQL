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



    type Query {
       # Usuarios
       obtenerUsuario(token: String!) : Usuario

       # Productos
       obtenerProductos: [Producto]
       getProductById(id: ID!) : Producto

       # Clientes
       getCustomers: [Customer]
       getCustomerSeller: [Customer]
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
    }
    
`;

module.exports = typeDefs;