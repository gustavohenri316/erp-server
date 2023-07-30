import express = require("express");
import cors = require("cors");
import * as bodyParser from "body-parser";
import { config } from "dotenv";

import userController from "./controllers/UserController";
import forgotController from "./controllers/ForgotController";
import permissionController from "./controllers/PermissionsController";
import privilegesController from "./controllers/PrivilegesController";
import notificationsController from "./controllers/NotificationsController";
import { dbConnection } from "./utils/database";

const main = async () => {
  config();
  const app = express();
  const port = process.env.PORT || 3333;
  await dbConnection();

  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/api/user", userController);
  app.use("/api/forgot", forgotController);
  app.use("/api/permission", permissionController);
  app.use("/api/privileges", privilegesController);
  app.use("/api/notifications", notificationsController);
  app.listen(port, () => {
    console.log(`App rodando em http://localhost:${port}`);
  });
};

main();
