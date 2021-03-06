const { ApolloServer, gql } = require('apollo-server');
const { find, filter } = require('lodash');

const books = [
  { id: 1, title: 'The Trials of Brother Jero', rating: 8, authorId: 1 },
  { id: 2, title: 'Half of a Yellow Sun', rating: 9, authorId: 3 },
  { id: 3, title: 'Americanah', rating: 9, authorId: 3 },
  { id: 4, title: 'King Baabu', rating: 9, authorId: 1 },
  { id: 5, title: 'Children of Blood and Bone', rating: 8, authorId: 2 },
];

const authors = [
  { id: 1, firstName: 'Wole', lastName: 'Soyinka' },
  { id: 2, firstName: 'Tomi', lastName: 'Adeyemi' },
  { id: 3, firstName: 'Chimamanda', lastName: 'Adichie' },
];


const typeDefs = `
  type Author {
    id: Int!
    firstName: String!
    lastName: String!
    books: [Book]!  # the list of books by this author
  }

  type Book {
    id: Int!
    title: String!
    rating: Integer!
    author: Author!
  }

  type Query {
    books: [Book!]!,
    book(id: Int!): Book!
    author(id: Int!): Author!
  }

  # the schema allows the following query
  type Query {
    books: [Book!]!,
    book(id: Int!): Book!
    author(id: Int!): Author!
  }

  # this schema allows the following mutation
  type Mutation {
    addBook(title: String!, rating: Integer!, authorId: Int!): Book!
  }
`;

let bookId = 5;
let authorId = 3;

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => find(books, { id: id }),
    author: (_, { id }) => find(authors, { id: id }),
  },
  Mutation: {
    addBook: (_, {title, rating, authorId }) => {
      bookId++;

      const newBook = {
        id: bookId,
        title,
        rating,
        authorId
      };

      books.push(newBook);
      return newBook;
    }
  },
  Author: {
    books: (author) => filter(books, { authorId: author.id }),
  },
  Book: {
    author: (book) => find(authors, { id: book.authorId }),
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});