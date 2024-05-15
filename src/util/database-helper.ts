import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

/**
 * Function to populate a collection with data
 * @param model the model to populate
 * @param data the data to populate the collection witk
 * @returns void
 */
export function populate<Schema>(model: Model<Schema>, data: Schema[]) {
    const logger = new Logger(`populate<${model.modelName}>`); 
    logger.log(`Populating ${model.modelName} collection...`);
    model.insertMany(data)
        .then(() => logger.log(`Successfully populated ${model.collection.name} collection!`))
        .catch((error) => logger.error(`Failed to populate ${model.collection.name} collection: ${error}`));
}