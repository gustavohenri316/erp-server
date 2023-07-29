import dbConnection from "../utils/database";
import Notification, { INotification } from "../models/NotificationsModel";

export const createNotification = async (
  receivedBy: string,
  message: string,
  title: string,
  sentBy: string,
  isGlobal: boolean
) => {
  await dbConnection();
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

export const getNotifications = async (userId: string) => {
  await dbConnection();
  const notifications = await Notification.find({
    $or: [{ receivedBy: userId }, { isGlobal: true }],
  });
  return notifications;
};

export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  await dbConnection();
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error("Notification not found.");
  }
  if (!notification.isGlobal) {
    if (String(notification.receivedBy) !== userId) {
      throw new Error("You are not authorized to delete this notification.");
    }
  } else {
    if (String(notification.sentBy) !== userId) {
      throw new Error("You are not authorized to delete this notification.");
    }
  }
  await Notification.findByIdAndDelete(notificationId);
};


export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  await dbConnection();
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new Error("Notification not found.");
  }

  // Verifica se a notificação pertence ao usuário antes de marcar como lida
  if (notification.receivedBy.toString() !== userId) {
    throw new Error("You are not authorized to mark this notification as read.");
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

export const countUnreadNotifications = async (userId: string) => {
  await dbConnection();
  const count = await Notification.countDocuments({ receivedBy: userId, isRead: false });
  return count;
};