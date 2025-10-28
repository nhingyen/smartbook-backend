import mongoose from "mongoose";
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
});

//sap xep theo thu tu chuong
chapterSchema.index({ bookId: 1, order: 1 }, { unique: true });

export default mongoose.model("Chapter", chapterSchema);
