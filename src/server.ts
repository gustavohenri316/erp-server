import express from "express"
import cors from "cors"
import * as bodyParser from "body-parser"
import { config } from "dotenv"

import routers from "./routers"
import { dbConnection } from "./utils/database"
const main = async () => {
  config()
  const app = express()
  const port = process.env.PORT || 3333
  await dbConnection()
  app.use(express.json())
  app.use(cors())
  app.use(bodyParser.json())
  app.use("/api", routers)
  app.listen(port, () => {
    console.log(`App rodando em http://localhost:${port}`)
  })
}

main()
