const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

// SERVIDOR

const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Arrancar servidor
server.listen().then(({ url }) => {
    console.log(`servidor listo en URL ${url}`);
});