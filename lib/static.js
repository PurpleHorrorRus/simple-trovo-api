"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Static {
    handleError(error) {
        throw new Error(error);
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
