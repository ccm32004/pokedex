const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');

const router = express.Router();

// /graphql route
router.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

module.exports = router;
