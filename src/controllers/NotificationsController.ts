import { Router, Request, Response } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  countUnreadNotifications,
  getSentNotifications,
} from "../services/NotificationServices";
import { findUserById } from "../services/UserServices";
import { Types } from "mongoose";

const router = Router();

// Rota para criar e enviar notificações
router.post("/", async (req: Request, res: Response) => {
  try {
    const { receivedBy, message, title, sentBy, isGlobal } = req.body;
    // Verifica se os campos obrigatórios estão presentes no corpo da requisição
    if (!message || !title || !sentBy) {
      return res
        .status(400)
        .send({ message: "Todos os campos são obrigatórios." });
    }
    // Verifica se o campo receivedBy é um array de IDs de usuários
    if (!Array.isArray(receivedBy)) {
      return res
        .status(400)
        .send({ message: "receivedBy deve ser um array de IDs de usuários." });
    }
    // Verifica se os IDs de usuários recebidos na notificação são válidos
    await Promise.all(receivedBy.map(findUserById));
    // Cria e envia a notificação
    await createNotification(receivedBy, message, title, sentBy, isGlobal);
    // Responde com status 201 (Created) indicando que a notificação foi enviada com sucesso
    res.status(201).send({ message: "Notificação enviada com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 400 (Bad Request) e a mensagem de erro
    res.status(400).send({ message: error.message });
  }
});

// Rota para obter as notificações de um usuário
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Verifica se o usuário com o ID fornecido existe
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    // Obtém as notificações diretas e globais do usuário
    const { directNotifications, globalNotifications } = await getNotifications(
      userId
    );
    // Responde com as notificações obtidas
    res.send({ directNotifications, globalNotifications });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

// Rota para obter as notificações enviadas por um usuário
router.get("/sent/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Verifica se o usuário com o ID fornecido existe
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }
    // Obtém as notificações enviadas pelo usuário
    const sentNotifications = await getSentNotifications(userId);
    // Responde com as notificações obtidas
    res.send(sentNotifications);
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

// Rota para excluir uma notificação
router.delete("/:notificationId", async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.query.userId as string;
    // Verifica se o ID do usuário está presente na consulta
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." });
    }
    // Exclui a notificação
    await deleteNotification(notificationId, userId);
    // Responde com uma mensagem indicando que a notificação foi excluída com sucesso
    res.send({ message: "Notificação excluída com sucesso." });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

// Rota para marcar uma notificação como lida
router.put(
  "/:notificationId/mark-as-read",
  async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;
      const userId = req.query.userId as string;
      // Verifica se o ID do usuário está presente na consulta
      if (!userId) {
        return res
          .status(400)
          .send({ message: "ID do usuário não fornecido na consulta." });
      }
      // Converte o userId para ObjectId
      const objectIdUserId = new Types.ObjectId(userId);
      // Marca a notificação como lida
      const updatedNotification = await markNotificationAsRead(
        notificationId,
        objectIdUserId // Passando o userId convertido para a função
      );
      // Responde com a notificação atualizada
      res.send(updatedNotification);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }
);

// Rota para obter a contagem de notificações não lidas de um usuário
router.get("/unread-count/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Verifica se o ID do usuário está presente na consulta
    if (!userId) {
      return res
        .status(400)
        .send({ message: "ID do usuário não fornecido na consulta." });
    }
    // Verifica se o usuário com o ID fornecido existe
    const user = await findUserById(userId);
    if (!user) {
      return res.send({ count: 0 });
    }
    // Obtém a contagem de notificações não lidas
    const count = await countUnreadNotifications(userId);
    // Responde com a contagem obtida
    res.send({ count });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
});

export default router;
