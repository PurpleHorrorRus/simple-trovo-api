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
const requests_1 = __importDefault(require("../requests"));
class Channels extends requests_1.default {
    constructor(headers) {
        super(headers);
    }
    top(limit = 20, after, token, cursor, category_id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield this.requestEndpoint("gettopchannels", {
                method: "POST",
                body: JSON.stringify(params)
            });
        });
    }
    get(user = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {};
            typeof user === "number"
                ? params.channel_id = user
                : params.username = user;
            return yield this.requestEndpoint("channels/id", {
                method: "POST",
                body: JSON.stringify(params)
            });
        });
    }
}
exports.default = Channels;
