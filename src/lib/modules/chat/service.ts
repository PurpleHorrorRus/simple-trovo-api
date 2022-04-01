import EventEmitter from "events";
import WebSocket, { Options } from "reconnecting-websocket";
import ws from "ws";

import ChatMessages from "./messages";

import { ChatServiceConfig, WSMesageData, WSMessage } from "../../interfaces/chat";
import { WSHandler } from "../../types/chat";

const defaultChatServiceConfig: ChatServiceConfig = {
    messages: {
        fetchPastMessages: false
    }
};

class ChatService extends EventEmitter { 
    private endpoint: string = "wss://open-chat.trovo.live/chat";
    private heartbeatRate: number = 25;

    private WebSocketParams: Options = {
        WebSocket: ws,
        connectionTimeout: 5000,
        maxRetries: Infinity
    };

    private requests = {
        AUTH: "AUTH",
        PING: "PING"
    };

    public events = {
        CONNECTED: "connected",
        DISCONNECTED: "disconnected",
        READY: "ready",
        HEARTBEAT: "heartbeat"
    };

    private handles = {
        AUTH: "RESPONSE",
        MESSAGE: "CHAT"
    };

    private nonces = {
        AUTH: "client-auth",
        PING: "client-ping"
    };

    public connected: boolean = false;
    public authorized: boolean = false;

    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;

    messages: ChatMessages;

    constructor(chatServiceConfig: ChatServiceConfig = defaultChatServiceConfig) {
        super();

        chatServiceConfig = Object.assign(defaultChatServiceConfig, chatServiceConfig);
        this.messages = new ChatMessages(chatServiceConfig.messages);
        
        this.socket = new WebSocket(this.endpoint, [], this.WebSocketParams);
        this.socket.onopen = () => {
            this.connected = true;
            this.emit(this.events.CONNECTED);
        };
    }

    connect(token: string): WSHandler | Promise<WSHandler> {
        if (!this.socket.OPEN) {
            return false;
        }

        this.send(this.requests.AUTH, this.nonces.AUTH, { token });

        return new Promise((resolve, reject) => { 
            this.socket.onmessage = message => {
                const response: Promise<WSHandler> = this.messageHandler(message).catch(reject);
                return resolve(response);
            }

            this.socket.onclose = event => {
                return this.disconnect(event.reason);
            };
        });
    }

    disconnect(error: string): boolean {
        if (this.connected) {
            this.connected = false;
            this.authorized = false;
            clearInterval(this.heartbeat);
            return this.emit(this.events.DISCONNECTED, error);
        }

        return false;
    }

    send(type: string, nonce: string, data?: WSMesageData): void {
        if (!this.connected) {
            return;
        }

        const message: WSMessage = { type, nonce, data };
        const payload: string = JSON.stringify(message);
        return this.socket.send(payload);
    }

    messageHandler(message: any): Promise<WSHandler> {
        const response: any = JSON.parse(message.data.toString());

        switch (response.type) { 
            case this.handles.AUTH: {
                if (response.error) {
                    return Promise.reject(response.error);
                }

                this.authorized = response.nonce === this.nonces.AUTH;
                const result = this.authorized && this.onAuth();
                return Promise.resolve(result);
            }
            
            case this.handles.MESSAGE: {
                const result = this.messages.handle(response);
                return Promise.resolve(result);
            }
        }

        return Promise.reject();
    }

    onAuth(): boolean { 
        this.heartbeat = setInterval(() => {
            this.send(this.requests.PING, this.nonces.PING);
            this.emit(this.events.HEARTBEAT);
        }, this.heartbeatRate * 1000);

        return this.emit(this.events.READY);
    }
}

export default ChatService;