import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplement } from 'src/schema/supplement.schema';
import { SupplementQueryResultDto } from './dto/supplement-query-result.dto';
import { PipeService } from 'src/pipe.service';
import { PipeQuery } from 'src/pipe-query';
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
            this.pipeService.write2Pipe(new PipeQuery(data));
        });
    }

    /**
     * Find a supplement by its name (case insensitive)
     * @param name name of the supplement
     * @param exact whether to match the name exactly
     * @returns an array of supplements that match the name
     */
    async findByName(name: string, exact: boolean) : Promise<SupplementQueryResultDto[]> {
        name = name.toUpperCase();
        let filter: FilterQuery<Supplement>;
        if (exact) {
            filter = { name: name };
        }
        else {
            filter = { name: { $regex: new RegExp(name) } };
        }
        return await this.supplementModel.find(filter).select('name overview');
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
