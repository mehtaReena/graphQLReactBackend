const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

let todos = [
  {
    id: Date.now().toString(),
    text: 'Hello from GraphQL',
    completed: true,
  },
];

const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    createTodo(text: String!):Todo
    removeTodo(id: String!):[Todo]
    updateTodo(id: String!):[Todo]
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo:(parent, args, context, info)  => {
        //  console.log(args)

         const todoObj ={
           id: Date.now().toString(),
          text: args.text,
          completed: false,}

       todos.push(todoObj);
        return todoObj;
      // return "Test"
    },
    removeTodo: (parent, args, context, info)  => {
      // console.log(args)
       for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return todos;
    },
    updateTodo: (parent, args, context, info)  => {
      // console.log(args)
       for (let i in todos) {
         if (todos[i].id === args.id) {
           todos[i].completed = !todos[i].completed;
         }
       }
      return todos;
    }
  }
};





async function startExpressApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();

  server.applyMiddleware({ app });


const PORT = process.env.PORT || 4000

  await new Promise(resolve => app.listen({ port:PORT }, resolve));
  console.log(`Server ready at ${server.graphqlPath}`);
  return { server, app };
}

startExpressApolloServer();