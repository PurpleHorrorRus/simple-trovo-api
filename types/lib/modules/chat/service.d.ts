/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "ws";
import { ChatServiceConfig, ChatMessage, WSMesageData } from "../../interfaces/chat";
import { ChatMessageEventsType, WSHandler } from "../../types/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private connected;
    private heartbeatRate;
    private defaultChatServiceConfig;
    private nonces;
    ChatMessageEvents: ChatMessageEventsType;
    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    private lastMessageTime;
    constructor();
    connect(token: string, chatServiceConfig?: ChatServiceConfig): WSHandler;
    disconnect(error: Error | WebSocket.ErrorEvent | unknown): boolean;
    send(type: string, nonce: string, data?: WSMesageData): boolean;
    messageHandler(message: WebSocket.MessageEvent): WSHandler;
    emitChatMessages(messages: ChatMessage[]): boolean;
    updateTime(): number;
}
export default ChatService;
