"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.nonces = {
            AUTH: "client-auth",
            PING: "client-ping"
        };
        this.lastMessageTime = Number(String(Date.now()).substring(0, 10));
    }
    connect(token) {
        return new Promise((resolve, reject) => {
            if (this.connected) {
                return resolve(false);
            }
            this.socket = new ws_1.default(this.endpoint);
            this.socket.onmessage = message => {
                try {
                    const response = this.messageHandler(message);
                    return resolve(response);
                }
                catch (error) {
                    return reject(this.disconnect(error));
                }
            };
            this.socket.onopen = () => {
                this.send("AUTH", this.nonces.AUTH, { token });
                this.connected = true;
            };
            this.socket.onerror = (error) => __awaiter(this, void 0, void 0, function* () {
                reject(this.disconnect(error));
                return yield this.connect(token);
            });
        });
    }
    disconnect(error) {
        this.emit("disconnected", error);
        this.connected = false;
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
                    this.emit("connected");
                    this.heartbeat = setInterval(() => {
                        this.send("PING", this.nonces.PING);
                        this.emit("heartbeat");
                    }, this.heartbeatRate * 1000);
                }
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
