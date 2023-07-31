import Notification, { INotification } from "../models/NotificationsModel";
import { Types } from "mongoose";

// Função para criar uma nova notificação
export const createNotification = async (
  receivedBy: string[] | Types.ObjectId[],
  message: string,
  title: string,
  sentBy: string,
  isGlobal: boolean
): Promise<INotification> => {
  const notification: INotification = await Notification.create({
    receivedBy,
    message,
    title,
    sentBy,
    isGlobal,
    isRead: false,
  });
  return notification;
};
// Função para obter as notificações diretas e globais de um usuário
export const getNotifications = async (userId: string) => {
  const directNotifications = await Notification.find({
    receivedBy: { $in: [userId] },
    isGlobal: false,
  });
  const globalNotifications = await Notification.find({
    _id: { $nin: directNotifications.map((n) => n._id) },
    isGlobal: true,
    excludedFor: { $ne: userId },
    readBy: { $ne: userId },
  });
  return {
    directNotifications,
    globalNotifications,
  };
};
// Função para obter as notificações enviadas por um usuário
export const getSentNotifications = async (userId: string) => {
  const sentNotifications = await Notification.find({
    sentBy: userId,
  });
  return sentNotifications;
};
// Função para excluir uma notificação
export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notificação não encontrada.");
  }
  if (String(notification.sentBy) !== userId) {
    throw new Error("Você não tem permissão para excluir esta notificação.");
  }
  await Notification.findByIdAndDelete(notificationId);
};

// Função para marcar uma notificação como lida
export const markNotificationAsRead = async (
  notificationId: string,
  userId: Types.ObjectId
) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notificação não encontrada.");
  }
  const receivedByArray = Array.isArray(notification.receivedBy)
    ? notification.receivedBy.map((id) => id.toString())
    : [];
  if (!receivedByArray.includes(userId.toString())) {
    if (notification.isGlobal) {
      if (
        notification.excludedFor &&
        notification.excludedFor.includes(userId)
      ) {
        throw new Error("Você já excluiu esta notificação global.");
      }
      if (notification.readBy && notification.readBy.includes(userId)) {
        throw new Error("Você já marcou esta notificação global como lida.");
      }
      notification.readBy = [...(notification.readBy || []), userId];
    } else {
      throw new Error(
        "Você não tem permissão para marcar esta notificação como lida."
      );
    }
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

export const countUnreadNotifications = async (userId: string) => {
  const directNotificationsCount = await Notification.countDocuments({
    receivedBy: { $in: [userId] },
    isGlobal: false,
    isRead: false,
  });

  const globalNotificationsCount = await Notification.countDocuments({
    isGlobal: true,
    excludedFor: { $ne: userId },
    readBy: { $ne: userId },
    isRead: false,
  });

  const totalUnreadNotifications =
    directNotificationsCount + globalNotificationsCount;
  return totalUnreadNotifications;
};
