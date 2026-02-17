import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Highlight text is required"],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "Highlight link is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Highlight", highlightSchema);