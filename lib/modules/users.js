"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requests_1 = __importDefault(require("../requests"));
class Users extends requests_1.default {
    constructor(headers) {
        super(headers);
    }
    async get(users) {
        return await this.requestEndpoint("getusers", {
            method: "POST",
            body: JSON.stringify({
                user: users
            })
        });
    }
    async getUserInfo() {
        return await this.requestEndpoint("getuserinfo");
    }
}
exports.default = Users;
