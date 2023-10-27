import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(201);
});

it("returns 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "jennydoegmail.com", password: "pswd1234" })
    .expect(400);
});

it("returns 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "jennydo@gmail.com", password: "x" })
    .expect(400);
});

it("returns 400 with missing email & password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "janedoe@gmail.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "u" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "janedoe@gmail.com", password: "psw0987" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "janedoe@gmail.com", password: "123456789" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "janedoe@gmail.com", password: "psw0987" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
