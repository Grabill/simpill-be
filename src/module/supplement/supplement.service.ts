import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplement } from 'src/schema/supplement.schema';
// import { populate } from 'src/util/database-helper';
// import * as SupplementData from './data/splm_cleaned.json';

@Injectable()
export class SupplementService {
    constructor(@InjectModel(Supplement.name) private supplementModel: Model<Supplement>) {
        // populate(this.supplementModel, SupplementData as Supplement[]);
    }

    /**
     * Find a supplement by its name (case insensitive)
     * @param name name of the supplement
     * @param exact whether to match the name exactly
     * @returns an array of supplements that match the name
     */
    async findByName(name: string, exact: boolean) : Promise<Supplement[]> {
        name = name.toUpperCase();
        if (exact) {
            return await this.supplementModel.find({ name: name });
        }
        return await this.supplementModel.find({ name: { $regex: new RegExp(name) } });
    }

    async getFirstTenSupplements() : Promise<Supplement[]> {
        return this.supplementModel.find().limit(10);
    }
}
