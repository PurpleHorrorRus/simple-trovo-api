import { Headers } from "node-fetch";

import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";

class Categories extends TrovoRequests {
    constructor(headers: Headers) {
        super(headers);
    }

    async get(): TrovoRequestType {
        return await this.requestEndpoint("categorys/top");
    }
    
    async search(query: string, limit: number = 20): TrovoRequestType {
        return await this.requestEndpoint("searchcategory", {
            method: "POST",
            body: JSON.stringify({
                query,
                limit
            })
        });
    }
}

export default Categories;