import { Request, Response } from "express"
import * as PrivilegesServices from "../../services/PrivilegesServices"

// Function to create a new privilege
export async function createPrivilege(req: Request, res: Response) {
  try {
    await PrivilegesServices.createPrivilege(req.body)
    res.status(201).json({ message: "Privilégio criado com sucesso!" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Function to list all privileges
export async function listPrivileges(req: Request, res: Response) {
  try {
    const privileges = await PrivilegesServices.listPrivileges()
    res.status(200).json(privileges)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Function to update a privilege by ID
export async function updatePrivilege(req: Request, res: Response) {
  try {
    const id: any = req.params.id
    const updatedPrivilege = await PrivilegesServices.updatePrivilege(
      id,
      req.body
    )
    res.status(200).json(updatedPrivilege)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Function to delete a privilege by ID
export async function deletePrivilege(req: Request, res: Response) {
  try {
    const id: any = req.params.id
    await PrivilegesServices.deletePrivilege(id)
    res.status(204).json({ message: "Privilégio excluído com sucesso!" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Function to get a privilege by ID
export async function getPrivilegeById(req: Request, res: Response) {
  try {
    const id: any = req.params.id
    const privilege = await PrivilegesServices.getPrivilegeById(id)
    res.status(200).json(privilege)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
