import mongoose, { Schema, models, model, Document } from "mongoose"

export interface ICustomers extends Document {
  corporateReason: string
  fantasyName: string
  document: string
  bond: string
  avatar_url: string
  responsible: mongoose.Types.ObjectId
}

const CustomersSchema = new Schema<ICustomers>({
  corporateReason: { type: String, required: true, unique: true },
  document: { type: String, required: true, unique: true },
  bond: { type: String, required: true },
  fantasyName: { type: String, required: true },
  avatar_url: { type: String, required: false },
  responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

export default models.Customers ||
  model<ICustomers>("Customers", CustomersSchema)
