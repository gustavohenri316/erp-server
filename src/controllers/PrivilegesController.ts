import { Router, Request, Response } from "express";
import {
  createPrivilege,
  listPrivileges,
  getPrivilegeById,
  updatePrivilege,
  deletePrivilege,
} from "../services/PrivilegesServices";

const router = Router();
// Rota para criar um novo privilégio
router.post("/", async (req: Request, res: Response) => {
  try {
    // Chama a função createPrivilege para criar o privilégio com base nos dados do corpo da requisição
    await createPrivilege(req.body);
    // Responde com status 201 (Created) e uma mensagem indicando que o privilégio foi criado com sucesso
    res.status(201).json({ message: "Privilégio criado com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

// Rota para listar todos os privilégios
router.get("/", async (req: Request, res: Response) => {
  try {
    // Chama a função listPrivileges para obter todos os privilégios
    const privileges = await listPrivileges();
    // Responde com status 200 (OK) e a lista de privilégios obtida
    res.status(200).json(privileges);
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar um privilégio pelo ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id;
    // Chama a função updatePrivilege para atualizar o privilégio pelo ID com base nos dados do corpo da requisição
    const updatedPrivilege = await updatePrivilege(id, req.body);
    // Responde com status 200 (OK) e o privilégio atualizado
    res.status(200).json(updatedPrivilege);
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

// Rota para excluir um privilégio pelo ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id;
    // Chama a função deletePrivilege para excluir o privilégio pelo ID
    await deletePrivilege(id);
    // Responde com status 204 (No Content) indicando que o privilégio foi excluído com sucesso
    res.status(204).json({ message: "Privilégio excluído com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter um privilégio pelo ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id;
    // Chama a função getPrivilegeById para obter o privilégio pelo ID
    const privilege = await getPrivilegeById(id);
    // Responde com status 200 (OK) e o privilégio obtido
    res.status(200).json(privilege);
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).json({ message: error.message });
  }
});

export default router;
