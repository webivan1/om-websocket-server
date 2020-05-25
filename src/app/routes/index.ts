import { Application } from "express";
import config from "../config";

import { formDevController } from "../controllers/dev/form.controller";
import { testDevController } from "../controllers/dev/test.controller";

export function routes(app: Application) {

  if (config.mode === 'development') {
    // register some routes for development

    app.get('/form', async (req, res) => {
      try {
        const eventId: number = req.query.eventId ? +req.query.eventId : 0;
        const response = await formDevController(eventId);
        return res.render('index', response);
      } catch (e) {
        return res.render('404', { message: e.message });
      }
    });

    app.get('/test', async (req, res) => {
      const eventId = req.query.eventId ? +req.query.eventId : 0;
      const total = req.query.total ? +req.query.total : 0;
      const lat = req.query.lat ? +req.query.lat : 0;
      const lng = req.query.lng ? +req.query.lng : 0;

      testDevController(eventId, total, lat, lng);

      res.send('OK');
    });
  }

}