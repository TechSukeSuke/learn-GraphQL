const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const crypto = require('node:crypto');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
input MessageInput {
  content: String
  author: String
}
 
type Message {
  id: ID!
  content: String
  author: String
}
 
type Query {
  getMessage(id: ID!): Message
}
 
type Mutation {
  createMessage(input: MessageInput): Message
  updateMessage(id: ID!, input: MessageInput): Message
}
`);
 
// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}
 
// Maps username to content
const fakeDatabase = {};
 
const root = {
  getMessage({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage({ input }) {
    // Create a random id for our "database".
    const id = crypto.randomBytes(10).toString('hex');
 
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage({ id, input }) {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
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
app.listen(4000, () => {
console.log('Running a GraphQL API server at localhost:4000/graphql');
});