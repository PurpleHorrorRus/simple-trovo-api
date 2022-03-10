export type WSHandler = Promise<boolean | Error> | boolean;
export type ChatMessageType = 0 | 5 | 6 | 7 | 8 | 9 | 5001 | 5003 | 5004 | 5005 | 5006 | 5007 | 5008 | 5009 | 5012 | 5013;
export type ChatMessageEventsType = {
    [key: number]: string
};