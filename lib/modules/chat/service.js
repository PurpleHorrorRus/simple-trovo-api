"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const ws_1 = __importDefault(require("ws"));
class ChatService extends events_1.default {
    constructor() {
        super();
        this.chatEndpoint = "wss://open-chat.trovo.live/chat";
        this.nonces = {
            AUTH: "client-auth"
        };
        this.lastMessageTime = Number(String(Date.now()).substring(0, 10));
    }
    connect(token) {
        return new Promise(resolve => {
            this.socket = new ws_1.default(this.chatEndpoint);
            this.socket.onmessage = message => resolve(this.messageHandler(message));
            this.socket.onopen = () => this.send("AUTH", this.nonces.AUTH, { token });
        });
    }
    send(type, nonce, data) {
        if (!this.socket) {
            return false;
        }
        const message = { type, nonce, data };
        this.socket.send(JSON.stringify(message));
        return true;
    }
    messageHandler(message) {
        const response = JSON.parse(message.data.toString());
        if (response.error) {
            throw new Error(response.error);
        }
        switch (response.type) {
            case "RESPONSE": {
                const connected = !("error" in response) && response.nonce === this.nonces.AUTH;
                if (connected)
                    this.emit("connected");
                return connected;
            }
            case "CHAT": {
                const newMessages = response.data.chats.filter((message) => {
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
exports.default = ChatService;
