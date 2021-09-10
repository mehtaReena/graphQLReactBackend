const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

let todos = [
  {
    id: Date.now().toString(),
    text: 'My first task',
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
    removeTodo(id: String!):String
    updateTodo(id: String!):String
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
      return args.id;
    },
    updateTodo: (parent, args, context, info)  => {
       console.log(args)
       for (let i in todos) {
         if (todos[i].id === args.id) {
           todos[i].completed = !todos[i].completed;
         }
       }
      return args.id;
    }
  }
};





async function startExpressApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();

  server.applyMiddleware({ app });


const PORT = process.env.PORT || 4000

  await new Promise(resolve => app.listen({ port:4000 }, resolve));
  console.log(`Server ready at ${server.graphqlPath}`);
  return { server, app };
}

startExpressApolloServer();