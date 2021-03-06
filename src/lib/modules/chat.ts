
import { Headers } from "node-fetch";

import ChatService from "./chat/service";

import TrovoRequests from "../requests";
import { TrovoRequestType } from "../types/primary";
import { ChatServiceConfig } from "../interfaces/chat";

class Chat extends TrovoRequests {
    public service: ChatService;

    public userRoles = {
        streamer: 100000,
        mod: 100001,
        editor: 100002,
        subscriber: 100004,
        supermod: 100005,
        follower: 100006,
        custom_role: 200000,
        admin: 500000,
        warden: 500001,
        ace: 300000,
        ace_plus: 300001
    };
    
    constructor(headers: Headers) {
        super(headers);
    }

    async connect(chatServiceConfig: ChatServiceConfig = {}): Promise<ChatService> { 
        this.service = new ChatService(chatServiceConfig);

        return new Promise(resolve => {
            this.service.on(this.service.events.CONNECTED, async () => {
                resolve(this.service);

                const token: string = chatServiceConfig.user_id
                    ? await this.channelToken(chatServiceConfig.user_id)
                    : await this.token();
                
                this.service.connect(token);
            });
        });
    }
    
    async token(): Promise<string> {
        const response: any = await this.requestEndpoint("chat/token");
        return response.token;
    }

    async channelToken(channelID: number): Promise<string> {
        const response: any = await this.requestEndpoint(`chat/channel-token/${channelID}`); 
        return response.token;
    }

    async send(content: string, channel_id?: number | string): TrovoRequestType { 
        return await this.requestEndpoint("chat/send", {
            method: "POST",
            body: JSON.stringify({
                content,
                channel_id
            })
        })
    }

    async delete(channelID: number | string, messageID: string, uID: number | string) {
        return await this.requestEndpoint(`channels/${channelID}/messages/${messageID}/users/${uID}`, {
            method: "DELETE"
        });
    }

    async command(command: string, channel_id: number | string): TrovoRequestType {
        if (command[0] === "/") {
            command = command.replace("/", "");
        }

        return await this.requestEndpoint("channels/command", {
            method: "POST",
            body: JSON.stringify({
                command,
                channel_id
            })
        });
    }
}

export default Chat;