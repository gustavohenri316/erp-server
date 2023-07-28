import mongoose from "mongoose"
require("dotenv").config()

const URI = 'mongodb+srv://gustavoholiver316:cWwx2NmoXkeQ2HPT@cluster0.t5wykgo.mongodb.net/?retryWrites=true&w=majority'

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
