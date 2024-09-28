const express = require('express');
const graphqlRoute = require('./routes/graphql');

const app = express();
const port = 4000;

// Route for GraphQL
app.use(graphqlRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/graphql`);
});
