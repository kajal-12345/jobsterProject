const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  location: {
    type: String,
  },
  jobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
     
        type: Schema.Types.ObjectId,
        ref: "Job",
    },
  ],
  myJobs: [
    {
      type:Schema.Types.ObjectId,
      ref:'Job'
    },
    
  ]
});
module.exports = mongoose.model("User", userSchema);
