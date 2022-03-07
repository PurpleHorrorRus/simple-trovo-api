import { Headers } from "node-fetch";

import Static from "../static";

import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";

type channelIDType = number | string;
type auditoryType = "CHANNEL_AUDIENCE_TYPE_FAMILYFRIENDLY" | "CHANNEL_AUDIENCE_TYPE_TEEN" | "CHANNEL_AUDIENCE_TYPE_EIGHTEENPLUS";
type emotesType = 0 | 1 | 2;
type sortingDirectionType = "asc" | "desc";

class Channel extends TrovoRequests {
    public auditoryType: auditoryType;
    public emotesType: emotesType;
    public sortingDirectionType: sortingDirectionType;

    constructor(headers: Headers) {
        super(headers);
    }

    async emotes(emote_type: emotesType = 0, channel_id: Array<channelIDType>): TrovoRequestType {
        return await this.requestEndpoint("getemotes", {
            method: "POST",
            body: JSON.stringify({
                emote_type,
                channel_id
            })
        });
    }

    async followers(channel_id: channelIDType, limit: number = 20, cursor?: number, direction: sortingDirectionType = "asc"): TrovoRequestType {
        return await this.requestEndpoint(`channels/${channel_id}/followers`, {
            method: "POST",
            body: JSON.stringify({
                limit: Static.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }

    async subscribers(channelID: channelIDType, limit: number = 25, offset: number = 0, direction: sortingDirectionType = "asc"): TrovoRequestType {
        const query = Static.generateQuery({
            limit: Static.limit(limit, 0, 100),
            offset,
            direction
        });

        return await this.requestEndpoint(`channels/${channelID}/subscriptions?${query}`);
    }

    async viewers(channel_id: channelIDType, limit: number = 20, cursor?: number): TrovoRequestType {
        return await this.requestEndpoint(`channels/${channel_id}/viewers`, {
            method: "POST",
            body: JSON.stringify({
                limit: Static.limit(limit, 0, 100000),
                cursor: cursor || 0
            })
        });
    }

    async streamUrls(channel_id: channelIDType): TrovoRequestType {
        return await this.requestEndpoint("livestreamurl", {
            method: "POST",
            body: JSON.stringify({
                channel_id
            })
        });
    }

    async clips(channel_id: channelIDType, category_id?: string, period?: string, clip_id?: string, limit: number = 20, cursor?: number, direction: sortingDirectionType = "asc"): TrovoRequestType {
        return await this.requestEndpoint("clips", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                category_id,
                period,
                clip_id,
                limit: Static.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }

    async pastStreams(channel_id: channelIDType, category_id?: string, period?: string, past_stream_id?: string, limit: number = 20, cursor?: number, direction: sortingDirectionType = "asc"): TrovoRequestType { 
        return await this.requestEndpoint("paststreams", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                category_id,
                period,
                past_stream_id,
                limit: Static.limit(limit, 0, 100),
                cursor,
                direction
            })
        });
    }

    async edit(channel_id: channelIDType, live_title: string = "", category: string = "", language_code: string = "RU", audi_type: auditoryType = "CHANNEL_AUDIENCE_TYPE_EIGHTEENPLUS"): TrovoRequestType {
        return await this.requestEndpoint("channels/update", {
            method: "POST",
            body: JSON.stringify({
                channel_id,
                live_title,
                category,
                language_code: language_code.toUpperCase(),
                audi_type
            })
        });
    }
}

export default Channel;