export interface ChatServiceConfig {
    fetchAllMessages: boolean = false
}

export interface WSMesageData {
    [key: string]: string | Array<any>
}

export interface WSMessage {
    type: string
    nonce: string
    data?: WSMesageData
}

type ChatMessageType = 0 | 5 | 6 | 7 | 8 | 9 | 5001 | 5003 | 5004 | 5005 | 5006 | 5007 | 5008 | 5009 | 5012 | 5013;
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