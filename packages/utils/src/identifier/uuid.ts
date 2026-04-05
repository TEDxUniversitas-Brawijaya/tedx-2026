import { v4, v7, validate } from "uuid";

export const createUUIDv4 = () => {
  return v4();
};

export const createUUIDv7 = () => {
  return v7();
};

export const validateUUID = (uuid: string) => {
  return validate(uuid);
};
