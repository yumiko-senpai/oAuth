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
     logo: {
      type: String,
      trim: true,
    },
    servicesOffered: {
      type: [String],
      default: []
    },
    address: {
      type: String,
      trim: true
    },
    about: {
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
    studentsRegistered: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student" 
      }
    ],

  },
  { timestamps: true}
);

