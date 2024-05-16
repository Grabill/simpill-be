import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model /*, Types*/} from 'mongoose';
import { Symptom } from 'src/schema/symptom.schema';
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

}
