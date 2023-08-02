import { Schema, models, model, Document } from "mongoose"

export interface IForgot extends Document {
  email: string
  code: string
}

const ForgotSchema = new Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
})

export default models.Forgot || model<IForgot>("Forgot", ForgotSchema)
