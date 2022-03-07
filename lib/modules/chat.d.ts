import { Headers } from "node-fetch";
import ChatService from "./chat/service";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
declare class Chat extends TrovoRequests {
    service: ChatService;
    userRoles: {
        streamer: number;
        mod: number;
        editor: number;
        subscriber: number;
        supermod: number;
        follower: number;
        custom_role: number;
        admin: number;
        warden: number;
        ace: number;
        ace_plus: number;
    };
    constructor(headers: Headers);
    token(): TrovoRequestType;
    channelToken(channelID: number): Promise<string>;
    send(content: string, channel_id?: number | string): TrovoRequestType;
    delete(channelID: number | string, messageID: string, uID: number | string): Promise<any>;
}
export default Chat;
