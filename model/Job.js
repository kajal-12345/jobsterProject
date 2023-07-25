const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jobSchema = new Schema(
  {
    position: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    jobType: {
      type: String,
    },
    createdBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    appliedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", jobSchema);
