import { Router, Request, Response } from "express";
import {
  createPermission,
  deletePermissionById,
  listPermissions,
} from "../services/PermissionsServices";
import Permission from "../models/PermissionsModel";
const router = Router();

// Rota para criar uma nova permissão
router.post("/", async (req: Request, res: Response) => {
  try {
    const permissionData: any = req.body;
    // Chama a função createPermission para criar a permissão
    const result = await createPermission(permissionData);
    // Verifica se a criação foi bem-sucedida e envia a resposta apropriada
    if (!result.success) {
      res.status(400).send({ success: false, message: result.message });
    } else {
      res
        .status(201)
        .send({ success: true, message: result.message, data: result.data });
    }
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    console.error("Erro ao criar uma nova regra:", error.message);
    res.status(500).send({
      success: false,
      message: "Erro ao criar a regra. Verifique o servidor.",
    });
  }
});
// Rota para excluir uma permissão por ID
router.delete("/:PermissionId", async (req: Request, res: Response) => {
  try {
    const { PermissionId } = req.params;
    // Chama a função deletePermissionById para excluir a permissão pelo ID
    await deletePermissionById(PermissionId);
    // Responde com uma mensagem indicando que a permissão foi excluída com sucesso
    res.send({ message: "Regra excluída com sucesso!" });
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 400 (Bad Request) e a mensagem de erro
    res.status(400).send({ success: false, message: error.message });
  }
});

// Rota para listar todas as permissões
router.get("/", async (req: Request, res: Response) => {
  try {
    // Chama a função listPermissions para obter todas as permissões
    const Permissions = await listPermissions();
    // Responde com as permissões obtidas
    res.status(200).send(Permissions);
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 400 (Bad Request) e a mensagem de erro
    res.status(400).send({ success: false, message: error.message });
  }
});

// Rota para pesquisar permissões com base em um termo de busca
router.get("/search", async (req: Request, res: Response) => {
  try {
    const searchTerm: string = req.query.searchTerm as string;
    const page: number = parseInt(req.query.page as string) || 1;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    if (!searchTerm) {
      // Se o termo de busca não for fornecido, lista todas as permissões paginadas
      const totalItems = await Permission.countDocuments();
      const totalPages = Math.ceil(totalItems / perPage);
      const permissions = await Permission.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
      res.status(200).send({
        page,
        perPage,
        totalPages,
        totalItems,
        permissions,
      });
    } else {
      // Se o termo de busca for fornecido, pesquisa as permissões que correspondem ao termo
      const totalItems = await Permission.countDocuments({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { key: { $regex: searchTerm, $options: "i" } },
          { createdByUser: { $regex: searchTerm, $options: "i" } },
        ],
      });

      const totalPages = Math.ceil(totalItems / perPage);
      const permissions = await Permission.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { key: { $regex: searchTerm, $options: "i" } },
          { createdByUser: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .skip((page - 1) * perPage)
        .limit(perPage);
      res.status(200).send({
        page,
        perPage,
        totalPages,
        totalItems,
        permissions,
      });
    }
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 400 (Bad Request) e a mensagem de erro
    res.status(400).send({ success: false, message: error.message });
  }
});
// Rota para pesquisar uma permissão pelo nome
router.get("/search-by-name", async (req: Request, res: Response) => {
  try {
    const searchTerm: string = req.query.name as string;
    // Verifica se o campo 'name' é fornecido na consulta
    if (!searchTerm) {
      res.status(400).send({
        success: false,
        message: "O campo 'name' é obrigatório para pesquisar a permissão.",
      });
      return;
    }
    // Pesquisa a permissão pelo nome com regex (case-insensitive) e retorna apenas a chave (key)
    const permissions = await Permission.find(
      { name: { $regex: searchTerm, $options: "i" } },
      { key: 1, _id: 0 }
    );
    if (permissions.length === 0) {
      // Se nenhuma permissão for encontrada, responde com status 404 (Not Found)
      res.status(404).send({
        success: false,
        message: "Nenhuma permissão encontrada com o nome especificado.",
      });
      return;
    }
    // Responde com a permissão encontrada (retorna apenas a chave)
    res.status(200).send(permissions[0]);
  } catch (error: any) {
    // Se ocorrer algum erro, envia a resposta com status 500 (Internal Server Error) e a mensagem de erro
    res.status(500).send({
      success: false,
      message: "Erro ao pesquisar a permissão. Verifique o servidor.",
    });
  }
});

export default router;
