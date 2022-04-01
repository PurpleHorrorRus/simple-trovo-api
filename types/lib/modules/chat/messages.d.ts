/// <reference types="node" />
import EventEmitter from "events";
import { ChatMessage, ChatServiceMessagesConfig } from "../../interfaces/chat";
import { ChatMessageEventsType, ChatSpecialEventType } from "../../types/chat";
declare class ChatMessages extends EventEmitter {
    private avatarEndpoint;
    private config;
    ChatMessageEvents: ChatMessageEventsType;
    events: ChatSpecialEventType;
    private time;
    private pastMessagesFetched;
    constructor(chatServiceMessagesConfig?: ChatServiceMessagesConfig);
    handle(response: any): boolean;
    getNewMessages(messages: ChatMessage[]): ChatMessage[];
    formatMessage(message: ChatMessage): ChatMessage;
    emitChatMessage(message: ChatMessage): boolean;
    emitPastMessages(messages: ChatMessage[]): boolean;
    fixAvatar(file: string | undefined): string;
}
export default ChatMessages;
