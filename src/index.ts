import { Headers } from "node-fetch";
import fs from "fs";

import Static from "./lib/static";
import Users from "./lib/modules/users";
import Categories from "./lib/modules/categories";
import Channel from "./lib/modules/channel";
import Channels from "./lib/modules/channels";
import Chat from "./lib/modules/chat";

import { TrovoConfig, AuthParams } from "./lib/interfaces/primary";

import defaultScopes from "./lib/scopes.json";
import TrovoRequests from "./lib/requests";
import { TrovoRequestType } from "./lib/types/primary";

export class TrovoAPI {
    config: TrovoConfig;
    headers: Headers = new Headers();

    users: Users = new Users(this.headers);
    categories: Categories = new Categories(this.headers);
    channel: Channel = new Channel(this.headers);
    channels: Channels = new Channels(this.headers);
    chat: Chat = new Chat(this.headers);
    requests: TrovoRequests = new TrovoRequests(this.headers);

    accessToken: string = "";
    refreshToken: string = "";
    refreshInterval: NodeJS.Timer;

    constructor(config: TrovoConfig) {
        this.config = config;

        this.headers.set("Accept", "application/json");
        this.headers.set("Client-ID", this.config.client_id);
        this.headers.set("Content-Type", "application/json");
    }
    
    getAuthLink(scopes: string[] = [], response_type: string = "code"): string | Error {
        if (scopes.length === 0) {
            scopes = defaultScopes;
        }

        const loginRoot = "https://open.trovo.live/page/login.html";
        const joinedScopes: string = scopes.join("+");
        const params: AuthParams = {
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            response_type,
            scope: joinedScopes
        };

        const query: string = Static.generateQuery(params);
        return `${loginRoot}?${query}`;
    }

    public async validate(): TrovoRequestType {
        return await this.requests.requestEndpoint("validate");
    }

    async refresh(): TrovoRequestType { 
        const response: any = await this.requests.requestEndpoint("refreshtoken", {
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

    async auth(access_token: string = ""): Promise<TrovoAPI> {
        if (access_token) {
            this.update({ access_token });
            return this;
        } else if (this.config.credits) {
            if (!fs.existsSync(this.config.credits)) {
                throw new Error("Invalid credits path");
            }
    
            let credits: any = fs.readFileSync(this.config.credits);
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

    async exchange(code: string): TrovoRequestType { 
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

    update(response: any): void {
        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.headers.set("Authorization", `OAuth ${this.accessToken}`);
    }

    write(response: any): void { 
        if (this.config.credits) {
            response = JSON.stringify(response, null, 4);
            return fs.writeFileSync(this.config.credits, response);
        }

        throw new Error("Invalid credits path");
    }
}