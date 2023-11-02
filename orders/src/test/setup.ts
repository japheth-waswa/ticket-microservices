import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "abcd1234";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //build a  JWT payload {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object.{jwt:MY_JWT}
  const session = { jwt: token };

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //take JSON & encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string as endcoded cookie data.
  return [`session=${base64}`];
};
