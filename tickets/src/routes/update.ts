import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@scalafrica/ticket-common";
import express, { Request, Response } from "express";
import { check } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated.publisher";
import { Ticket } from "../models/ticket.model";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    check("title").not().isEmpty().withMessage("Titile is required"),
    check("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided & greate than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    const { title, price } = req.body;
    ticket.set({ title, price });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userid: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
