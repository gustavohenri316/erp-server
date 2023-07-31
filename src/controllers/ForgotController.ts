import { Router, Request, Response } from "express";
import { createForgot, getForgotUserId } from "../services/ForgotServices";

const router = Router();

// Rota para gerar e enviar o código de recuperação de senha
router.post("/generate-code", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Chama a função createForgot para criar e enviar o código de recuperação para o email fornecido
    await createForgot({ email });

    // Responde com status 201 (Created) indicando que o código foi gerado e enviado com sucesso
    res.status(201).send({ message: "Código enviado com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, trata e envia a resposta com o status e mensagem de erro apropriados
    const status = error.status || 500;
    const message = error.message || "Erro desconhecido";
    res.status(status).json({ error: message });
  }
});

// Rota para verificar o código de recuperação de senha
router.post("/verify-code", async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    // Chama a função getForgotUserId para verificar se o código é válido para o email fornecido
    const userId = await getForgotUserId(email, code);

    // Se o userId não for encontrado (código inválido), responde com status 404 (Not Found)
    if (!userId) {
      return res
        .status(404)
        .send({ message: "Código inválido para o email fornecido" });
    }

    // Se o userId for encontrado, responde com status 200 (OK) e o userId indicando que o email foi validado com sucesso
    res.status(200).send({ userId, message: "Email validado com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 400 (Bad Request) e a mensagem de erro
    res.status(400).send(error.message);
  }
});

export default router;
