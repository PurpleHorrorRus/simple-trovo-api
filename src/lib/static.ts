class Static {
    handleError(error: string): Error {
        throw new Error(error);
    }

    static generateQuery(params: any): string {
        const entries = Object.entries(params);
        const mappedPairs: Array<string> = entries.map(([key, value]) => (`${key}=${value}`));
        return mappedPairs.join("&");
    }

    static limit(value: number, min: number, max: number): number {
        return Math.max(Math.min(value, max), min);
    }
}

export default Static;