/// <reference types="node" />
import { Headers } from "node-fetch";
import Users from "./lib/modules/users";
import Categories from "./lib/modules/categories";
import Channel from "./lib/modules/channel";
import Channels from "./lib/modules/channels";
import Chat from "./lib/modules/chat";
import { TrovoConfig } from "./lib/interfaces/primary";
import TrovoRequests from "./lib/requests";
import { TrovoRequestType } from "./lib/types/primary";
export declare class TrovoAPI {
    config: TrovoConfig;
    headers: Headers;
    users: Users;
    categories: Categories;
    channel: Channel;
    channels: Channels;
    chat: Chat;
    requests: TrovoRequests;
    accessToken: string;
    refreshToken: string;
    refreshInterval: NodeJS.Timer;
    constructor(config: TrovoConfig);
    getAuthLink(scopes?: string[], response_type?: string): string | Error;
    validate(): TrovoRequestType;
    refresh(): TrovoRequestType;
    auth(access_token?: string, refresh_token?: string): Promise<TrovoAPI>;
    exchange(code: string): TrovoRequestType;
    revoke(): TrovoRequestType;
    update(response: any): void;
    write(response: any): void;
}
