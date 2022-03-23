/// <reference types="node" />
import EventEmitter from "events";
import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType, ChatSpecialEventType } from "../../types/chat";
declare class ChatMessages extends EventEmitter {
    private avatarEndpoint;
    private config;
    ChatMessageEvents: ChatMessageEventsType;
    events: ChatSpecialEventType;
    private lastMessagesFetched;
    constructor(chatServiceMessagesConfig?: ChatServiceMessagesConfig);
    handle(response: any): boolean;
    formatMessage(message: ChatMessage): ChatMessage;
    emitChatMessage(message: ChatMessage): boolean;
    emitPastMessages(response: any): boolean;
    fixAvatar(file: string | undefined): string;
}
export default ChatMessages;
