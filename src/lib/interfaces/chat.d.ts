import { ChatMessageType } from "../types/chat";

interface ChatServiceMessagesConfig { 
    fetchPastMessages?: boolean
}

export interface ChatServiceConfig {
    user_id?: number
    messages?: ChatServiceMessagesConfig
}

export interface WSMesageData {
    [key: string]: string | Array<any>
}

export interface WSMessage {
    type: string
    nonce: string
    data?: WSMesageData
}

export interface ChatMessage { 
    type: ChatMessageType
    content: string
    nick_name: string
    avatar: string
    sub_lv?: string
    sub_tier: string
    medals: string[]
    decos?: string[]
    roles: string[]
    message_id: string
    sender_id: number
    send_time: number
    uid: number
    user_name: string
    content_data: any
    custom_role: string
}