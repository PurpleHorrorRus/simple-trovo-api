"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./chat/service"));
const requests_1 = __importDefault(require("../requests"));
class Chat extends requests_1.default {
    constructor(headers) {
        super(headers);
        this.service = new service_1.default();
        this.userRoles = {
            streamer: 100000,
            mod: 100001,
            editor: 100002,
            subscriber: 100004,
            supermod: 100005,
            follower: 100006,
            custom_role: 200000,
            admin: 500000,
            warden: 500001,
            ace: 300000,
            ace_plus: 300001
        };
    }
    async token() {
        const response = await this.requestEndpoint("chat/token");
        return response.token;
    }
    async channelToken(channelID) {
        const response = await this.requestEndpoint(`chat/channel-token/${channelID}`);
        return response.token;
    }
    async send(content, channel_id) {
        return await this.requestEndpoint("chat/send", {
            method: "POST",
            body: JSON.stringify({
                content,
                channel_id
            })
        });
    }
    async delete(channelID, messageID, uID) {
        return await this.requestEndpoint(`channels/${channelID}/messages/${messageID}/users/${uID}`, {
            method: "DELETE"
        });
    }
    async command(command, chaneelID) {
        command = command.replace("/", "");
        return await this.requestEndpoint("channels/command", {
            method: "POST",
            body: JSON.stringify({
                command,
                channel_id: chaneelID
            })
        });
    }
}
exports.default = Chat;
