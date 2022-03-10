import EventEmitter from "events";
import WebSocket from "ws";

import { ChatServiceConfig, ChatMessage, WSMesageData, WSMessage } from "../../interfaces/chat";
import { WSHandler } from "../../types/chat";

class ChatService extends EventEmitter { 
    private endpoint: string = "wss://open-chat.trovo.live/chat";
    private connected: boolean = false;
    private heartbeatRate: number = 25;
    private defaultChatServiceConfig: ChatServiceConfig = {
        fetchAllMessages: false
    };

    private nonces = {
        AUTH: "client-auth",
        PING: "client-ping"
    };

    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;

    private lastMessageTime: number = 0;

    constructor() {
        super();
    }

    connect(token: string, chatServiceConfig: ChatServiceConfig = {}): WSHandler {
        if (this.connected) {
            return false;
        }

        this.config = {
            ...this.defaultChatServiceConfig,
            ...chatServiceConfig
        };

        this.socket = new WebSocket(this.endpoint);
        this.socket.onopen = () => {
            this.emit("connected");
            this.send("AUTH", this.nonces.AUTH, { token });
            this.connected = true;
        };

        return new Promise((resolve, reject) => { 
            this.socket.onmessage = message => {
                try {
                    const response: WSHandler = this.messageHandler(message);
                    return resolve(response);
                } catch (error) {
                    return reject(this.disconnect(error));
                }
            };
            
            this.socket.onerror = async error => {
                reject(this.disconnect(error));
                return await this.connect(token, chatServiceConfig);
            }
        });
    }

    disconnect(error: Error | WebSocket.ErrorEvent | unknown): boolean {
        this.connected = false;
        return this.emit("disconnected", error);
    }

    send(type: string, nonce: string, data?: WSMesageData): boolean {
        if (!this.socket) {
            return false;
        }

        const message: WSMessage = { type, nonce, data };
        this.socket.send(JSON.stringify(message));
        return true;
    }

    messageHandler(message: WebSocket.MessageEvent): WSHandler {
        const response: any = JSON.parse(message.data.toString());

        if (response.error) {
            throw new Error(response.error);
        }
        
        switch (response.type) { 
            case "RESPONSE": {
                const connected: boolean = !("error" in response) && response.nonce === this.nonces.AUTH;
                
                if (connected) {
                    // Watch only new messages
                    if (!this.config.fetchAllMessages) {
                        this.lastMessageTime = this.updateTime();
                    }
                    
                    this.heartbeat = setInterval(() => {
                        this.send("PING", this.nonces.PING);
                        this.emit("heartbeat");
                    }, this.heartbeatRate * 1000);

                    this.emit("ready");
                }
                
                return connected;
            }
            
            case "CHAT": {
                if (!response.data.chats) {
                    return this.emit("message", []);
                }

                if (this.config.fetchAllMessages && this.lastMessageTime === 0) {
                    this.lastMessageTime = this.updateTime();
                    return this.emit("message", response.data.chats);
                }

                const newMessages: ChatMessage[] = response.data.chats.filter((message: ChatMessage) => {
                    return message.send_time > this.lastMessageTime;
                });

                if (newMessages.length > 0) {
                    newMessages.forEach((message: ChatMessage) => {
                        this.emit("message", message);
                    });

                    this.lastMessageTime = this.updateTime();
                }

                return true;
            }
        }

        return false;
    }

    updateTime(): number {
        return Number(Date.now().toString().substring(0, 10));
    }
}

export default ChatService;