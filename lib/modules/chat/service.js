"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const ws_1 = __importDefault(require("ws"));
const messages_1 = __importDefault(require("./messages"));
const defaultChatServiceConfig = {
    messages: {
        fetchPastMessages: false
    }
};
class ChatService extends events_1.default {
    constructor(chatServiceConfig = defaultChatServiceConfig) {
        super();
        this.endpoint = "wss://open-chat.trovo.live/chat";
        this.heartbeatRate = 25;
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
        this.messages = new messages_1.default(chatServiceConfig.messages);
        this.config = {
            ...defaultChatServiceConfig,
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
            clearInterval(this.heartbeat);
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
                const result = this.messages.handle(response);
                return Promise.resolve(result);
            }
        }
        return Promise.reject();
    }
    onAuth() {
        // Watch only new messages
        if (!this.config.messages?.fetchPastMessages) {
            this.messages.updateTime();
        }
        this.heartbeat = setInterval(() => {
            this.send(this.requests.PING, this.nonces.PING);
            this.emit(this.events.HEARTBEAT);
        }, this.heartbeatRate * 1000);
        return this.emit(this.events.READY);
    }
}
exports.default = ChatService;
