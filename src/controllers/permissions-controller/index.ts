import { Router, Request, Response } from "express"
import {
  createPermission,
  deletePermissionById,
  listPermissions,
} from "../../services/PermissionsServices"
import Permission from "../../models/PermissionsModel"
const router = Router()

export async function createPermissionController(req: Request, res: Response) {
  try {
    const permissionData: any = req.body
    const result = await createPermission(permissionData)
    if (!result.success) {
      res.status(400).send({ success: false, message: result.message })
    } else {
      res
        .status(201)
        .send({ success: true, message: result.message, data: result.data })
    }
  } catch (error: any) {
    console.error("Error creating a new permission:", error.message)
    res.status(500).send({
      success: false,
      message: "Error creating the permission. Please check the server.",
    })
  }
}
// Rota para excluir uma permissão por ID
export async function deletePermissionByIdController(
  req: Request,
  res: Response
) {
  try {
    const { permissionId } = req.params
    await deletePermissionById(permissionId)
    res.send({ message: "Permission deleted successfully!" })
  } catch (error: any) {
    res.status(400).send({ success: false, message: error.message })
  }
}

// Rota para listar todas as permissões
export async function listPermissionsController(req: Request, res: Response) {
  try {
    const permissions = await listPermissions()
    res.status(200).send(permissions)
  } catch (error: any) {
    res.status(400).send({ success: false, message: error.message })
  }
}

export async function searchPermissionsController(req: Request, res: Response) {
  try {
    const searchTerm: string = req.query.searchTerm as string
    const page: number = parseInt(req.query.page as string) || 1
    const perPage: number = parseInt(req.query.perPage as string) || 10
    if (!searchTerm) {
      const totalItems = await Permission.countDocuments()
      const totalPages = Math.ceil(totalItems / perPage)
      const permissions = await Permission.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
      res.status(200).send({
        page,
        perPage,
        totalPages,
        totalItems,
        permissions,
      })
    } else {
      const totalItems = await Permission.countDocuments({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { key: { $regex: searchTerm, $options: "i" } },
          { createdByUser: { $regex: searchTerm, $options: "i" } },
        ],
      })

      const totalPages = Math.ceil(totalItems / perPage)
      const permissions = await Permission.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { key: { $regex: searchTerm, $options: "i" } },
          { createdByUser: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .skip((page - 1) * perPage)
        .limit(perPage)
      res.status(200).send({
        page,
        perPage,
        totalPages,
        totalItems,
        permissions,
      })
    }
  } catch (error: any) {
    res.status(400).send({ success: false, message: error.message })
  }
}

// Rota para pesquisar uma permissão pelo nome
export async function searchPermissionByNameController(
  req: Request,
  res: Response
) {
  try {
    const searchTerm: string = req.query.name as string

    if (!searchTerm) {
      res.status(400).send({
        success: false,
        message: "O campo 'name' é obrigatório para pesquisar a permissão.",
      })
      return
    }

    const permissions = await Permission.find(
      { name: { $regex: searchTerm, $options: "i" } },
      { key: 1, _id: 0 }
    )
    if (permissions.length === 0) {
      res.status(404).send({
        success: false,
        message: "Nenhuma permissão encontrada com o nome especificado.",
      })
      return
    }

    res.status(200).send(permissions[0])
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: "Erro ao pesquisar a permissão. Verifique o servidor.",
    })
  }
}

export default router
