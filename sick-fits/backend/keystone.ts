import { createAuth } from "@keystone-next/auth";
import { createSchema, config } from "@keystone-next/keystone/schema";
import "dotenv/config";
import { statelessSessions, withItemData } from "@keystone-next/keystone/session";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 24 * 60 * 60,
  secret: process.env.COOKIE_SECRET
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      }
    },
    db: {
      adapter: "mongoose",
      url: databaseURL
      // TODO: Add data seeding here
    },
    lists: createSchema({
      User,
      Product,
    }),
    ui: {
      isAccessAllowed: ({ session }) => {
        // console.log({ session });
        return !!session?.data
      }
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: "id"
    })
  })
);
