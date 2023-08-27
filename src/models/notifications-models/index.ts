import mongoose, { Document, Schema } from "mongoose"

export interface INotification extends Document {
  receivedBy: mongoose.Types.ObjectId[] | string[]
  message: string
  title: string
  sentBy: mongoose.Types.ObjectId
  timestamp: Date
  createdAt: Date
  isRead: boolean
  isGlobal: boolean
  excludedFor?: mongoose.Types.ObjectId[]
  readBy?: mongoose.Types.ObjectId[]
  sentByInfo: {
    firstName: string
    lastName: string
    photo: string
    email: string
  }
}

const notificationSchema = new Schema<INotification>({
  receivedBy: [{ type: Schema.Types.Mixed, required: true }],
  message: { type: String, required: true },
  title: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isGlobal: { type: Boolean, default: false },
  excludedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sentByInfo: {
    firstName: String,
    lastName: String,
    photo: String,
    email: String,
  },
})

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
)

export default Notification
