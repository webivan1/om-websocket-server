import { validate } from "validate.js";
import { ConnectionType, NewConnectionType } from "../types";

const rules = {
  lat: {
    presence: true,
    numericality: true,
  },
  lng: {
    presence: true,
    numericality: true,
  },
  userId: {
    presence: true,
    type: 'string',
  },
}

export const isValidateNewConnection = (connection: NewConnectionType): boolean => {
  const validator = validate(connection, rules);
  return validator === undefined;
}