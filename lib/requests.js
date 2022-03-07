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
const node_fetch_1 = __importDefault(require("node-fetch"));
const static_1 = __importDefault(require("./static"));
class TrovoRequests extends static_1.default {
    constructor(headers) {
        super();
        this.apiRoot = "https://open-api.trovo.live/openplatform";
        this.headers = headers;
    }
    request(url, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(url, Object.assign({ headers: this.headers }, params));
            return (params.method !== "PATCH" && params.method !== "DELETE" && params.method !== "PUT") || params.ignoreStatus
                ? response.status === 200 ? yield response.json() : this.handleError(response.statusText)
                : response.status === 204;
        });
    }
    requestEndpoint(endpoint, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.body) {
                params.method = "POST";
            }
            return yield this.request(`${this.apiRoot}/${endpoint}`, params);
        });
    }
}
exports.default = TrovoRequests;
