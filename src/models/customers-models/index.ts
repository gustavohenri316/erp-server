import mongoose, { Schema, models, model, Document } from "mongoose"

export interface ICustomers extends Document {
  corporateReason: string
  fantasyName: string
  document: string
  isSupplier: boolean
  isBuyer: boolean
  avatar_url: string
  responsible: mongoose.Types.ObjectId
}

const CustomersSchema = new Schema<ICustomers>({
  corporateReason: { type: String, required: true, unique: true },
  document: { type: String, required: true, unique: true },
  isSupplier: { type: Boolean, required: true },
  isBuyer: { type: Boolean, required: true },
  fantasyName: { type: String, required: true },
  avatar_url: { type: String, required: false },
  responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

export default models.Customers ||
  model<ICustomers>("Customers", CustomersSchema)
