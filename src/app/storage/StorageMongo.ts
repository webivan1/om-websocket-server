import { IStorage } from "./IStorage";
import { FilterQuery } from "mongoose";
import { ComputeBoundsType, ConnectionType, IdType } from "../types";
import { StorageModel, IStorage as IStorageModel } from "../models/storage.model";

export default class StorageMongo implements IStorage {

  protected getObjectFromModel(model: IStorageModel): ConnectionType {
    return {
      id: model.connectionId,
      userId: model.userId,
      lat: model.lat,
      lng: model.lng
    }
  }

  public async get(eventId: number, id: IdType): Promise<ConnectionType|null> {
    const model = await StorageModel.findOne({ connectionId: id, eventId }).exec();
    return model ? this.getObjectFromModel(model) : null;
  }

  public async set(eventId: number, id: IdType, connection: ConnectionType): Promise<boolean> {
    // check user is already registered
    const user = await StorageModel.findOne({ eventId, userId: connection.userId });

    if (user) {
      return false;
    }

    return !! await StorageModel.create({
      eventId,
      connectionId: id,
      userId: connection.userId,
      lat: connection.lat,
      lng: connection.lng
    });
  }

  public async remove(eventId: number, id: IdType): Promise<true> {
    await StorageModel.deleteOne({ eventId, connectionId: id }).exec();
    return true;
  }

  public async removeAll(eventId: number): Promise<true> {
    await StorageModel.deleteMany({ eventId }).exec();
    return true;
  }

  public async *chunk(eventId: number, size: number, border?: ComputeBoundsType): AsyncIterable<ConnectionType[]> {
    const perPage: number = size;
    const total: number = await this.total(eventId);
    const pages: number = Math.ceil(total / perPage);

    let page = 1;

    while (page <= pages) {
      let condition: FilterQuery<IStorageModel> = {
        eventId
      };

      if (border) {
        condition = {
          ...condition,
          lat: {
            $gt: border.from.lat,
            $lt: border.to.lat
          },
          lng: {
            $gt: border.from.lng,
            $lt: border.to.lng
          }
        }
      }

      const result = await StorageModel
        .find(condition)
        .limit(perPage)
        .skip(perPage * (page - 1))
        .exec();

      yield result.map(item => this.getObjectFromModel(item));

      page++;
    }
  }

  public async all(eventId: number): Promise<Set<ConnectionType>|null> {
    const data = new Set<ConnectionType>();
    const iterator = this.chunk(eventId, 300);

    for await (const items of iterator) {
      items.forEach(item => data.add(item));
    }

    return data;
  }

  public async total(eventId: number): Promise<number> {
    return await StorageModel.countDocuments({ eventId }).exec();
  }
}