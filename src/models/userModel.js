import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "properties",
    },
  ],
  recommendationsReceived: [
  {
     propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'properties' },
      recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      recommendedAt: { type: Date, default: Date.now },
  }
]

});

export const User = mongoose.model("user", userSchema);
