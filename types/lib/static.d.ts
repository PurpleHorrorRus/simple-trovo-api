declare class Static {
    handleError(error: string): Error;
    static generateQuery(params: any): string;
    static limit(value: number, min: number, max: number): number;
}
export default Static;
