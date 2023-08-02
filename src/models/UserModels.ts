import { Schema, models, model } from "mongoose"

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  cpf: { type: String, unique: true },
  rg: { type: String },
  birthDate: { type: String },
  street: { type: String },
  number: { type: String },
  complement: { type: String },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  countryRegion: { type: String },
  zipCode: { type: String },
  position: { type: String },
  education: { type: String },
  photo: { type: String },
  startDate: { type: String },
  salary: { type: String },
  employmentType: { type: String },
  username: { type: String, required: true, unique: true },
  corporateEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  team: { type: String, required: true },
  privileges: [{ type: Schema.Types.ObjectId, ref: "Privileges" }],
})

export default models.User || model("User", UserSchema)
