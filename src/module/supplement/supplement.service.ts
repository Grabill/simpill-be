import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplement } from '../../schema/supplement.schema';
import { SupplementQueryResultDto } from './dto/supplement-query-result.dto';
import { PipeService } from '../../pipe.service';
import { PipeQuery } from '../..//pipe-query';
import { PipeResult } from '../../pipe-result';
// import { populate } from 'src/util/database-helper';
// import * as SupplementData from './data/splm_cleaned.json';

@Injectable()
export class SupplementService {
    constructor(
        @InjectModel(Supplement.name) private supplementModel: Model<Supplement>,
        private readonly pipeService: PipeService,
    ) {
        // populate(this.supplementModel, SupplementData as Supplement[]);

        if (process.env.SKIP_SUGGESTION === 'true') {
            return;
        }
        // Send all supplements to the pipe
        this.getAllSupplements().then((supplements) => {
            let data = JSON.stringify(supplements);
            this.pipeService.write2Pipe(new PipeQuery(data, false));
        });
    }

    /**
     * Find supplements by its name (case insensitive)
     * @param name name of the supplement
     * @param exact whether to match the name exactly
     * @param verbose whether to return the entire supplement object
     * @returns an array of supplements that match the name
     */
    async findByName(name: string, exact: boolean, verbose: boolean = false) : Promise<SupplementQueryResultDto[]> {
        name = name.toUpperCase();
        const filter: FilterQuery<Supplement> = exact ? { name: name } : { name: { $regex: new RegExp(name) } };
        const selection = verbose ? '-_id' : '-_id name overview';
        return await this.supplementModel.find(filter).select(selection);
    }

    /**
     * Find supplements by their names from PipeResult (case insensitive)
     * @param names an array of supplement names
     * @returns an array of supplements that match the names
     */
    async findByPipeResult(pipeResult: PipeResult) : Promise<SupplementQueryResultDto[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const names = pipeResult.data;
                const supplements: SupplementQueryResultDto[] = [];
                for (const name of names) {
                    const supplement = await this.supplementModel.findOne({ name: name.toUpperCase() }).select('-_id name overview');
                    if (supplement) {
                        supplements.push(supplement);
                    }
                }
                resolve(supplements);
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Get all supplements
     * @returns an array of all supplements
     */
    private async getAllSupplements() : Promise<Supplement[]> {
        return await this.supplementModel.find().select('-_id');
    }

    async getFirstTenSupplements() : Promise<Supplement[]> {
        return this.supplementModel.find().limit(10);
    }
}
