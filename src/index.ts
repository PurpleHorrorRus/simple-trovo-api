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

        if (!this.refreshInterval) {
            this.refreshInterval = setInterval(() => this.refresh(), response.expires_in * 1000);
        }

        this.update(response);
        this.write(response);

        return response;
    }

    async auth(access_token: string = "", refresh_token: string = ""): Promise<TrovoAPI> {
        if (access_token && !refresh_token) {
            this.update({ access_token });
            return this;
        }

        if (!this.config.credits) { 
            throw new Error("Authorization failed: you need to specify a credits path to use Authorization Code Flow");
        }

        if (!access_token || !refresh_token) {
            if (!fs.existsSync(this.config.credits)) {
                throw new Error("Authorization failed: incorrect credits file path");
            }

            const fileContent: any = fs.readFileSync(this.config.credits);
            const credits = JSON.parse(fileContent);
            credits.access_token = access_token || credits.access_token;
            credits.refresh_token = refresh_token || credits.refresh_token;
            return await this.auth(credits.access_token, credits.refresh_token);
        }

        this.update({ access_token, refresh_token });

        if (access_token) {
            const response = await this.validate().catch(async () => {
                return await this.refresh().catch(e => {
                    throw e;
                });
            });
    
            if (response.expire_ts) {
                const tokenTimestamp = new Date(Number(response.expire_ts) * 1000);
                const now = new Date(Date.now());
                const updateTimeout = tokenTimestamp.getTime() - now.getTime();
                setTimeout(() => this.refresh(), updateTimeout);
            }
    
            return this;
        }

        await this.refresh().catch(e => {
            throw e;
        });

        return this;
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

    async revoke(): TrovoRequestType { 
        return await this.requests.requestEndpoint("revoke", {
            method: "POST",
            body: JSON.stringify({
                access_token: this.accessToken
            })
        });
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