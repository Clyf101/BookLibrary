// Import dependencies
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const mongoose = require('mongoose');
const routes = require('./routes');

// Define constants
const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Add routes
app.use(routes);

// Start server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
