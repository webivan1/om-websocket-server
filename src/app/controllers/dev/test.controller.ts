import { v4 as uuid4 } from "uuid";
import Websocket from "../../websocket/Websocket";
import { IStorage } from "../../storage/IStorage";
import { fakeCoordinates } from "../../helpers";

export const testDevController = (eventId: number, total: number, lat: number, lng: number) => {
  const storage: IStorage = Websocket.storage;

  for (let i = 0; i < total; i++) {
    const id = uuid4();
    const userId = uuid4();
    storage.set(eventId, id, {...fakeCoordinates({ lat, lng }), id, userId }).then();
  }
}