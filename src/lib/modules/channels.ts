import { Headers } from "node-fetch";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";

class Channels extends TrovoRequests {
    constructor(headers: Headers) {
        super(headers);
    }

    async top(limit: number = 20, after?: boolean, token?: string, cursor?: number, category_id?: string): TrovoRequestType {
        limit = Math.max(Math.min(limit, 100), 0);

        const params: any = { limit };

        if (after !== undefined) params.after = after;
        if (token) params.token = token;
        if (cursor !== undefined) params.cursor = cursor;
        if (category_id) params.category_id = category_id;

        return await this.requestEndpoint("gettopchannels", {
            method: "POST",
            body: JSON.stringify(params)
        })
    }
    
    async get(user: number | string): TrovoRequestType {
        const params: any = {};
        
        typeof user === "number"
            ? params.channel_id = user
            : params.username = user;
        
        return await this.requestEndpoint("channels/id", {
            method: "POST",
            body: JSON.stringify(params)
        });
    }
}

export default Channels;