import { Router, Request, Response } from "express";
import {
  createUser,
  listUsers,
  deleteUser,
  updateUser,
  findUserById,
  findUserByName,
  updateUserPassword,
  findUserByEmailAndPassword,
  getUserPrivilegeAndPermissions,
  findPermissionKeyByName,
} from "../services/UserServices";
import { defaultPhotoURL } from "../assets/data";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "E-mail e senha são obrigatórios" });
    }

    const user = await findUserByEmailAndPassword(email, password);
    const privileges: any = await getUserPrivilegeAndPermissions(user._id);

    const permissions = privileges.permissionsAssociated.map(
      (permission: any) => permission.key
    );

    if (!user) {
      return res.status(404).send({ message: "E-mail ou senha inválidos" });
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
    });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.get("/:userId/profile", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const name = `${user.firstName} ${user.lastName}`;
    res.status(200).send({
      name,
      photo: user.photo,
      email: user.corporateEmail,
      id: user._id,
    });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.patch("/:userId/password", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .send({ message: "A nova senha não foi fornecida" });
    }

    await updateUserPassword(userId, password);
    res
      .status(200)
      .send({ message: "Senha do usuário atualizada com sucesso!" });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const name: any = req.query.name;
    const id: any = req.query.id;
    const page: number = req.query.page
      ? parseInt(req.query.page as string)
      : 1;
    const pageSize: number = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 10;

    let user;

    if (name) {
      user = await findUserByName(name);
    } else if (id) {
      user = await findUserById(id);
    } else {
      const userList: any = await listUsers(page, pageSize);

      return res.send(userList);
    }

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    res.send({ user });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.body.photo) {
      req.body.photo = defaultPhotoURL;
    }

    await createUser(req.body);
    res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.delete("/:userId", async (req: Request, res: Response) => {
  try {
    await deleteUser(req.params.userId);
    res.send({ message: "Usuario excluído com sucesso!" });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    if ("password" in userData && userData.password === "") {
      delete userData.password;
    }
    await updateUser(userId, userData);
    res.status(200).send({ message: "Usuário atualizado com sucesso!" });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.params.userId);

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    res.send(user);
  } catch (error: any) {
    res.status(400).send(error);
  }
});

router.get("/:userId/privilege", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result: any = await getUserPrivilegeAndPermissions(userId);

    const permissionsArray = result.permissionsAssociated.map(
      (permission: any) => ({
        key: permission.key,
      })
    );

    res.status(200).json(permissionsArray);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/:userId/permission-key", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { permissionName } = req.query;
    const result: any = await getUserPrivilegeAndPermissions(userId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    const foundPermission = result.permissionsAssociated.find(
      (permission: any) => permission.name === permissionName
    );

    if (!foundPermission) {
      return res
        .status(200)
        .json({ message: "Permission not found for the user." });
    }

    const permissionKeyResult = await findPermissionKeyByName(
      permissionName as string
    );

    if (!permissionKeyResult.success) {
      return res.status(404).json({ message: permissionKeyResult.message });
    }

    res.status(200).json({ key: permissionKeyResult.key });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
