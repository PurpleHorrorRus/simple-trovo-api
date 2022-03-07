import { Headers } from "node-fetch";

import Static from "./static";
import Users from "./modules/users";
import Categories from "./modules/categories";
import Channel from "./modules/channel";
import Channels from "./modules/channels";
import Chat from "./modules/chat";

import { AuthParams, Errors } from "./interfaces/primary";
import { TrovoConfig } from "./types/primary";

import defaultScopes from "./scopes.json";

class TrovoAPI {
    config: TrovoConfig;
    errors: Errors;
    headers: Headers = new Headers();

    users: Users = new Users(this.headers);
    categories: Categories = new Categories(this.headers);
    channel: Channel = new Channel(this.headers);
    channels: Channels = new Channels(this.headers);
    chat: Chat = new Chat(this.headers);

    constructor(config: TrovoConfig) {
        this.config = config;

        this.errors = {
            NO_REDIRECT_URI: "You must to specify redirect_uri",
            NO_ACCESS_TOKEN: "You don't specify your access_token"
        };

        if (!("access_token" in config)) {
            console.warn(this.errors.NO_ACCESS_TOKEN);
        } else {
            this.headers.set("Accept", "application/json");
            this.headers.set("Client-ID", this.config.client_id);
            this.headers.set("Authorization", `OAuth ${this.config.access_token}`);
        }
    }
    
    getAuthLink(scopes: Array<string> = [], redirect_uri: string): string | Error {
        if (!redirect_uri) {
            throw new Error(this.errors.NO_REDIRECT_URI);
        }

        if (scopes.length === 0) {
            scopes = defaultScopes;
        }

        const loginRoot = "https://open.trovo.live/page/login.html";
        const joinedScopes: string = scopes.join("+");
        const params: AuthParams = {
            client_id: this.config.client_id,
            redirect_uri,
            response_type: "token",
            scope: joinedScopes,
            state: "ABC"
        };

        const query: string = Static.generateQuery(params);
        return `${loginRoot}?${query}`;
    }
}

export default TrovoAPI;