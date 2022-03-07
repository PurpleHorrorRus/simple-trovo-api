import { Headers } from "node-fetch";

import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";

class Users extends TrovoRequests {
    constructor(headers: Headers) {
        super(headers);
    }

    async get(users: Array<string>): TrovoRequestType {
        return await this.requestEndpoint("getusers", {
            method: "POST",
            body: JSON.stringify({
                user: users
            })
        })
    }
    
    async getUserInfo(): TrovoRequestType {
        return await this.requestEndpoint("getuserinfo");
    }
}

export default Users;