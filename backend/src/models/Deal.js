import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    stage: {
      type: String,
      enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
      default: 'lead',
    },
    probability: {
      type: Number,
      default: 25,
      min: 0,
      max: 100,
    },
    expectedCloseDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Deal', dealSchema);
