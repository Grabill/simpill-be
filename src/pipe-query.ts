// import { Builder } from "./util/builder";
import { v4 as uuidv4 } from 'uuid';

export class PipeQuery {
    private query: string;
    id: string;

    constructor(str: string, hasId: boolean = true) {
        this.query = str;
        this.id = hasId ? uuidv4() : null;
    }

    public toString(): string {
        return (this.id ? this.id + ' ' : '') + this.query + '|';
    }
}

// /**
//  * Interface for the query builder pattern
//  */
// export class PipeQueryBuilder implements Builder<PipeQuery> {
//     private query: PipeQuery;

//     constructor() {
//         this.query = null;
//     }

//     /**
//      * Add a string to the query
//      * @param str The string to add
//      * @returns this
//      */
//     add(str: string): PipeQueryBuilder {
//         this.query = new PipeQuery(this.query + str);
//         return this;
//     }
    
//     /**
//      * Build the query
//      */
//     build(): PipeQuery {
//         return this.query;
//     }
// }