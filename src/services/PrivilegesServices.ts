import Privileges, {
  IPrivileges,
  IPrivilegesDocument,
} from "../models/PrivilegesModels"
import Permission from "../models/PermissionsModel"
import { Schema } from "mongoose"

export const createPrivilege = async (
  privilegeData: IPrivileges,
): Promise<IPrivilegesDocument> => {
  const { permissions } = privilegeData

  const existingPermissions = await Permission.find({
    _id: { $in: permissions },
  })
  if (existingPermissions.length !== permissions.length) {
    throw new Error("One or more provided permission IDs do not exist.")
  }

  const newPrivilege = await Privileges.create(privilegeData)
  return newPrivilege
}

export const listPrivileges = async (): Promise<IPrivilegesDocument[]> => {
  const privileges = await Privileges.find().populate("permissions")
  return privileges
}

export const updatePrivilege = async (
  id: Schema.Types.ObjectId,
  privilegeData: IPrivileges,
): Promise<IPrivilegesDocument | null> => {
  const updatedPrivilege = await Privileges.findByIdAndUpdate(
    id,
    privilegeData,
    { new: true },
  )
  return updatedPrivilege
}

export const deletePrivilege = async (
  id: Schema.Types.ObjectId,
): Promise<void> => {
  await Privileges.findByIdAndDelete(id)
}

export const getPrivilegeById = async (
  id: Schema.Types.ObjectId,
): Promise<IPrivilegesDocument | null> => {
  const privilege = await Privileges.findById(id).populate("permissions")
  if (!privilege) {
    throw new Error("Privilege not found.")
  }
  return privilege
}
