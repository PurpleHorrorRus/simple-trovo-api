/// <reference types="node" />
import EventEmitter from "events";
import WebSocket from "reconnecting-websocket";
import { ChatServiceConfig, ChatMessage, WSMesageData } from "../../interfaces/chat";
import { ChatMessageEventsType, WSHandler } from "../../types/chat";
declare class ChatService extends EventEmitter {
    private endpoint;
    private lastMessageTime;
    private heartbeatRate;
    private defaultChatServiceConfig;
    private WebSocketParams;
    private requests;
    events: {
        CONNECTED: string;
        DISCONNECTED: string;
        READY: string;
        HEARTBEAT: string;
    };
    private handles;
    private nonces;
    connected: boolean;
    authorized: boolean;
    ChatMessageEvents: ChatMessageEventsType;
    specialEvents: {
        MESSAGE: string;
        SUBSCRIPTION: string;
        SYSTEM: string;
        FOLLOW: string;
        WELCOME: string;
        GIFT_SUB_RANDOM: string;
        GIFT_SUB: string;
        ACTIVITY: string;
        RADI: string;
        CUSTOM_SPELL: string;
        STREAM: string;
        UNFOLLOW: string;
    };
    config: ChatServiceConfig;
    socket: WebSocket;
    heartbeat: NodeJS.Timer;
    constructor(chatServiceConfig?: ChatServiceConfig);
    connect(token: string): WSHandler | Promise<WSHandler>;
    disconnect(error: string): boolean;
    send(type: string, nonce: string, data?: WSMesageData): void;
    messageHandler(message: any): Promise<WSHandler>;
    onAuth(): boolean;
    onMessage(response: any): boolean;
    getNewMessages(messages: ChatMessage[]): ChatMessage[];
    emitChatMessages(messages: ChatMessage[]): boolean;
    updateTime(time?: number): number;
}
export default ChatService;
