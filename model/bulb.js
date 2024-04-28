import mongoose, { Schema } from "mongoose";

const BulbSchema = new Schema({
    name: { type: String, required: true },
    status: Boolean
});

const Bulb = mongoose.model('Bulb', BulbSchema);

export default Bulb;