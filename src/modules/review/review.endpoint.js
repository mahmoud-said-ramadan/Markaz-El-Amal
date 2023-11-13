import { Roles } from "../../middleware/auth.js";

const reviewEndpoint = {
  add_update: [Roles.user],
  get_delete: Object.values(Roles),
};

export default reviewEndpoint;
