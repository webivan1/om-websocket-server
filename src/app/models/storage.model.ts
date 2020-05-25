import * as mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IStorage extends Document {
  userId: string;
  eventId: number;
  lat: number;
  lng: number;
}

const StorageSchema: Schema = new Schema({
  userId: { type: String, index: true, required: true },
  eventId: { type: String, index: true, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

export const StorageModel = mongoose.model<IStorage>('Storage', StorageSchema);