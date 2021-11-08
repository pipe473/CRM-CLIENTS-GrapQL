const { gql } = require('apollo-server');

// SCHEMA
const typeDefs = gql `

    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    input UsuarioInput{
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    type Query {
        obtenerCursos: String
    }

    type Mutation{
        nuevoUsuario(input: UsuarioInput) : Usuario
    }
`;

module.exports = typeDefs;