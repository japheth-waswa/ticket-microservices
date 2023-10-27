import { json } from "body-parser";
import cookieSession from "cookie-session";
import debug from "debug";
import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found.error";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { currentUserRouter } from "./routes/current-user.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import { utilInspection } from "./utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:app");

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
