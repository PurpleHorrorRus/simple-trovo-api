import { Headers } from "node-fetch";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
declare class Channels extends TrovoRequests {
    constructor(headers: Headers);
    top(limit?: number, after?: boolean, token?: string, cursor?: number, category_id?: string): TrovoRequestType;
    get(user: number | string): TrovoRequestType;
}
export default Channels;
