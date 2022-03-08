"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requests_1 = __importDefault(require("../requests"));
class Categories extends requests_1.default {
    constructor(headers) {
        super(headers);
    }
    async get() {
        return await this.requestEndpoint("categorys/top");
    }
    async search(query, limit = 20) {
        return await this.requestEndpoint("searchcategory", {
            method: "POST",
            body: JSON.stringify({
                query,
                limit
            })
        });
    }
}
exports.default = Categories;
