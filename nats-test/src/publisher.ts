import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created.publisher";
console.clear();

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("publisher connected to NATS");
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // client.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
  try {
    const publisher = new TicketCreatedPublisher(client);
    await publisher.publish({ id: "321", title: "concert", price: 5 });
  } catch (e) {
    console.error(e);
  }
});
