"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const static_1 = __importDefault(require("./static"));
class TrovoRequests extends static_1.default {
    constructor(headers) {
        super();
        this.apiRoot = "https://open-api.trovo.live/openplatform";
        this.headers = headers;
    }
    async request(url, params = {}) {
        const response = await (0, node_fetch_1.default)(url, {
            headers: this.headers,
            ...params
        });
        const json = await response.json();
        return response.ok ? json : this.handleError(json);
    }
    async requestEndpoint(endpoint, params = {}, ignoreValidating = false) {
        if (this.headers.has("Authorization") && !ignoreValidating) {
            await this.request(`${this.apiRoot}/validate`).catch(e => {
                this.emit("error", e);
                throw e;
            });
        }
        if (params.body) {
            params.method = "POST";
        }
        return await this.request(`${this.apiRoot}/${endpoint}`, params);
    }
}
exports.default = TrovoRequests;
