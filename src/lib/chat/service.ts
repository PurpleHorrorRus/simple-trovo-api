import EventEmitter from "events";
import WebSocket from "ws";

import { WSMesageData, WSMessage } from "../../interfaces/chat";

class ChatService extends EventEmitter { 
    private chatEndpoint = "wss://open-chat.trovo.live/chat";
    private nonces = {
        AUTH: "client-auth"
    };

    socket: WebSocket;

    private lastMessageTime: number = Number(String(Date.now()).substring(0, 10));

    constructor() {
        super();
    }

    connect(token: string): Promise<boolean | void> {
        return new Promise(resolve => { 
            this.socket = new WebSocket(this.chatEndpoint);
            this.socket.onmessage = message => resolve(this.messageHandler(message));
            this.socket.onopen = () => this.send("AUTH", this.nonces.AUTH, { token });
        });
    }

    send(type: string, nonce: string, data: WSMesageData): boolean {
        if (!this.socket) {
            return false;
        }

        const message: WSMessage = { type, nonce, data };
        this.socket.send(JSON.stringify(message));
        return true;
    }

    messageHandler(message: any): any {
        const response = JSON.parse(message.data.toString());

        if (response.error) {
            throw new Error(response.error);
        }
        
        switch (response.type) { 
            case "RESPONSE": {
                const connected: boolean = !("error" in response) && response.nonce === this.nonces.AUTH;
                if (connected) this.emit("connected");
                return connected;
            }
            
            case "CHAT": {
                const newMessages: Array<any> = response.data.chats.filter((message: any) => {
                    return message.send_time > this.lastMessageTime;
                });

                if (newMessages.length > 0) {
                    for (const message of newMessages) {
                        this.emit("message", message);
                    }

                    this.lastMessageTime = Number(String(Date.now()).substring(0, 10));
                }

                return true;
            }
        }
    }
}

export default ChatService;