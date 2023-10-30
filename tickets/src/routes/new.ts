import { requireAuth, validateRequest } from "@scalafrica/ticket-common";
import express, { Request, Response } from "express";
import { check } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created.publisher";
import { Ticket } from "../models/ticket.model";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    check("title").not().isEmpty().withMessage("Title is required!"),
    check("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userid: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
