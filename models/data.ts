import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';


const DataSchema = new mongoose.Schema({
    name: { type: String },
    phoneNumber: { type: String },
    instagram: { type: String },
    address: { type: String },
    email: { type: String },
    description: { type: String },
    country: { type: String },
    category: { type: String, enum: ["buildingServices", "education", "realState", "cosmetic", "healthcare&beauty", "dentists", "pets", 
        "marketings", "sweets", "resturants", "other", "insurance", "contentcreation", "homeStaffs", "cars", "finance", "transportation"
    ,"clothes","imagination","music","exchange","foodsuply","accountant","lawer","athlit","tourism","flowe","supermarket"] }
}, { timestamps: true });


export default mongoose.models.Data || mongoose.model('Data', DataSchema);

