import mongoose from "mongoose"
require("dotenv").config()

const URI = process.env.MONGODB_URI

let globalMongooseInstance: typeof mongoose | undefined

const dbConnection = async () => {
  if (!globalMongooseInstance) {
    mongoose.set("strictQuery", false)
    if (URI) {
      globalMongooseInstance = await mongoose.connect(URI as string)
    } else {
      throw new Error("MONGODB_URI environment variable is not set.")
    }
  }
}

export default dbConnection
