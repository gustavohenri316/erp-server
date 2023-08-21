import User from "../models/UserModels"
import Privileges from "../models/PrivilegesModels"
import Permission from "../models/PermissionsModel"

export const findUserByEmailAndPassword = async (
  identifier: string,
  password: string
) => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
    password: password,
  })
  return user
}

export const updateUserPassword = async (id: string, newPassword: string) => {
  await User.findByIdAndUpdate(id, { password: newPassword })
}

export const listUsers = async (page: number = 1, pageSize: number = 10) => {
  const totalItems = await User.countDocuments()
  const users = await User.find()
    .populate("privileges")
    .skip((page - 1) * pageSize)
    .limit(pageSize)

  const usersWithoutPassword = users.map((user) => {
    const { photo, firstName, lastName, email, privileges, phoneNumber, _id } =
      user.toObject()
    return {
      photo,
      firstName,
      lastName,
      email,
      privileges,
      phoneNumber,
      _id,
    }
  })

  return {
    totalItems,
    currentPage: page,
    pageSize,
    users: usersWithoutPassword,
  }
}
export const createUser = async (user: any) => {
  if (user.privileges) {
    const privileges = await Privileges.find({ _id: { $in: user.privileges } })

    if (privileges.length !== user.privileges.length) {
      throw new Error("One or more provided privilege IDs do not exist.")
    }
  }
  const createdUser = await User.create(user)
  return createdUser
}
export const deleteUser = async (id: string) => {
  await User.findByIdAndDelete(id)
}
export const updateUser = async (id: string, newBody: any) => {
  if (newBody.privileges) {
    const privileges = await Privileges.find({
      _id: { $in: newBody.privileges },
    })

    if (privileges.length !== newBody.privileges.length) {
      throw new Error("One or more provided privilege IDs do not exist.")
    }
  }
  await User.findByIdAndUpdate(id, newBody)
}
export const findUserById = async (id: string) => {
  const user = await User.findById(id).populate("privileges")
  return user
}
export const findUserByName = async (name: string) => {
  const regex = new RegExp(`.*${name}.*`, "i")
  const user = await User.find({ name: regex })
  return user
}
export const getUserPrivilegeAndPermissions = async (userId: string) => {
  const user = await User.findById(userId).populate("privileges")
  if (!user) {
    return {
      success: false,
      message: "User not found.",
    }
  }
  const privilegeId = user.privileges[0]
  const privilege = await Privileges.findById(privilegeId).populate(
    "permissions"
  )
  if (!privilege) {
    return {
      success: false,
      message: "Privilege not found.",
    }
  }
  const userPrivilege = {
    id: privilege._id,
    name: privilege.name,
    key: privilege.key,
  }
  const permissionsAssociated = privilege.permissions.map(
    (permission: any) => ({
      id: permission._id,
      name: permission.name,
      key: permission.key,
    })
  )
  return {
    success: true,
    userPrivilege,
    permissionsAssociated,
  }
}
export const findPermissionKeyByName = async (permissionName: string) => {
  const permission = await Permission.findOne({ name: permissionName })
  if (!permission) {
    return {
      success: false,
      message: "Permission not found.",
    }
  }
  return {
    success: true,
    key: permission.key,
  }
}
export const getAllUsers = async () => {
  const users = await User.find()
  return users
}

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
  return user
}

export const findUsersBySearch = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const regex = new RegExp(`.*${search}.*`, "i")
  const totalItems = await User.countDocuments({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phoneNumber: regex },
    ],
  })

  const users = await User.find({
    $or: [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phoneNumber: regex },
    ],
  })
    .populate("privileges")
    .skip((page - 1) * pageSize)
    .limit(pageSize)

  const usersWithoutPassword = users.map((user) => {
    const { photo, firstName, lastName, email, privileges, phoneNumber, _id } =
      user.toObject()
    return {
      photo,
      firstName,
      lastName,
      email,
      privileges,
      phoneNumber,
      _id,
    }
  })

  return {
    totalItems,
    currentPage: page,
    pageSize,
    users: usersWithoutPassword,
  }
}
