import { Router } from "express"
import { body } from "express-validator"

import errorHandler from "../controllers/errorHandler"
import * as ForgotController from "../controllers/forgot-controller"
import * as NotificationsController from "../controllers/notifications-controller"
import * as PermissionsController from "../controllers/permissions-controller"
import * as PrivilegesController from "../controllers/privileges-controller"
import * as UsersController from "../controllers/user-controller"
import * as TeamsController from "../controllers/teams-controller"
import * as PollsController from "../controllers/polls-controller"
import * as CustomersController from "../controllers/customers-controller"

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
router.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 8

  try {
    const notifications = await NotificationsController.getNotifications(
      userId,
      page,
      perPage
    )
    res.send(notifications)
  } catch (error: any) {
    res.status(error.status || 400).send({ message: error.message })
  }
})

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

// Permission
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

// Privilege
router.post("/privileges/", PrivilegesController.createPrivilege)
router.get("/privileges", PrivilegesController.listPrivileges)
router.put("/privileges/:id", PrivilegesController.updatePrivilege)
router.delete("/privileges/:id", PrivilegesController.deletePrivilege)
router.get("/privileges/:id", PrivilegesController.getPrivilegeById)

// User
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

// Teams
router.post("/teams", TeamsController.createTeam)
router.post("/teams", TeamsController.createTeam)
router.get("/teams", TeamsController.listTeams)
router.get("/teams/:id", TeamsController.getTeamById)
router.put("/teams/:id", TeamsController.updateTeam)
router.delete("/teams/:id", TeamsController.deleteTeam)

// Polls

router.post("/polls/:userId", PollsController.createPoll)
router.post("/polls/add-feedback/:pollId", PollsController.addFeedback)
router.get("/polls/:userId", PollsController.listPolls)
router.get("/polls/:userId/:pollId", PollsController.getPollById)
router.put("/polls/:pollId", PollsController.editPoll)
router.delete("/polls/:userId/:pollId", PollsController.deletePoll)
router.delete(
  "/polls/:userId/:pollId/feedbacks/:feedbackId",
  PollsController.deleteFeedback
)

// Customers

router.post("/customers", CustomersController.createCustomer)
router.get("/customers", CustomersController.getAllCustomers)
router.get("/customers/:id", CustomersController.getCustomerById)
router.put("/customers/:id", CustomersController.updateCustomer)
router.delete("/customers/:id", CustomersController.deleteCustomer)

export default router
