import { Schema, model, Document, Model } from "mongoose"

export interface IFeedback {
  _id: any
  name: string
  email: string
  feedbackMessage: string
  createdAt: Date
  assessment: number
}

export interface IPolls {
  title: string
  createdByName: string
  createdByEmail: string
  createdByAvatar: string
  isFeedbackPublic: boolean
  createdAt: Date
  description: string
  feedbacks: IFeedback[]
}

export interface IPollsDocument extends IPolls, Document {}

const FeedbackSchema = new Schema<IFeedback>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedbackMessage: { type: String, required: false },
  assessment: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
})

const PollsSchema = new Schema<IPolls>({
  title: { type: String, required: true },
  createdByAvatar: { type: String, required: true },
  createdByName: { type: String, required: true },
  createdByEmail: { type: String, required: true },
  isFeedbackPublic: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
  feedbacks: [FeedbackSchema],
})

const Polls: Model<IPollsDocument> = model<IPollsDocument>("Polls", PollsSchema)

export default Polls
