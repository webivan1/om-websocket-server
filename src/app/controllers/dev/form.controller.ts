import { DB } from "../../mysql";
import { EventModel } from "../../mysql/event/EventModel";
import config from "../../config";

export const formDevController = async (eventId: number) => {
  const connection = await DB.connect();
  const eventModel = new EventModel(connection);
  const event = await eventModel.findById(eventId);

  if (!event) {
    throw new Error('This event is not found');
  }

  return {
    event,
    eventJson: JSON.stringify({
      ...event,
      finishedAt: (new Date(event.finish_at)).getTime(),
      startAt: (new Date(event.start_at)).getTime(),
      timezone: config.timezone
    })
  };
}