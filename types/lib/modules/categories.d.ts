import { Headers } from "node-fetch";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
declare class Categories extends TrovoRequests {
    constructor(headers: Headers);
    get(): TrovoRequestType;
    search(query: string, limit?: number): TrovoRequestType;
}
export default Categories;
