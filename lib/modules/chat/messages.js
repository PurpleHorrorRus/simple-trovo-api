"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class ChatMessages extends events_1.default {
    constructor(chatServiceMessagesConfig = {}) {
        super();
        this.avatarEndpoint = "https://headicon.trovo.live";
        this.lastMessageTime = 0;
        this.ChatMessageEvents = {
            5: "spells",
            6: "super_cap",
            7: "colorful",
            8: "spell",
            9: "bullet_screen",
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
            SPELLS: this.ChatMessageEvents[5],
            SUPER_CAP: this.ChatMessageEvents[6],
            COLORFUL: this.ChatMessageEvents[7],
            SPELL: this.ChatMessageEvents[8],
            BULLET_SCREEN: this.ChatMessageEvents[9],
            SUBSCRIPTION: this.ChatMessageEvents[5001],
            SYSTEM: this.ChatMessageEvents[5002],
            FOLLOW: this.ChatMessageEvents[5003],
            WELCOME: this.ChatMessageEvents[5004],
            GIFT_SUB_RANDOM: this.ChatMessageEvents[5005],
            GIFT_SUB: this.ChatMessageEvents[5006],
            ACTIVITY: this.ChatMessageEvents[5007],
            RAID: this.ChatMessageEvents[5008],
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
            const messages = response.data.chats;
            messages.forEach((message) => {
                message = this.formatMessage(message);
                return message;
            });
            this.updateLastMessageTime(messages);
            return this.emit("past_messages", messages);
        }
        const newMessages = this.getNewMessages(response.data.chats);
        return this.emitChatMessages(newMessages);
    }
    formatMessage(message) {
        message.avatar = this.fixAvatar(message.avatar);
        return message;
    }
    emitChatMessages(messages) {
        if (messages.length > 0) {
            messages.forEach((message) => {
                message = this.formatMessage(message);
                const event = this.ChatMessageEvents[message.type] || "message";
                return this.emit(event, message);
            });
        }
        this.updateLastMessageTime(messages);
        return messages.length > 0;
    }
    getNewMessages(messages) {
        const newMessages = messages.filter((message) => {
            return message.send_time > this.lastMessageTime;
        });
        return newMessages;
    }
    updateLastMessageTime(messages) {
        const time = messages[messages.length - 1]?.send_time;
        return this.updateTime(time);
    }
    updateTime(time = Math.floor(Date.now() / 1000)) {
        this.lastMessageTime = time;
        return this.lastMessageTime;
    }
    fixAvatar(file) {
        if (!file) {
            return "";
        }
        return !~file?.indexOf(this.avatarEndpoint)
            ? `${this.avatarEndpoint}/user/${file}`
            : file;
    }
}
exports.default = ChatMessages;
