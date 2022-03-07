import { Headers } from "node-fetch";
import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
declare type channelIDType = number | string;
declare type auditoryType = "CHANNEL_AUDIENCE_TYPE_FAMILYFRIENDLY" | "CHANNEL_AUDIENCE_TYPE_TEEN" | "CHANNEL_AUDIENCE_TYPE_EIGHTEENPLUS";
declare type emotesType = 0 | 1 | 2;
declare type sortingDirectionType = "asc" | "desc";
declare class Channel extends TrovoRequests {
    auditoryType: auditoryType;
    emotesType: emotesType;
    sortingDirectionType: sortingDirectionType;
    constructor(headers: Headers);
    emotes(emote_type: emotesType | undefined, channel_id: Array<channelIDType>): TrovoRequestType;
    followers(channel_id: channelIDType, limit?: number, cursor?: number, direction?: sortingDirectionType): TrovoRequestType;
    subscribers(channelID: channelIDType, limit?: number, offset?: number, direction?: sortingDirectionType): TrovoRequestType;
    viewers(channel_id: channelIDType, limit?: number, cursor?: number): TrovoRequestType;
    streamUrls(channel_id: channelIDType): TrovoRequestType;
    clips(channel_id: channelIDType, category_id?: string, period?: string, clip_id?: string, limit?: number, cursor?: number, direction?: sortingDirectionType): TrovoRequestType;
    pastStreams(channel_id: channelIDType, category_id?: string, period?: string, past_stream_id?: string, limit?: number, cursor?: number, direction?: sortingDirectionType): TrovoRequestType;
    edit(channel_id: channelIDType, live_title?: string, category?: string, language_code?: string, audi_type?: auditoryType): TrovoRequestType;
}
export default Channel;
