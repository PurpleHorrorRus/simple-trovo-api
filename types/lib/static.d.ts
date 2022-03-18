declare class Static {
    handleError(error: any): Error;
    static generateQuery(params: any): string;
    static limit(value: number, min: number, max: number): number;
}
export default Static;
