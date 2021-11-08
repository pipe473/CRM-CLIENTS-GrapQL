

// RESOLVERS

const resolvers = {
  Query: {
    obtenerCursos: () => "Hola mundo!!"
  },
  Mutation: {
    nuevoUsuario: (_, { input }) => {
      console.log(input);

      return "Creando..."      
    }
  }
}

module.exports = resolvers;
