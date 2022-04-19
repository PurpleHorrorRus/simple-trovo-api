"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class Static extends events_1.default {
    constructor() {
        super();
    }
    handleError(error) {
        throw new Error(error.message || error);
    }
    static generateQuery(params) {
        const entries = Object.entries(params);
        const mappedPairs = entries.map(([key, value]) => (`${key}=${value}`));
        return mappedPairs.join("&");
    }
    static limit(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
}
exports.default = Static;
