import {
  accountRelations,
  accountTable,
  sessionRelations,
  sessionTable,
  userRelations,
  userTable,
  verificationTable,
} from "./auth";

export const schema = {
  userTable,
  sessionTable,
  accountTable,
  verificationTable,
  userRelations,
  accountRelations,
  sessionRelations,
};
