import mongoose from 'mongoose';

export type CustomerStatus = 
  | 'new' 
  | 'contacted' 
  | 'interested' 
  | 'not_interested' 
  | 'meeting_scheduled' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'won' 
  | 'lost';

export type ContactType = 'call' | 'message' | 'email' | 'meeting';

export interface IContactHistory {
  date: Date;
  type: ContactType;
  notes: string;
  createdBy?: string;
}

export interface INote {
  content: string;
  createdAt: Date;
  createdBy?: string;
}

export interface ICustomer {
  name: string;
  phoneNumber: string;
  email?: string;
  instagram?: string;
  address?: string;
  description?: string;
  country: string;
  category: string;
  status: CustomerStatus;
  source: 'crawl' | 'excel' | 'manual';
  notes: INote[];
  contactHistory: IContactHistory[];
  lastContactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['call', 'message', 'email', 'meeting'],
    required: true 
  },
  notes: { type: String, required: true },
  createdBy: { type: String }
});

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String }
});

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String},
    email: { type: String },
    instagram: { type: String },
    address: { type: String },
    description: { type: String },
    country: { type: String, default: 'Unknown' },
    category: { 
      type: String, 
      default: 'other',
      enum: [
        'buildingServices', 'education', 'realState', 'cosmetic', 
        'healthcare&beauty', 'dentists', 'pets', 'marketings', 
        'sweets', 'resturants', 'other', 'insurance', 
        'contentcreation', 'homeStaffs', 'cars', 'finance', 
        'transportation', 'clothes', 'imagination', 'music', 
        'exchange', 'foodsuply', 'accountant', 'lawer', 
        'athlit', 'tourism', 'flowe', 'supermarket'
      ]
    },
    status: { 
      type: String, 
      enum: ['new', 'contacted', 'interested', 'not_interested', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost'],
      default: 'new'
    },
    source: { 
      type: String, 
      enum: ['crawl', 'excel', 'manual'],
      required: true 
    },
    notes: [NoteSchema],
    contactHistory: [ContactHistorySchema],
    lastContactedAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
CustomerSchema.index({ phoneNumber: 1 });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ category: 1 });
CustomerSchema.index({ country: 1 });
CustomerSchema.index({ createdAt: -1 });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
