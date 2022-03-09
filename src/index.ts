import { Headers } from "node-fetch";

import Static from "./lib/static";
import Users from "./lib/modules/users";
import Categories from "./lib/modules/categories";
import Channel from "./lib/modules/channel";
import Channels from "./lib/modules/channels";
import Chat from "./lib/modules/chat";

import { TrovoConfig, AuthParams } from "./lib/interfaces/primary";

import defaultScopes from "./lib/scopes.json";
import { ChatServiceConfig } from "./lib/interfaces/chat";

const defaultChatServiceConfig: ChatServiceConfig = {
    fetchAllMessages: false
};

export class TrovoAPI {
    config: TrovoConfig;
    headers: Headers = new Headers();

    users: Users = new Users(this.headers);
    categories: Categories = new Categories(this.headers);
    channel: Channel = new Channel(this.headers);
    channels: Channels = new Channels(this.headers);
    chat: Chat;

    constructor(config: TrovoConfig) {
        config.chatServiceConfig = config.chatServiceConfig || defaultChatServiceConfig;
        this.config = config;

        if (!("access_token" in config)) {
            console.warn("You must to specify redirect_uri");
        } else {
            this.headers.set("Accept", "application/json");
            this.headers.set("Client-ID", this.config.client_id);
            this.headers.set("Authorization", `OAuth ${this.config.access_token}`);

            this.chat = new Chat(this.headers, config.chatServiceConfig);
        }
    }
    
    getAuthLink(scopes: Array<string> = [], redirect_uri: string): string | Error {
        if (scopes.length === 0) {
            scopes = defaultScopes;
        }

        const loginRoot = "https://open.trovo.live/page/login.html";
        const joinedScopes: string = scopes.join("+");
        const params: AuthParams = {
            client_id: this.config.client_id,
            redirect_uri,
            response_type: "token",
            scope: joinedScopes
        };

        const query: string = Static.generateQuery(params);
        return `${loginRoot}?${query}`;
    }
}