import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const books = [
  {
    id: 1,
    name: "Book One",
    author: "Author One",
  },
  {
    id: 2,
    name: "Book Two",
    author: "Author Two",
  },
  {
    id: 3,
    name: "Book Three",
    author: "Author Three",
  },
  {
    id: 4,
    name: "Book Four",
    author: "Author Four",
  },
  {
    id: 5,
    name: "Book Five",
    author: "Author One",
  },
];

const typeDefs = `
 type Book {
    id: ID!,
    name:String,
    author:String,
    status: String 
 }
 type CreateBook {
  message: String!,
  book:[Book!]!
 }
 type Query {
    hello:String,
    getAllBooks:[Book!]! 
    getSingleBook(id:ID!):Book
 }
 input CreateInputType {
  id: ID!,
  name:String!,
  author: String,
  status:String!
 }
 type Mutation {
    createBook(inputBook:CreateInputType): CreateBook!
 }

`;
const resolvers = {
  Query: {
    hello() {
      return "Hello World";
    },
    getAllBooks() {
      return books;
    },
    getSingleBook(parent, { id }, context, info) {
      return books.find((book) => book.id === Number(id));
    },
  },
  Mutation: {
    createBook(_, { inputBook: { id, name, author } }, context, info) {
      books.push({ id, name, author });
      return {
        message: "Book Created Successfully",
        book: books,
      };
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, { listen: 4000 }).then(({ url }) =>
  console.log("App running on server " + url)
);
