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
        this.endpoint = "wss://open-chat.trovo.live/chat";
        this.connected = false;
        this.heartbeatRate = 25;
        this.defaultChatServiceConfig = {
            fetchAllMessages: false
        };
        this.nonces = {
            AUTH: "client-auth",
            PING: "client-ping"
        };
        this.lastMessageTime = 0;
    }
    connect(token, chatServiceConfig = {}) {
        if (this.connected) {
            return false;
        }
        this.config = {
            ...this.defaultChatServiceConfig,
            ...chatServiceConfig
        };
        this.socket = new ws_1.default(this.endpoint);
        this.socket.onopen = () => {
            this.emit("connected");
            this.send("AUTH", this.nonces.AUTH, { token });
            this.connected = true;
        };
        return new Promise((resolve, reject) => {
            this.socket.onmessage = message => {
                try {
                    const response = this.messageHandler(message);
                    return resolve(response);
                }
                catch (error) {
                    return reject(this.disconnect(error));
                }
            };
            this.socket.onerror = async (error) => {
                reject(this.disconnect(error));
                return await this.connect(token, chatServiceConfig);
            };
        });
    }
    disconnect(error) {
        this.connected = false;
        return this.emit("disconnected", error);
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
                const newMessages = response.data.chats.filter((message) => {
                    return message.send_time > this.lastMessageTime;
                });
                if (newMessages.length > 0) {
                    newMessages.forEach((message) => {
                        this.emit("message", message);
                    });
                    this.lastMessageTime = this.updateTime();
                }
                return true;
            }
        }
        return false;
    }
    updateTime() {
        return Number(Date.now().toString().substring(0, 10));
    }
}
exports.default = ChatService;
