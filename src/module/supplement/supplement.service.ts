import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplement } from 'src/schema/supplement.schema';
// import populate from 'src/util/populate';
// import * as SupplementData from './data/splm_cleaned.json';

@Injectable()
export class SupplementService {
    constructor(@InjectModel(Supplement.name) private supplementModel: Model<Supplement>) {
        // populate(this.supplementModel, SupplementData as Supplement[]);
    }

    async findByName(name: string) : Promise<Supplement> {
        return this.supplementModel.findOne({ name: name.toUpperCase() });
    }

    async getFirstTenSupplements() : Promise<Supplement[]> {
        return this.supplementModel.find().limit(10);
    }
}
