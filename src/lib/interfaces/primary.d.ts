import { ChatServiceConfig } from "./chat"

export interface TrovoConfig {
    client_id: string
    client_secret: string
    redirect_uri: string
    credits?: string
    chatServiceConfig?: ChatServiceConfig
}

export interface AuthParams {
    client_id: string | undefined
    redirect_uri: string
    response_type: string
    scope: string
}