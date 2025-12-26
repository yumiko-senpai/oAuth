import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true
    },
    level: {
      type: String,
      enum: ["undergraduate", "graduate", "diploma", "phd"],
    },
    duration: { 
        type: String 
    }, 
    tuitionFee: { 
        type: String
    },
    description: { 
        type: String 
    },
    entryRequirements: {
      type: [String]
    },
    intakes: { 
        type: [String] 
    }
  },
  { timestamps: true }
);
