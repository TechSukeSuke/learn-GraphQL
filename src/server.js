const express = require("express")
const { createHandler } = require("graphql-http/lib/use/express")
const { buildSchema } = require("graphql")
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)
 
// The root provides a resolver function for each API endpoint
const root = {
  quoteOfTheDay() {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random() {
    return Math.random()
  },
  rollDice(args) {
    const output = []
    for (let i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },
}
 
const app = express()

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at localhost:4000/graphql")