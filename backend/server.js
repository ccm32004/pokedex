const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema'); // Make sure this path is correct
const resolvers = require('./graphql/resolvers'); // Make sure this path is correct

// Create an Express app
const app = express();

// Create an Apollo Server with the schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo Server
server.start().then(() => {
  // Apply middleware after the server starts
  server.applyMiddleware({ app });

  // Define a port and start the server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
