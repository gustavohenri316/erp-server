import { Schema, model, Document, Model } from "mongoose"

export interface ITeams {
  name: string
  createdAt: Date
  description: string
  members: Schema.Types.ObjectId[]
}

export interface ITeamsDocument extends ITeams, Document {}

const TeamsSchema = new Schema<ITeams>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

const Teams: Model<ITeamsDocument> = model<ITeamsDocument>("Teams", TeamsSchema)

export default Teams
