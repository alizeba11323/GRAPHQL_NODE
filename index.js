import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const books = [
  {
    id: 1,
    name: "Book One",
    author: 1,
    status: "not_available",
  },
  {
    id: 2,
    name: "Book Two",
    author: 2,
    status: "available",
  },
  {
    id: 3,
    name: "Book Three",
    author: 3,
    status: "not_available",
  },
  {
    id: 4,
    name: "Book Four",
    author: 3,
    status: "not_available",
  },
  {
    id: 5,
    name: "Book Five",
    author: 1,
    status: "not_available",
  },
];

let author = [
  {
    id: 1,
    name: "Author One",
    books: [1, 5],
  },
  {
    id: 2,
    name: "Author Two",
    books: [2],
  },
  {
    id: 3,
    name: "Author Three",
    books: [3, 4],
  },
];

const typeDefs = `
enum STATUS {
  available,
  not_available
}
type Book {
  id:ID!,
  name:String!,
  author: Author,
  status:STATUS
}
type Author {
  id:ID!,
  name:String!
  books:[Book!]!
}
type Query{
  getAllBooks:[Book!]!
}
input CreateBookInput {
  id:ID!
  name: String!
  author:ID!
  status:STATUS
}
type Mutation{
  createBook(inp:CreateBookInput):[Book!]!
}



`;

const resolvers = {
  Author: {
    books(parent, args, context, info) {
      const items = books.filter((item) => parent.books.includes(item.id));
      return items;
    },
  },
  Book: {
    author(parent, args, context, info) {
      const aut = author.find((au) => au.id === parent.author);
      return aut;
    },
  },

  Query: {
    getAllBooks() {
      return books;
    },
  },
  Mutation: {
    createBook(
      parent,
      { inp: { id, name, author: bookAuthor, status } },
      context,
      info
    ) {
      books.push({ id: Number(id), name, author: Number(bookAuthor), status });
      const a = author.map((auth) => {
        if (auth.id === Number(bookAuthor)) {
          auth.books.push(Number(id));
          return auth;
        }
        return auth;
      });
      author = a;
      return books;
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

// status : {
//   not_available,
//   available
// }
