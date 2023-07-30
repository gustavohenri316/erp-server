import { Router, Request, Response } from "express";
import { createForgot, getForgotUserId } from "../services/ForgotServices";

const router = Router();

router.post("/generate-code", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await createForgot({ email });
    res.status(201).send({ message: "Código enviado com sucesso!" });
  } catch (error: any) {
    const status = error.status || 500;
    const message = error.message || "Erro desconhecido";
    res.status(status).json({ error: message });
  }
});

router.post("/verify-code", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const userId = await getForgotUserId(email, code);
    if (!userId) {
      return res
        .status(404)
        .send({ message: "Código inválido para o email fornecido" });
    }
    res.status(200).send({ userId, message: "Email validado com sucesso!" });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

export default router;
