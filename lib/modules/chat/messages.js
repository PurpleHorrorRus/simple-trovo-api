"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class ChatMessages extends events_1.default {
    constructor(chatServiceMessagesConfig = {}) {
        super();
        this.lastMessageTime = 0;
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
        this.events = {
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
        this.config = chatServiceMessagesConfig;
    }
    handle(response) {
        if (!response.data.chats) {
            return this.emitChatMessages([]);
        }
        if (this.config.fetchPastMessages && this.lastMessageTime === 0) {
            return this.emitChatMessages(response.data.chats);
        }
        const newMessages = this.getNewMessages(response.data.chats);
        return this.emitChatMessages(newMessages);
    }
    emitChatMessages(messages) {
        if (messages.length > 0) {
            messages.forEach((message) => {
                message.avatar = this.fixAvatar(message.avatar);
                const event = this.ChatMessageEvents[message.type] || "message";
                return this.emit(event, message);
            });
        }
        const time = messages.length > 0 ? messages[messages.length - 1].send_time : Date.now();
        this.updateTime(time);
        return messages.length > 0;
    }
    getNewMessages(messages) {
        const newMessages = messages.filter((message) => {
            return message.send_time > this.lastMessageTime;
        });
        return newMessages;
    }
    updateTime(time = Date.now()) {
        this.lastMessageTime = Number(time.toString().substring(0, 10));
        return this.lastMessageTime;
    }
    fixAvatar(file) {
        return !/https:/.test(file)
            ? `https://headicon.trovo.live/user/${file}`
            : file;
    }
}
exports.default = ChatMessages;
