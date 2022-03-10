import { Headers, RequestInit } from "node-fetch";
import Static from "./static";
import { TrovoRequestType } from "./types/primary";
declare class TrovoRequests extends Static {
    private headers;
    private apiRoot;
    constructor(headers: Headers);
    private request;
    requestEndpoint(endpoint: string, params?: RequestInit): TrovoRequestType;
}
export default TrovoRequests;
