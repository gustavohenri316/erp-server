import { Router, Request, Response } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  countUnreadNotifications,
} from "../services/NotificationServices";
import { findUserById } from "../services/UserServices";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { receivedBy, message, title, sentBy, isGlobal } = req.body;

    if (!message || !title || !sentBy) {
      return res.status(400).send({ message: "All fields are required." });
    }

    const user = await findUserById(receivedBy);
    // if (!user) {
    //   return res.status(404).send({ message: "User not found." });
    // }
    const notification = await createNotification(
      receivedBy,
      message,
      title,
      sentBy,
      isGlobal
    );
    res.status(201).send(notification);
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const notifications = await getNotifications(userId);
    res.send({ notifications });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:notificationId", async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.query.userId as string; // Extrair o ID do usuário da query

    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID not provided in the query." });
    }

    await deleteNotification(notificationId, userId);
    res.send({ message: "Notification deleted successfully." });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

router.put(
  "/:notificationId/mark-as-read",
  async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      const userId = req.query.userId as string;

      if (!userId) {
        return res
          .status(400)
          .send({ message: "User ID not provided in the query." });
      }

      const updatedNotification = await markNotificationAsRead(
        notificationId,
        userId
      );
      res.send(updatedNotification);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
);

router.get("/unread-count", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res
        .status(400)
        .send({ message: "User ID not provided in the query." });
    }

    const count = await countUnreadNotifications(userId);
    res.send({ count });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
