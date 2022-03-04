export interface ProcessEnv {
    [key: string]: string | undefined
}

export interface Errors {
    [name: string]: string
}

export interface AuthParams {
    client_id: string | undefined
    redirect_uri: string
    response_type: string
    scope: string
    state: string
}