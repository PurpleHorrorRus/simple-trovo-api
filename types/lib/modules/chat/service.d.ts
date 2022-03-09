/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "ws";
import { ChatServiceConfig, WSMesageData } from "../../interfaces/chat";
import { WSHandler } from "../../types/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private connected;
    private heartbeatRate;
    private defaultChatServiceConfig;
    private nonces;
    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    private lastMessageTime;
    constructor();
    connect(token: string, chatServiceConfig?: ChatServiceConfig): WSHandler;
    disconnect(error: Error | WebSocket.ErrorEvent | unknown): boolean;
    send(type: string, nonce: string, data?: WSMesageData): boolean;
    messageHandler(message: WebSocket.MessageEvent): WSHandler;
    updateTime(): number;
}
export default ChatService;
