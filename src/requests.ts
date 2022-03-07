import fetch, { Headers, RequestInit } from "node-fetch";

import Static from "./static";

import { TrovoRequestType } from "./types/primary";

type TrovoRequestInit = RequestInit & {
    ignoreStatus?: boolean
};

class TrovoRequests extends Static {
    private headers: Headers;
    private apiRoot = "https://open-api.trovo.live/openplatform";

    constructor(headers: Headers) {
        super();

        this.headers = headers;
    }

    private async request(url: string, params: TrovoRequestInit = {}): TrovoRequestType {
        const response = await fetch(url, {
            headers: this.headers,
            ...params
        });
        
        return (params.method !== "PATCH" && params.method !== "DELETE" && params.method !== "PUT") || params.ignoreStatus
            ? response.status === 200 ? await response.json() : this.handleError(response.statusText)
            : response.status === 204;
    }

    async requestEndpoint(endpoint: string, params: TrovoRequestInit = {}): TrovoRequestType {
        if (params.body) {
            params.method = "POST";
        }

        return await this.request(`${this.apiRoot}/${endpoint}`, params);
    }
}

export default TrovoRequests;