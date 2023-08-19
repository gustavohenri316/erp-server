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
  feedbackType: string
  scaleType: string | null
  createdAt: Date
  description: string
  feedbacks: IFeedback[]
}

export interface IPollsDocument extends IPolls, Document {}

const FeedbackSchema = new Schema<IFeedback>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedbackMessage: { type: String, required: true },
  assessment: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
})

const PollsSchema = new Schema<IPolls>({
  title: { type: String, required: true },
  createdByAvatar: { type: String, required: true },
  createdByName: { type: String, required: true },
  createdByEmail: { type: String, required: true },
  feedbackType: { type: String, required: true },
  scaleType: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
  feedbacks: [FeedbackSchema],
})

const Polls: Model<IPollsDocument> = model<IPollsDocument>("Polls", PollsSchema)

export default Polls
