import { app, server } from "./server";
import { Request, Response } from "express";
import { v4 as uuid4 } from "uuid";
import config from "./config";
import Websocket from "./websocket/Websocket";
import { DB } from "./db";
import { EventModel } from "./db/event/EventModel";
import StorageRedis from "./storage/StorageRedis";

// Testing connection
if (process.env.NODE_ENV === 'development') {
  // view for test connection
  app.get('/form', async (req: Request, res: Response) => {
    const id: number = req.query.eventId ? +req.query.eventId : 0;

    try {
      const connection = await DB.connect();
      const eventModel = new EventModel(connection);
      const event = await eventModel.findById(id);

      if (!event) {
        return res.render('404');
      }

      return res.render('index', {
        event,
        eventJson: JSON.stringify({
          ...event,
          finishedAt: (new Date(event.finish_at)).getTime(),
          startAt: (new Date(event.start_at)).getTime(),
          timezone: config.timezone
        })
      });
    } catch (e) {
      console.log(e.message);
    }
  });

  app.get('/test', (req: Request, res: Response) => {
    const eventId = req.query.eventId ? +req.query.eventId : 0;
    const total = req.query.total ? +req.query.total : 0;
    const lat = req.query.lat ? +req.query.lat : 0;
    const lng = req.query.lng ? +req.query.lng : 0;

    const storage = new StorageRedis();

    for (let i = 0; i < total; i++) {
      const id = uuid4();
      storage.set(eventId, id, { lat, lng, id });
    }

    res.send(`Ok`);
  });
}

const websocket = new Websocket(server);
websocket.listen();
websocket.runLogger();

server.listen(config.port, () => {
  console.log('Server started', config.port, process.env.NODE_ENV);
});