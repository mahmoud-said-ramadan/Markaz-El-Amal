import { Roles } from "../../middleware/auth.js";

const reviewEndpoint = {
  add_update: [Roles.Patient],
  get_delete: Object.values(Roles),
};

export default reviewEndpoint;
