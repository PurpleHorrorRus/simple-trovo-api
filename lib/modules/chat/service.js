"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const ws_1 = __importDefault(require("ws"));
class ChatService extends events_1.default {
    constructor(chatServiceConfig = {}) {
        super();
        this.endpoint = "wss://open-chat.trovo.live/chat";
        this.lastMessageTime = 0;
        this.heartbeatRate = 25;
        this.defaultChatServiceConfig = {
            fetchPastMessages: false
        };
        this.WebSocketParams = {
            WebSocket: ws_1.default,
            connectionTimeout: 5000,
            maxRetries: Infinity
        };
        this.requests = {
            AUTH: "AUTH",
            PING: "PING"
        };
        this.events = {
            CONNECTED: "connected",
            DISCONNECTED: "disconnected",
            READY: "ready",
            HEARTBEAT: "heartbeat"
        };
        this.handles = {
            AUTH: "RESPONSE",
            MESSAGE: "CHAT"
        };
        this.nonces = {
            AUTH: "client-auth",
            PING: "client-ping"
        };
        this.connected = false;
        this.authorized = false;
        this.ChatMessageEvents = {
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
        this.specialEvents = {
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
        this.config = {
            ...this.defaultChatServiceConfig,
            ...chatServiceConfig
        };
        this.socket = new reconnecting_websocket_1.default(this.endpoint, [], this.WebSocketParams);
        this.socket.onopen = () => {
            this.connected = true;
            this.emit(this.events.CONNECTED);
        };
    }
    connect(token) {
        if (!this.socket.OPEN) {
            return false;
        }
        this.send(this.requests.AUTH, this.nonces.AUTH, { token });
        return new Promise((resolve, reject) => {
            this.socket.onmessage = message => {
                const response = this.messageHandler(message).catch(reject);
                return resolve(response);
            };
            this.socket.onclose = event => {
                return this.disconnect(event.reason);
            };
        });
    }
    disconnect(error) {
        if (this.connected) {
            this.connected = false;
            this.authorized = false;
            return this.emit(this.events.DISCONNECTED, error);
        }
        return false;
    }
    send(type, nonce, data) {
        if (!this.connected) {
            return;
        }
        const message = { type, nonce, data };
        const toSend = JSON.stringify(message);
        return this.socket.send(toSend);
    }
    messageHandler(message) {
        const response = JSON.parse(message.data.toString());
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
    onAuth() {
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
    onMessage(response) {
        if (!response.data.chats) {
            return this.emitChatMessages([]);
        }
        if (this.config.fetchPastMessages && this.lastMessageTime === 0) {
            return this.emitChatMessages(response.data.chats);
        }
        const newMessages = this.getNewMessages(response.data.chats);
        return this.emitChatMessages(newMessages);
    }
    getNewMessages(messages) {
        const newMessages = messages.filter((message) => {
            return message.send_time > this.lastMessageTime;
        });
        return newMessages;
    }
    emitChatMessages(messages) {
        if (messages.length > 0) {
            messages.forEach((message) => {
                const event = this.ChatMessageEvents[message.type] || "message";
                return this.emit(event, message);
            });
        }
        const time = messages.length > 0 ? messages[messages.length - 1].send_time : Date.now();
        this.updateTime(time);
        return messages.length > 0;
    }
    updateTime(time = Date.now()) {
        this.lastMessageTime = Number(time.toString().substring(0, 10));
        return this.lastMessageTime;
    }
}
exports.default = ChatService;
