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
    token() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.requestEndpoint("chat/token");
            return response.token;
        });
    }
    channelToken(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.requestEndpoint(`chat/channel-token/${channelID}`);
            return response.token;
        });
    }
    send(content, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint("chat/send", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    channel_id
                })
            });
        });
    }
    delete(channelID, messageID, uID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestEndpoint(`channels/${channelID}/messages/${messageID}/users/${uID}`, {
                method: "DELETE"
            });
        });
    }
}
exports.default = Chat;
