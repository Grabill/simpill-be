import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model /*, Types*/} from 'mongoose';
import { Symptom } from 'src/schema/symptom.schema';
import { SymptomQueryResultDto } from './dto/symptom-query-result.dto';
// import { BodyPart, BodyPartDocument} from 'src/schema/body-part.schema';
// import { populate } from 'src/util/database-helper';
// import * as SymptomData from './data/symptoms.json';


@Injectable()
export class SymptomService {
    constructor(
        @InjectModel(Symptom.name) private symptomModel: Model<Symptom>,
        // @InjectModel(BodyPart.name) private bodyPartModel: Model<BodyPart>
    ) {
        // let bodyPartModel = new Model<BodyPart>();
        // let bodyParts = Object.keys(SymptomData).map((key) => {
        //     return { name: key };
        // }) as BodyPart[];
        // populate(this.bodyPartModel, bodyParts).then((res) => {
        //     let symptoms = Object.entries(SymptomData).flatMap(([key, value]) => {
        //         return value.map((symptom: string) => {
        //             return { name: symptom, bodyPart: res.find((bodyPart: BodyPartDocument) => bodyPart.name === key)?._id };
        //         });
        //     });
        //     populate(this.symptomModel, symptoms);
        // });
    }

    async getAllSymptoms(): Promise<SymptomQueryResultDto[]> {
        return await this.symptomModel.aggregate([
            {
                $lookup: {
                    from: 'bodyparts',
                    localField: 'bodyPart',
                    foreignField: '_id',
                    as: 'bodyPart'
                }
            },
            {
                $unwind: '$bodyPart'
            },
            {
                $group: { _id: { name: '$bodyPart.name', _id: '$bodyPart._id' }, symptoms: { $push: { name: '$name', _id: '$_id' } } }
            },
            {
                $project: { bodyPart: '$_id', symptoms: 1, _id: 0 }
            },
            {
                $sort: { bodyPart: 1 }
            }
        ]);
    }
}
