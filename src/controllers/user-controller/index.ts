import { Request, Response } from "express"
import * as UserService from "../../services/UserServices"
import { defaultPhotoURL } from "../../assets/data"

export async function loginUser(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) {
      return res
        .status(400)
        .send({ message: "E-mail/username e senha são obrigatórios" })
    }
    const user = await UserService.findUserByEmailAndPassword(
      identifier,
      password
    )
    const privileges: any = await UserService.getUserPrivilegeAndPermissions(
      user._id
    )
    const permissions = privileges.permissionsAssociated.map(
      (permission: any) => permission.key
    )

    if (!user) {
      return res
        .status(404)
        .send({ message: "E-mail/username ou senha inválidos" })
    }

    res.send({
      token: user._id,
      message: `Olá ${user.firstName}`,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        photo: user.photo,
        privileges: permissions,
      },
    })
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const user = await UserService.findUserById(userId)

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" })
    }

    const name = `${user.firstName} ${user.lastName}`
    res.status(200).send({
      name,
      photo: user.photo,
      email: user.email,
      id: user._id,
    })
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function updateUserPasswordController(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).send({ message: "A nova senha não foi fornecida" })
    }

    await UserService.updateUserPassword(userId, password)
    res
      .status(200)
      .send({ message: "Senha do usuário atualizada com sucesso!" })
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function searchUsers(req: Request, res: Response) {
  try {
    const search = req.query.search as string
    const page: number = req.query.page ? parseInt(req.query.page as string) : 1
    const pageSize: number = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 10

    if (!search) {
      const userList: any = await UserService.listUsers(page, pageSize)
      return res.send(userList)
    }

    const searchResult = await UserService.findUsersBySearch(
      search,
      page,
      pageSize
    )

    if (!searchResult.users || searchResult.users.length === 0) {
      return res.status(404).send({ message: "Usuários não encontrados" })
    }

    res.send(searchResult)
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function createUserController(req: Request, res: Response) {
  try {
    const userData = req.body

    if (!userData.username) {
      return res.status(400).send({ message: "Nome de usuário é obrigatório." })
    }

    if (!userData.password) {
      return res.status(400).send({ message: "Senha é obrigatória." })
    }

    if (!userData.photo) {
      userData.photo = defaultPhotoURL
    }

    await UserService.createUser(userData)

    res.status(201).send({ message: "Usuário cadastrado com sucesso!" })
  } catch (error: any) {
    res.status(400).send({ message: error.message })
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    await UserService.deleteUser(req.params.userId)
    res.send({ message: "Usuario excluído com sucesso!" })
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const userId = req.params.userId
    const userData = req.body
    if ("password" in userData && userData.password === "") {
      delete userData.password
    }
    await UserService.updateUser(userId, userData)
    res.status(200).send({ message: "Usuário atualizado com sucesso!" })
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await UserService.findUserById(req.params.userId)

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" })
    }

    res.send(user)
  } catch (error: any) {
    res.status(400).send(error)
  }
}

export async function getUserPrivileges(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const result: any = await UserService.getUserPrivilegeAndPermissions(userId)

    const permissionsArray = result.permissionsAssociated.map(
      (permission: any) => ({
        key: permission.key,
      })
    )

    res.status(200).json(permissionsArray)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export async function getUserPermissionKey(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const { permissionName } = req.query
    const result: any = await UserService.getUserPrivilegeAndPermissions(userId)

    if (!result.success) {
      return res.status(404).json({ message: result.message })
    }

    const foundPermission = result.permissionsAssociated.find(
      (permission: any) => permission.name === permissionName
    )

    if (!foundPermission) {
      return res
        .status(200)
        .json({ message: "Permission not found for the user." })
    }

    const permissionKeyResult = await UserService.findPermissionKeyByName(
      permissionName as string
    )

    if (!permissionKeyResult.success) {
      return res.status(404).json({ message: permissionKeyResult.message })
    }

    res.status(200).json({ key: permissionKeyResult.key })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
