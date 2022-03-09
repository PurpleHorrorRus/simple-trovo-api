import { ChatServiceConfig } from "./chat"

export interface TrovoConfig {
    client_id: string
    access_token?: string,
    chatServiceConfig?: ChatServiceConfig
}

export interface AuthParams {
    client_id: string | undefined
    redirect_uri: string
    response_type: string
    scope: string
}