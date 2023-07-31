import express from "express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "graphql-tag";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { PubSub } from "graphql-subscriptions";
const posts = [];
const pubsub = new PubSub();
const myFunc = async () => {
  const app = express();
  const port = 4000;
  const httpServer = createServer(app);

  const typeDefs = gql`
    type Query {
      hello: String!
    }
    type Post {
      id: ID!
      title: String!
      description: String!
    }
    type Mutation {
      createPost(id: ID!, title: String!, description: String!): [Post!]!
    }
    type Subscription {
      posts: [Post!]!
    }
  `;
  const resolvers = {
    Query: {
      hello() {
        return "Hello";
      },
    },
    Mutation: {
      createPost(parent, { id, title, description }, context, info) {
        posts.push({ id, title, description });
        pubsub.publish("CREATE_POST", { posts });
        return posts;
      },
    },
    Subscription: {
      posts: {
        subscribe: () => {
          return pubsub.asyncIterator(["CREATE_POST"]);
        },
      },
    },
  };
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const cleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              return cleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: () => pubsub,
    })
  );
  httpServer.listen(port, function () {
    console.log("server running on http://localhost:4000/graphql");
  });
};
myFunc();
