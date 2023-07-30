import { Router, Request, Response } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  countUnreadNotifications,
} from "../services/NotificationServices";
import { findUserById } from "../services/UserServices";
import { Types } from "mongoose";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { receivedBy, message, title, sentBy, isGlobal } = req.body;
    if (!message || !title || !sentBy) {
      return res
        .status(400)
        .send({ message: "Todos os campos são obrigatórios." });
    }
    if (!Array.isArray(receivedBy)) {
      return res
        .status(400)
        .send({ message: "receivedBy deve ser um array de IDs de usuários." });
    }
    await Promise.all(receivedBy.map(findUserById));
    const notification = await createNotification(
      receivedBy,
      message,
      title,
      sentBy,
      isGlobal
    );
    res.status(201).send({ message: "Notificação envida com sucesso!" });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    const { directNotifications, globalNotifications } = await getNotifications(
      userId
    );
    res.send({ directNotifications, globalNotifications });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:notificationId", async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.query.userId as string;
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." });
    }
    await deleteNotification(notificationId, userId);
    res.send({ message: "Notificação excluída com sucesso." });
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
          .send({ message: "ID do usuário não fornecido na consulta." });
      }

      // Convertendo userId para ObjectId
      const objectIdUserId = new Types.ObjectId(userId);

      const updatedNotification = await markNotificationAsRead(
        notificationId,
        objectIdUserId // Passando o userId convertido para a função
      );
      res.send(updatedNotification);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
);

router.get("/unread-count/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.send({ count: 0 });
    }

    const count = await countUnreadNotifications(userId);
    res.send({ count });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
