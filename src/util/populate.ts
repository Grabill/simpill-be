import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

export default function populate<Schema>(model: Model<Schema>, data: Schema[]) {
    const logger = new Logger(`Populator<${model.modelName}>`); 
    logger.log(`Populating ${model.modelName} collection...`);
    model.insertMany(data)
        .then(() => logger.log(`Successfully populated ${model.collection.name} collection!`))
        .catch((error) => logger.error(`Failed to populate ${model.collection.name} collection: ${error}`));
}