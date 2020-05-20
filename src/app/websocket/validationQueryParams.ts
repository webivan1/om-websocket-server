import { validate } from "validate.js";
import { RequestQueryParamsType } from "../types";

const rules = {
  eventId: {
    presence: true,
    numericality: true
  },
  duration: {
    presence: true,
    numericality: true
  },
  finishedAt: {
    presence: true,
    numericality: true
  },
  startAt: {
    presence: true,
    numericality: true
  },
  timezone: {
    presence: true,
    format: {
      pattern: /^(\+|-)\d{1,2}\:00$/
    }
  }
}

export const isValidateParams = (params: RequestQueryParamsType): boolean => {
  const validator = validate(params, rules);
  return validator === undefined;
}