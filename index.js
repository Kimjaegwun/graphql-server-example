// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";

// Scheme Definition
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: Int
    title: String
    author: String
  }

  # type User {
  #   id: Int
  #   name: String
  # }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type Query {
    books: [Book]
    book(id: Int!): Book
    # users: [User]
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

// const users = [
//   {
//     id: 1,
//     name: "king",
//   },
//   {
//     id: 2,
//     name: "Wang",
//   },
// ];

const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args, contextValue, info) => {
      return books.find((book) => book.id === args.id);
    },
    // users: () => users,
  },
  Mutation: {
    addBook: (_, args) => {
      const { title, author } = args;
      const book = { id: books.length, title, author };
      books.push(book);
      return book;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
