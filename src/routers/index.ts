import { Router } from "express"
import { body } from "express-validator"

import errorHandler from "../controllers/errorHandler"
import * as ForgotController from "../controllers/forgot-controller"
import * as NotificationsController from "../controllers/notifications-controller"
import * as PermissionsController from "../controllers/permissions-controller"
import * as PrivilegesController from "../controllers/privileges-controller"
import * as UsersController from "../controllers/user-controller"
import * as TeamsController from "../controllers/teams-controller"

const router = Router()

// Forgot password routes
router.post("/forgot/generate-code", ForgotController.generateCode)
router.post("/forgot/verify-code", ForgotController.verifyCode)

// Error handler
router.use(errorHandler)

// Notifications routes
router.post(
  "/notifications",
  [
    body("receivedBy")
      .isArray()
      .withMessage("receivedBy deve ser um array de IDs de usuários."),
    body("message").notEmpty().withMessage("Campo 'message' é obrigatório."),
    body("title").notEmpty().withMessage("Campo 'title' é obrigatório."),
    body("sentBy").notEmpty().withMessage("Campo 'sentBy' é obrigatório."),
  ],
  NotificationsController.sendNotification
)
router.get(
  "/notifications/:userId",
  NotificationsController.getNotificationsByUserId
)
router.get(
  "/notifications/sent/:userId",
  NotificationsController.getSentNotificationsByUserId
)
router.delete(
  "/notifications/:notificationId",
  NotificationsController.deleteNotificationById
)
router.put(
  "/notifications/:notificationId/mark-as-read",
  NotificationsController.markNotificationAsReadById
)
router.get(
  "/notifications/unread-count/:userId",
  NotificationsController.getUnreadNotificationCountByUserId
)

// Permission routes
router.post("/permission/", PermissionsController.createPermissionController)
router.delete(
  "/permission/:permissionId",
  PermissionsController.deletePermissionByIdController
)
router.get("/permission", PermissionsController.listPermissionsController)
router.get(
  "/permission/search",
  PermissionsController.searchPermissionsController
)
router.get(
  "/permission/search-by-name",
  PermissionsController.searchPermissionByNameController
)

// Privilege routes
router.post("/privileges/", PrivilegesController.createPrivilege)
router.get("/privileges", PrivilegesController.listPrivileges)
router.put("/privileges/:id", PrivilegesController.updatePrivilege)
router.delete("/privileges/:id", PrivilegesController.deletePrivilege)
router.get("/privileges/:id", PrivilegesController.getPrivilegeById)

// User routes
router.post("/user/login", UsersController.loginUser)
router.get("/user/:userId/profile", UsersController.getUserProfile)
router.patch(
  "/user/:userId/password",
  UsersController.updateUserPasswordController
)
router.get("/user/", UsersController.searchUsers)
router.post("/user/", UsersController.createUserController)
router.delete("/user/:userId", UsersController.deleteUserController)
router.put("/user/:userId", UsersController.updateUserController)
router.get("/user/:userId", UsersController.getUserById)
router.get("/user/:userId/privilege", UsersController.getUserPrivileges)
router.get("/user/:userId/permission-key", UsersController.getUserPermissionKey)

router.post("/teams", TeamsController.createTeam)
router.post("/teams", TeamsController.createTeam)
router.get("/teams", TeamsController.listTeams)
router.get("/teams/:id", TeamsController.getTeamById)
router.put("/teams/:id", TeamsController.updateTeam)
router.delete("/teams/:id", TeamsController.deleteTeam)

export default router
