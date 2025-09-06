import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true
    },
    fromEmail: {
      type: String,
      require: true,
    },
    toEmail: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    openCount: {
      type: Number,
      default: 0
    },
    trackEnable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "draft"],
      default: "draft",
    },
    redirectUrl: {
      type: String,
    },
    trackUrl: {
      type: String,
    },
    isClick: {
      type: Boolean
    },
    clickCount: {
      type:Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.models.emails || mongoose.model("emails", emailSchema);
