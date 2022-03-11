import EventEmitter from "events";
import WebSocket, { Options } from "reconnecting-websocket";
import ws from "ws";

import { ChatServiceConfig, ChatMessage, WSMesageData, WSMessage } from "../../interfaces/chat";
import { ChatMessageEventsType, WSHandler } from "../../types/chat";

class ChatService extends EventEmitter { 
    private endpoint: string = "wss://open-chat.trovo.live/chat";
    private lastMessageTime: number = 0;
    private heartbeatRate: number = 25;

    private defaultChatServiceConfig: ChatServiceConfig = {
        fetchPastMessages: false
    };

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

    public ChatMessageEvents: ChatMessageEventsType = {
        5001: "subscribption",
        5002: "system",
        5003: "follow",
        5004: "welcome",
        5005: "gift_sub_random",
        5006: "gift_sub",
        5007: "activity",
        5008: "raid",
        5009: "custom_spell",
        5012: "stream",
        5013: "unfollow"
    };

    public specialEvents = {
        MESSAGE: this.ChatMessageEvents[0],
        SUBSCRIPTION: this.ChatMessageEvents[5001],
        SYSTEM: this.ChatMessageEvents[5002],
        FOLLOW: this.ChatMessageEvents[5003],
        WELCOME: this.ChatMessageEvents[5004],
        GIFT_SUB_RANDOM: this.ChatMessageEvents[5005],
        GIFT_SUB: this.ChatMessageEvents[5006],
        ACTIVITY: this.ChatMessageEvents[5007],
        RADI: this.ChatMessageEvents[5008],
        CUSTOM_SPELL: this.ChatMessageEvents[5009],
        STREAM: this.ChatMessageEvents[5012],
        UNFOLLOW: this.ChatMessageEvents[5013],
    };

    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;

    constructor(chatServiceConfig: ChatServiceConfig = {}) {
        super();

        this.config = {
            ...this.defaultChatServiceConfig,
            ...chatServiceConfig
        };

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
            return this.emit(this.events.DISCONNECTED, error);
        }

        return false;
    }

    send(type: string, nonce: string, data?: WSMesageData): void {
        if (!this.connected) {
            return;
        }

        const message: WSMessage = { type, nonce, data };
        const toSend: string = JSON.stringify(message);
        return this.socket.send(toSend);
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
                const result = this.onMessage(response);
                return Promise.resolve(result);
            }
        }

        return Promise.reject();
    }

    onAuth(): boolean { 
        // Watch only new messages
        if (!this.config.fetchPastMessages) {
            this.updateTime();
        }
        
        this.heartbeat = setInterval(() => {
            this.send(this.requests.PING, this.nonces.PING);
            this.emit(this.events.HEARTBEAT);
        }, this.heartbeatRate * 1000);

        return this.emit(this.events.READY);
    }

    onMessage(response: any): boolean {
        if (!response.data.chats) {
            return this.emitChatMessages([]);
        }

        if (this.config.fetchPastMessages && this.lastMessageTime === 0) {
            return this.emitChatMessages(response.data.chats);
        }

        const newMessages: ChatMessage[] = this.getNewMessages(response.data.chats);
        return this.emitChatMessages(newMessages);
    }

    getNewMessages(messages: ChatMessage[]): ChatMessage[] { 
        const newMessages: ChatMessage[] = messages.filter((message: ChatMessage) => {
            return message.send_time > this.lastMessageTime;
        });
        
        return newMessages;
    }

    emitChatMessages(messages: ChatMessage[]): boolean {
        if (messages.length > 0) {
            messages.forEach((message: ChatMessage) => {
                const event: string = this.ChatMessageEvents[message.type] || "message";
                return this.emit(event, message);
            });
        }

        const time: number = messages.length > 0 ? messages[messages.length - 1].send_time : Date.now();
        this.updateTime(time);

        return messages.length > 0;
    }

    updateTime(time = Date.now()): number {
        this.lastMessageTime = Number(time.toString().substring(0, 10));
        return this.lastMessageTime;
    }
}

export default ChatService;