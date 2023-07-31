import Permission from "../models/PermissionsModel";

// Função para criar uma nova permissão
export const createPermission = async (PermissionData: any) => {
  const existingPermissionWithName = await Permission.findOne({
    name: PermissionData.name,
  });
  if (existingPermissionWithName) {
    return { success: false, message: "Já existe uma regra com o mesmo nome." };
  }
  const existingPermissionWithKey = await Permission.findOne({
    key: PermissionData.key,
  });
  if (existingPermissionWithKey) {
    return {
      success: false,
      message: "Já existe uma regra com a mesma chave.",
    };
  }
  try {
    const createdPermission = await Permission.create(PermissionData);
    return {
      success: true,
      message: "Regra criada com sucesso!",
      data: createdPermission,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao criar a regra. Verifique os dados enviados.",
    };
  }
};
// Função para excluir uma permissão por ID
export const deletePermissionById = async (PermissionId: string) => {
  try {
    await Permission.findByIdAndDelete(PermissionId);
  } catch (error) {
    throw new Error("Erro ao excluir a regra. Verifique o ID da regra.");
  }
};
// Função para listar todas as permissões
export const listPermissions = async () => {
  try {
    const Permissions = await Permission.find();
    return Permissions;
  } catch (error) {
    throw new Error("Erro ao listar as regras.");
  }
};
// Função para buscar permissões com base em um termo de pesquisa
export const searchPermissions = async (searchInput: string) => {
  try {
    const query = {
      $or: [
        { name: { $regex: searchInput, $options: "i" } },
        { description: { $regex: searchInput, $options: "i" } },
        { key: { $regex: searchInput, $options: "i" } },
        { createdByUser: { $regex: searchInput, $options: "i" } },
      ],
    };
    const permissions = await Permission.find(query);
    return permissions;
  } catch (error) {
    throw new Error("Erro ao buscar as permissões.");
  }
};
