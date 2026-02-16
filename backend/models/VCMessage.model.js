import mongoose from "mongoose";

const vcMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "VC name is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    image: {
      type: String, // URL to the VC's profile picture
      required: [true, "VC image is required"],
    },
    designation: {
      type: String,
      default: "Vice Chancellor",
    },
    isActive: {
      type: Boolean,
      default: true, // Only one active message should show at a time
    }
  },
  { timestamps: true }
);

export default mongoose.model("VCMessage", vcMessageSchema);