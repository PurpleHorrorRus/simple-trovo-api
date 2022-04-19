import fetch, { Headers, RequestInit } from "node-fetch";

import Static from "./static";

import { TrovoRequestType } from "./types/primary";

class TrovoRequests extends Static {
    private headers: Headers;
    private apiRoot = "https://open-api.trovo.live/openplatform";

    constructor(headers: Headers) {
        super();

        this.headers = headers;
    }

    private async request(url: string, params: RequestInit = {}): TrovoRequestType {
        const response = await fetch(url, {
            headers: this.headers,
            ...params
        });

        const json = await response.json();
        return response.ok ? json : this.handleError(json);
    }

    public async requestEndpoint(endpoint: string, params: RequestInit = {}, ignoreValidating: boolean = false): TrovoRequestType {
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

export default TrovoRequests;