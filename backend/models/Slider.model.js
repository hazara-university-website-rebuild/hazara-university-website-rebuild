import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Slider title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: [true, "Media URL is required"],
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    buttonText: {
      type: String,
      default: "Learn More",
    },
    buttonLink: {
      type: String,
    },
    order: {
      type: Number,
      default: 0, // Used to sequence slides
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Slider", sliderSchema);