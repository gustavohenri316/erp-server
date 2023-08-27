import { Request, Response } from "express"
import { Types } from "mongoose"
import * as NotificationServices from "../../services/notification-services"
import { findUserById } from "../../services/user-services"
import Notification from "../../models/notifications-models"

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { receivedBy, message, title, sentBy, isGlobal } = req.body
    if (!message || !title || !sentBy) {
      return res
        .status(400)
        .send({ message: "Todos os campos são obrigatórios." })
    }
    if (!Array.isArray(receivedBy)) {
      return res
        .status(400)
        .send({ message: "receivedBy deve ser um array de IDs de usuários." })
    }
    await Promise.all(receivedBy.map(findUserById))
    await NotificationServices.createNotification(
      receivedBy,
      message,
      title,
      sentBy,
      isGlobal
    )
    res.status(201).send({ message: "Notificação enviada com sucesso!" })
  } catch (error: any) {
    res.status(error.status || 400).send({ message: error.message })
  }
}

export const getNotifications = async (
  userId: string,
  page: number,
  perPage: number
) => {
  const skip = (page - 1) * perPage

  const directNotificationsQuery = Notification.find({
    receivedBy: { $in: [userId] },
    isGlobal: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .populate("sentBy", "firstName lastName photo email team")
    .lean()

  const directNotifications = await directNotificationsQuery

  const globalNotificationsQuery = Notification.find({
    _id: { $nin: directNotifications.map((n: any) => n._id) },
    isGlobal: true,
    excludedFor: { $ne: userId },
    readBy: { $ne: userId },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .populate("sentBy", "firstName lastName photo email team")
    .lean()

  const globalNotifications = await globalNotificationsQuery

  // Obtenha o número total de documentos usando .countDocuments()
  const directNotificationsTotal = await Notification.countDocuments({
    receivedBy: { $in: [userId] },
    isGlobal: false,
  })

  const globalNotificationsTotal = await Notification.countDocuments({
    _id: {
      $nin: directNotifications.map((n) => n._id),
    },
    isGlobal: true,
    excludedFor: { $ne: userId },
    readBy: { $ne: userId },
  })

  return {
    directNotifications,
    globalNotifications,
    globalNotificationsCount: globalNotificationsTotal,
    directNotificationsCount: directNotificationsTotal,
  }
}

export const getSentNotificationsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params
    const user = await findUserById(userId)
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." })
    }
    const page = parseInt(req.query.page as string) || 1
    const perPage = parseInt(req.query.perPage as string) || 10
    const sentNotifications = await NotificationServices.getSentNotifications(
      userId,
      page,
      perPage
    )
    res.send(sentNotifications)
  } catch (error: any | any) {
    res.status(error.status || 400).send({ message: error.message })
  }
}

export const deleteNotificationById = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params
    const userId = req.query.userId as string
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." })
    }
    await NotificationServices.deleteNotification(notificationId, userId)
    res.send({ message: "Notificação excluída com sucesso." })
  } catch (error: any | any) {
    res.status(error.status || 400).send({ message: error.message })
  }
}

export const markNotificationAsReadById = async (
  req: Request,
  res: Response
) => {
  try {
    const { notificationId } = req.params
    const userId = req.query.userId as string
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." })
    }
    const objectIdUserId = new Types.ObjectId(userId)
    const updatedNotification =
      await NotificationServices.markNotificationAsRead(
        notificationId,
        objectIdUserId
      )
    res.send(updatedNotification)
  } catch (error: any | any) {
    res.status(error.status || 400).send({ message: error.message })
  }
}

export const getUnreadNotificationCountByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." })
    }
    const user = await findUserById(userId)
    if (!user) {
      return res.send({ count: 0 })
    }
    const count = await NotificationServices.countUnreadNotifications(userId)
    res.send({ count })
  } catch (error: any | any) {
    res.status(error.status || 400).send({ message: error.message })
  }
}
