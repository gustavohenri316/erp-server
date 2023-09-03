import { Document, Schema, model, Model } from "mongoose"

export interface IProduct extends Document {
  image: string
  description: string
  code: string
  ean: string
  supplier: Schema.Types.ObjectId
  manufacturer: string
  quantity: string
  replacementUnit: string
  conversionFactor: string
  infoPrice: {
    wholesalePrice: string
    retailPrice: string
    posPrice: string
  }
  infoProduct: {
    weightUnit: string
    netWeight: string
    grossWeight: string
    shelfLife: string
    height: string
    width: string
    depth: string
    volume: string
    length: string
  }
  infoLogistics: {
    layersPerPallet: string
    rowsPerPallet: string
    packagingQuantityPerPallet: string
  }
}

const productSchema: Schema<IProduct> = new Schema({
  image: { type: String, required: false },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  ean: { type: String, required: true, unique: true },
  supplier: { type: Schema.Types.ObjectId, ref: "Customers", required: false },
  manufacturer: { type: String, required: false },
  quantity: { type: String, required: false },
  replacementUnit: { type: String, required: true },
  conversionFactor: { type: String, required: true },
  infoPrice: {
    wholesalePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    posPrice: { type: Number, required: true },
  },
  infoProduct: {
    weightUnit: { type: String, required: false },
    netWeight: { type: Number, required: false },
    grossWeight: { type: Number, required: false },
    shelfLife: { type: Number, required: false },
    height: { type: Number, required: false },
    width: { type: Number, required: false },
    depth: { type: Number, required: false },
    volume: { type: Number, required: false },
    length: { type: Number, required: false },
  },
  infoLogistics: {
    layersPerPallet: { type: Number, required: false },
    rowsPerPallet: { type: Number, required: false },
    packagingQuantityPerPallet: { type: Number, required: false },
  },
})

const Product: Model<IProduct> = model<IProduct>("Product", productSchema)

export default Product
