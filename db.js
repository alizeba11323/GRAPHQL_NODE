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
const books1 = [
  {
    id: 1,
    title: "Book Title One",
    color: "RED",
  },
  {
    id: 2,
    title: "Book Title Two",
    courses: [1, 2, 3],
  },
];
const courses = [
  { id: 1, name: "Javascript" },
  { id: 2, name: "Nodejs Course" },
  { id: 3, name: "React" },
];
const db = {
  books,
  author,
  books1,
  courses,
};

export default db;
