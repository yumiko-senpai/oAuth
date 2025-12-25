import mongoose from "mongoose";

const AgencySchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      minlength: 8
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    servicesOffered: {
      type: [String],
      default: []
    },
    address: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    process: {
      type: [String],
      default: []
    },
    contactInfo: {
        type: String,
        trim: true
    },
    partnerUniversities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University"
      }
    ],
  },
  {
    timestamps: true
  }
);

AgencySchema.index({ email: 1 }); 
export default mongoose.model("Agency", AgencySchema);