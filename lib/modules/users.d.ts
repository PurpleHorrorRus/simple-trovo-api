import { Headers } from "node-fetch";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
declare class Users extends TrovoRequests {
    constructor(headers: Headers);
    get(users: Array<string>): TrovoRequestType;
    getUserInfo(): TrovoRequestType;
}
export default Users;
