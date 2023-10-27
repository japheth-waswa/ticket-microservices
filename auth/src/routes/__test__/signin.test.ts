import request from "supertest";
import { app } from "../../app";

it("fails when email does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(400);
});

it("fails when incorrect pasword supplied", async () => {
  //create user
  await request(app)
    .post("/api/users/signup")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(201);

  //invalid password
  await request(app)
    .post("/api/users/signin")
    .send({ email: "jennydoe@gmail.com", password: "pswd12345" })
    .expect(400);
});

it("successful login with cookie set", async () => {
  //create user
  await request(app)
    .post("/api/users/signup")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(201);

  //valid login
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(201);

  //cookie set
  expect(response.get("Set-Cookie")).toBeDefined();
});
