import { Headers } from "node-fetch";
import Users from "./lib/modules/users";
import Categories from "./lib/modules/categories";
import Channel from "./lib/modules/channel";
import Channels from "./lib/modules/channels";
import Chat from "./lib/modules/chat";
import { TrovoConfig } from "./lib/interfaces/primary";
export declare class TrovoAPI {
    config: TrovoConfig;
    headers: Headers;
    users: Users;
    categories: Categories;
    channel: Channel;
    channels: Channels;
    chat: Chat;
    constructor(config: TrovoConfig);
    getAuthLink(scopes: string[] | undefined, redirect_uri: string): string | Error;
}
