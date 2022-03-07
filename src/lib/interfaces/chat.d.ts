export interface WSMesageData {
    [key: string]: string | Array<any>
}

export interface WSMessage {
    type: string
    nonce: string
    data?: WSMesageData
}