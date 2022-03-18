"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrovoAPI = void 0;
const node_fetch_1 = require("node-fetch");
const fs_1 = __importDefault(require("fs"));
const static_1 = __importDefault(require("./lib/static"));
const users_1 = __importDefault(require("./lib/modules/users"));
const categories_1 = __importDefault(require("./lib/modules/categories"));
const channel_1 = __importDefault(require("./lib/modules/channel"));
const channels_1 = __importDefault(require("./lib/modules/channels"));
const chat_1 = __importDefault(require("./lib/modules/chat"));
const scopes_json_1 = __importDefault(require("./lib/scopes.json"));
const requests_1 = __importDefault(require("./lib/requests"));
class TrovoAPI {
    constructor(config) {
        this.headers = new node_fetch_1.Headers();
        this.users = new users_1.default(this.headers);
        this.categories = new categories_1.default(this.headers);
        this.channel = new channel_1.default(this.headers);
        this.channels = new channels_1.default(this.headers);
        this.chat = new chat_1.default(this.headers);
        this.requests = new requests_1.default(this.headers);
        this.accessToken = "";
        this.refreshToken = "";
        this.config = config;
        this.headers.set("Accept", "application/json");
        this.headers.set("Client-ID", this.config.client_id);
        this.headers.set("Content-Type", "application/json");
    }
    getAuthLink(scopes = [], response_type = "code") {
        if (scopes.length === 0) {
            scopes = scopes_json_1.default;
        }
        const loginRoot = "https://open.trovo.live/page/login.html";
        const joinedScopes = scopes.join("+");
        const params = {
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            response_type,
            scope: joinedScopes
        };
        const query = static_1.default.generateQuery(params);
        return `${loginRoot}?${query}`;
    }
    async validate() {
        return await this.requests.requestEndpoint("validate");
    }
    async refresh() {
        const response = await this.requests.requestEndpoint("refreshtoken", {
            body: JSON.stringify({
                client_secret: this.config.client_secret,
                grant_type: "refresh_token",
                refresh_token: this.refreshToken
            })
        });
        this.update(response);
        this.write(response);
        return response;
    }
    async auth(access_token = "") {
        if (access_token) {
            this.update({ access_token });
            return this;
        }
        else if (this.config.credits) {
            if (!fs_1.default.existsSync(this.config.credits)) {
                throw new Error("Invalid credits path");
            }
            let credits = fs_1.default.readFileSync(this.config.credits);
            credits = JSON.parse(credits);
            this.update(credits);
            const response = await this.refresh().catch(() => {
                throw new Error("Refresh token are expired");
            });
            this.refreshInterval = setInterval(() => this.refresh(), response.expires_in * 1000);
            return this;
        }
        throw new Error("Incorrect login credits");
    }
    async exchange(code) {
        const response = await this.requests.requestEndpoint("exchangetoken", {
            method: "POST",
            body: JSON.stringify({
                client_secret: this.config.client_secret,
                grant_type: "authorization_code",
                code,
                redirect_uri: this.config.redirect_uri
            })
        });
        this.update(response);
        this.write(response);
        return response;
    }
    update(response) {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.headers.set("Authorization", `OAuth ${this.accessToken}`);
    }
    write(response) {
        if (this.config.credits) {
            response = JSON.stringify(response, null, 4);
            return fs_1.default.writeFileSync(this.config.credits, response);
        }
        throw new Error("Invalid credits path");
    }
}
exports.TrovoAPI = TrovoAPI;
