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

    type Query {
        obtenerCursos: String
    }

    type Mutation{
        nuevoUsuario : String
    }
`;

module.exports = typeDefs;