const AgentSchema = new mongoose.Schema(
  {
    // Personal Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    profilePhoto: String,
    
    // Agency they belong to
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true
    },
    
    // Role and specialization
    role: {
      type: String,
      enum: ["visa_officer", "admission_officer", "counselor", "manager", "general"],
      default: "general"
    },

    assignedStudents: [{
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      assignedDate: Date
    }],

    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active"
    }
  },
  { timestamps: true }
);