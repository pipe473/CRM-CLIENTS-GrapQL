const { gql } = require('apollo-server');

// SCHEMA
const typeDefs = gql `
    type Query {
        obtenerCursos: String
    }
`;

module.exports = typeDefs;