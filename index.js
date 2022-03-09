"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrovoAPI = void 0;
const node_fetch_1 = require("node-fetch");
const static_1 = __importDefault(require("./lib/static"));
const users_1 = __importDefault(require("./lib/modules/users"));
const categories_1 = __importDefault(require("./lib/modules/categories"));
const channel_1 = __importDefault(require("./lib/modules/channel"));
const channels_1 = __importDefault(require("./lib/modules/channels"));
const chat_1 = __importDefault(require("./lib/modules/chat"));
const scopes_json_1 = __importDefault(require("./lib/scopes.json"));
class TrovoAPI {
    constructor(config) {
        this.headers = new node_fetch_1.Headers();
        this.users = new users_1.default(this.headers);
        this.categories = new categories_1.default(this.headers);
        this.channel = new channel_1.default(this.headers);
        this.channels = new channels_1.default(this.headers);
        this.chat = new chat_1.default(this.headers);
        this.config = config;
        if (!("access_token" in config)) {
            console.warn("You must to specify redirect_uri");
        }
        else {
            this.headers.set("Accept", "application/json");
            this.headers.set("Client-ID", this.config.client_id);
            this.headers.set("Authorization", `OAuth ${this.config.access_token}`);
        }
    }
    getAuthLink(scopes = [], redirect_uri) {
        if (scopes.length === 0) {
            scopes = scopes_json_1.default;
        }
        const loginRoot = "https://open.trovo.live/page/login.html";
        const joinedScopes = scopes.join("+");
        const params = {
            client_id: this.config.client_id,
            redirect_uri,
            response_type: "token",
            scope: joinedScopes
        };
        const query = static_1.default.generateQuery(params);
        return `${loginRoot}?${query}`;
    }
}
exports.TrovoAPI = TrovoAPI;
