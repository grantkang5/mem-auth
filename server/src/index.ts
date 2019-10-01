import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import { refreshAccessToken } from "./services/auth";
import { googleRedirectURL, googleSignin } from "./services/google";

const whitelist = [
  "http://localhost:3000",
  "https://accounts.google.com/signin/oauth",
  "http://localhost:4000/oauth2",
  "http://localhost:4000",
  undefined
];

const startServer = async () => {
  const app = express();
  app.use(
    cors({
      origin: (origin, callback) => {
        console.log('LISTENING FOR ORIGIN: ', origin)
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    })
  );
  app.use(cookieParser());
  app.get("/", async (_req, res) => {
    res.send("HELLO");
  });
  app.post("/google_oauth", googleRedirectURL);
  app.get("/oauth2", googleSignin);
  app.post("/refresh_token", refreshAccessToken);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("Express server listening on 4000");
  });
};

startServer();
