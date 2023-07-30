import { Schema, model, Document, Model } from "mongoose";

export interface IPrivileges {
  name: string;
  createdAt: Date;
  createdByUser: string;
  description: string;
  key: string;
  permissions: Schema.Types.ObjectId[];
}

export interface IPrivilegesDocument extends IPrivileges, Document {}

const PrivilegesSchema = new Schema<IPrivileges>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  createdByUser: { type: String, required: true },
  description: { type: String, required: true },
  key: { type: String, required: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const Privileges: Model<IPrivilegesDocument> = model<IPrivilegesDocument>(
  "Privileges",
  PrivilegesSchema
);

export default Privileges;
