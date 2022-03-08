"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requests_1 = __importDefault(require("../requests"));
class Channels extends requests_1.default {
    constructor(headers) {
        super(headers);
    }
    async top(limit = 20, after, token, cursor, category_id) {
        limit = Math.max(Math.min(limit, 100), 0);
        const params = { limit };
        if (after !== undefined)
            params.after = after;
        if (token)
            params.token = token;
        if (cursor !== undefined)
            params.cursor = cursor;
        if (category_id)
            params.category_id = category_id;
        return await this.requestEndpoint("gettopchannels", {
            method: "POST",
            body: JSON.stringify(params)
        });
    }
    async get(user = "") {
        const params = {};
        typeof user === "number"
            ? params.channel_id = user
            : params.username = user;
        return await this.requestEndpoint("channels/id", {
            method: "POST",
            body: JSON.stringify(params)
        });
    }
}
exports.default = Channels;
