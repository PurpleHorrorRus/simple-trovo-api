import EventEmitter from "events";
import WebSocket from "reconnecting-websocket";
import { Headers } from "node-fetch";

import TrovoRequests from "../requests";
import { WSMesageData, WSMessage } from "../interfaces/chat";
import { TrovoRequestType } from "../types/primary";

class Chat extends TrovoRequests {
    events: EventEmitter;

    private chatEndpoint = "wss://open-chat.trovo.live/chat";
    private nonces = {
        AUTH: "client-auth"
    };

    socket: WebSocket;
    
    constructor(headers: Headers) {
        super(headers);
        this.events = new EventEmitter();
    }

    connect(token: string): Promise<boolean | void> {
        return new Promise(resolve => { 
            this.socket = new WebSocket(this.chatEndpoint);
            this.socket.onmessage = (message: MessageEvent) => resolve(this.messageHandler(message));
            this.socket.onopen = () => this.send("AUTH", this.nonces.AUTH, { token });
        });
    }

    messageHandler(message: MessageEvent): boolean | void {
        const response = JSON.parse(message.data.toString());
        
        switch (response.type) { 
            case "RESPONSE": {
                const connected: boolean = !("error" in response) && response.nonce === this.nonces.AUTH;
                if (connected) this.events.emit("connected");
                return connected;
            }
            
            case "CHAT": {
                return this.events.emit("message", response.data);
            }
        }
    }
    
    send(type: string, nonce: string, data: WSMesageData): Promise<string | boolean> {
        return new Promise(resolve => { 
            if (!this.socket) {
                return resolve(false);
            }

            const message: WSMessage = { type, nonce, data };
            this.socket.send(JSON.stringify(message));
        });
    }

    async token(): TrovoRequestType {
        const response: any = await this.requestEndpoint("chat/token");
        return response.token;
    }

    async channelToken(channelID: number): Promise<string> {
        const response: any = await this.requestEndpoint(`chat/channel-token/${channelID}`); 
        return response.token;
    }
}

export default Chat;