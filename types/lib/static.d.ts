/// <reference types="node" />
import EventEmitter from "events";
declare class Static extends EventEmitter {
    constructor();
    handleError(error: any): Error;
    static generateQuery(params: any): string;
    static limit(value: number, min: number, max: number): number;
}
export default Static;
