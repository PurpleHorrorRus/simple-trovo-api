"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    emotes(emote_type = 0, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("getemotes", {
                method: "POST",
                body: JSON.stringify({
                    emote_type,
                    channel_id
                })
            });
        });
    }
    followers(channel_id, limit = 20, cursor, direction = "asc") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint(`channels/${channel_id}/followers`, {
                method: "POST",
                body: JSON.stringify({
                    limit: static_1.default.limit(limit, 0, 100),
                    cursor,
                    direction
                })
            });
        });
    }
    subscribers(channelID, limit = 25, offset = 0, direction = "asc") {
        return __awaiter(this, void 0, void 0, function* () {
            const query = static_1.default.generateQuery({
                limit: static_1.default.limit(limit, 0, 100),
                offset,
                direction
            });
            return yield this.requestEndpoint(`channels/${channelID}/subscriptions?${query}`);
        });
    }
    viewers(channel_id, limit = 20, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint(`channels/${channel_id}/viewers`, {
                method: "POST",
                body: JSON.stringify({
                    limit: static_1.default.limit(limit, 0, 100000),
                    cursor: cursor || 0
                })
            });
        });
    }
    streamUrls(channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("livestreamurl", {
                method: "POST",
                body: JSON.stringify({
                    channel_id
                })
            });
        });
    }
    clips(channel_id, category_id, period, clip_id, limit = 20, cursor, direction = "asc") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("clips", {
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
        });
    }
    pastStreams(channel_id, category_id, period, past_stream_id, limit = 20, cursor, direction = "asc") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("paststreams", {
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
        });
    }
    edit(channel_id, live_title = "", category = "", language_code = "RU", audi_type = "CHANNEL_AUDIENCE_TYPE_EIGHTEENPLUS") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("channels/update", {
                method: "POST",
                body: JSON.stringify({
                    channel_id,
                    live_title,
                    category,
                    language_code: language_code.toUpperCase(),
                    audi_type
                })
            });
        });
    }
}
exports.default = Channel;
