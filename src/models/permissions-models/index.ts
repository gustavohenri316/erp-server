import { Schema, model, Document } from "mongoose"

export interface IPermission extends Document {
  name: string
  createdAt: Date
  createdByUser: string
  description: string
  key: string
}
export interface IPermissionDocument extends IPermission, Document {}

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  createdByUser: { type: String, required: true },
  description: { type: String, required: true },
  key: { type: String, required: true },
})

export default model<IPermission>("Permission", PermissionSchema)
