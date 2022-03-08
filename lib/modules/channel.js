"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const static_1 = __importDefault(require("../static"));
const requests_1 = __importDefault(require("../requests"));
class Channel extends requests_1.default {
    constructor(headers) {
        super(headers);
    }
    async emotes(emote_type = 0, channel_id) {
        return await this.requestEndpoint("getemotes", {
            method: "POST",
            body: JSON.stringify({
                emote_type,
                channel_id
            })
        });
    }
    async followers(channel_id, limit = 20, cursor, direction = "asc") {
        return await this.requestEndpoint(`channels/${channel_id}/followers`, {
            method: "POST",
            body: JSON.stringify({
                limit: static_1.default.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }
    async subscribers(channelID, limit = 25, offset = 0, direction = "asc") {
        const query = static_1.default.generateQuery({
            limit: static_1.default.limit(limit, 0, 100),
            offset,
            direction
        });
        return await this.requestEndpoint(`channels/${channelID}/subscriptions?${query}`);
    }
    async viewers(channel_id, limit = 20, cursor) {
        return await this.requestEndpoint(`channels/${channel_id}/viewers`, {
            method: "POST",
            body: JSON.stringify({
                limit: static_1.default.limit(limit, 0, 100000),
                cursor: cursor || 0
            })
        });
    }
    async streamUrls(channel_id) {
        return await this.requestEndpoint("livestreamurl", {
            method: "POST",
            body: JSON.stringify({
                channel_id
            })
        });
    }
    async clips(channel_id, category_id, period, clip_id, limit = 20, cursor, direction = "asc") {
        return await this.requestEndpoint("clips", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                category_id,
                period,
                clip_id,
                limit: static_1.default.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }
    async pastStreams(channel_id, category_id, period, past_stream_id, limit = 20, cursor, direction = "asc") {
        return await this.requestEndpoint("paststreams", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                category_id,
                period,
                past_stream_id,
                limit: static_1.default.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }
    async edit(channel_id, live_title = "", category_id = "", language_code = "RU", audi_type = "CHANNEL_AUDIENCE_TYPE_EIGHTEENPLUS") {
        return await this.requestEndpoint("channels/update", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                live_title,
                category_id,
                language_code: language_code.toUpperCase(),
                audi_type
            })
        });
    }
}
exports.default = Channel;
