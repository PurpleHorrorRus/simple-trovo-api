import { ProcessEnv } from "../interfaces/primary"

export type TrovoConfig = ProcessEnv & {
    client_id: string
    access_token?: string
}

export type TrovoRequestType = Promise<any>