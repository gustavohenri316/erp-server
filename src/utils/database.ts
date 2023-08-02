import mongoose from "mongoose"
import { config } from "dotenv"

config()

const url = process.env.MONGODB_URI

let globalMongooseInstance: typeof mongoose | undefined

export const dbConnection = async () => {
  if (!globalMongooseInstance) {
    mongoose.set("strictQuery", false)
    if (url) {
      try {
        globalMongooseInstance = await mongoose.connect(url as string)
        console.log("Connected to Mongoose")
      } catch (error: any) {
        console.error("Error connecting to Mongoose:", error.message)
        throw error
      }
    } else {
      throw new Error("MONGODB_URI environment variable is not set.")
    }
  }
}
