import { Router, Request, Response } from "express"
import {
  createPrivilege,
  listPrivileges,
  getPrivilegeById,
  updatePrivilege,
  deletePrivilege,
} from "../services/PrivilegesServices"

const router = Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    await createPrivilege(req.body)
    res.status(201).json({ message: "Privilegio criado com sucesso!" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const privileges = await listPrivileges()
    res.status(200).json(privileges)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id
    const updatedPrivilege = await updatePrivilege(id, req.body)
    res.status(200).json(updatedPrivilege)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id
    await deletePrivilege(id)
    res.status(204).json({ message: "Privilegio excluído com sucesso!" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id: any = req.params.id
    const privilege = await getPrivilegeById(id)
    res.status(200).json(privilege)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router
