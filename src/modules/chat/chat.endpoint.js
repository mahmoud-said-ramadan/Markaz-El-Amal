import { Roles } from "../../middleware/auth.js";

const chatEndpoint = {
    sendMessage: [Roles.Patient, Roles.doctor],
    updateMessage: [Roles.Patient, Roles.doctor],
    deleteMessage: [Roles.Patient, Roles.doctor],
    getChat: [Roles.Patient, Roles.doctor],
    deleteChat: [Roles.Patient, Roles.doctor]
};
export default chatEndpoint;