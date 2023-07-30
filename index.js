import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./db.js";

const typeDefs = `
enum STATUS {
  available,
  not_available
}
interface Book1 {
  id:ID!,
  title:String
}
type Courses {
  id:ID!,
  name: String!
}
type TextBook implements Book1 {
  id:ID!,
  title:String
  courses:[Courses!]!
}
enum COLOR {
  GREEN,
  BLUE,
  RED
}
type ColorTextBook implements Book1 {
  id:ID!,
  title:String,
  color:COLOR
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
type Error {
  message: String!,
  id:ID!
}
union BookResult = Book | Error
type Query{
  getAllBooks:[Book!]!
  getSingleBook(id:ID!): BookResult!,
  getAllBooks1:[Book1]
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
  TextBook: {
    courses: (parent, args, context, info) => {
      return context.courses.filter((item) => parent.courses.includes(item.id));
    },
  },
  Book1: {
    __resolveType(obj, context, info) {
      if (obj.courses) {
        return "TextBook";
      }
      if (obj.color) {
        return "ColorTextBook";
      }
      return null;
    },
  },
  BookResult: {
    __resolveType(obj, context, info) {
      if (obj.message) {
        return "Error";
      }
      if (obj.name) {
        return "Book";
      }
      return null;
    },
  },
  Author: {
    books(parent, args, context, info) {
      const items = context.books.filter((item) =>
        parent.books.includes(item.id)
      );
      return items;
    },
  },
  Book: {
    author(parent, args, context, info) {
      const aut = context.author.find((au) => au.id === parent.author);
      return aut;
    },
  },

  Query: {
    getAllBooks1(parent, args, context, info) {
      return context.books1;
    },
    getAllBooks(parent, args, context, info) {
      return context.books;
    },
    getSingleBook(parent, { id }, context, info) {
      const book = context.books.find((book) => book.id === Number(id));
      if (!book) {
        return {
          message: "Book Not Found",
          id,
        };
      }
      return book;
    },
  },
  Mutation: {
    createBook(
      parent,
      { inp: { id, name, author: bookAuthor, status } },
      context,
      info
    ) {
      context.books.push({
        id: Number(id),
        name,
        author: Number(bookAuthor),
        status,
      });
      const a = context.author.map((auth) => {
        if (auth.id === Number(bookAuthor)) {
          auth.books.push(Number(id));
          return auth;
        }
        return auth;
      });
      context.author = a;
      return context.books;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: 4000,
  context: () => {
    return {
      books: db.books,
      author: db.author,
      books1: db.books1,
      courses: db.courses,
    };
  },
}).then(({ url }) => console.log("App running on server " + url));
