import { CustomError } from "./custom.error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connection to database!";
  constructor() {
    super("DB conn failed");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
