import request from "supertest";
import { app } from "../../app";

it("clear cookie after signing out", async () => {
  //create user
  await request(app)
    .post("/api/users/signup")
    .send({ email: "jennydoe@gmail.com", password: "pswd1234" })
    .expect(201);

  //valid login
  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  //cookie set
  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
