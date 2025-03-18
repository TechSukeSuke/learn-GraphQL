const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema('type Query { rollDice(numDice: Int!, numSides: Int): [Int] }');
 
// The root provides a resolver function for each API endpoint
const root = {
  rollDice({ numDice, numSides }) {
    const output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
};
 
const app = express();
app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');