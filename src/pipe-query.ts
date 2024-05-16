import { Builder } from "./util/builder";

export class PipeQuery {
    private query: string;

    constructor(str: string) {
        this.query = str + '|';
    }

    public toString(): string {
        return this.query;
    }
}

/**
 * Interface for the query builder pattern
 */
export class PipeQueryBuilder implements Builder<PipeQuery> {
    private query: PipeQuery;

    constructor() {
        this.query = null;
    }

    /**
     * Add a string to the query
     * @param str The string to add
     * @returns this
     */
    add(str: string): PipeQueryBuilder {
        this.query = new PipeQuery(this.query + str);
        return this;
    }
    
    /**
     * Build the query
     */
    build(): PipeQuery {
        return this.query;
    }
}