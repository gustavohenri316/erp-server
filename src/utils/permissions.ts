import User from "../models/user-models"
import Privileges from "../models/privileges-models"

export async function checkPermission(
  userId: string,
  requiredPermissionKey: string
): Promise<boolean> {
  try {
    const user = await User.findById(userId).populate("privileges")
    if (!user) {
      return false
    }

    for (const privilege of user.privileges) {
      const privilegeData = await Privileges.findById(privilege._id).populate(
        "permissions"
      )

      if (
        privilegeData &&
        privilegeData.permissions.some(
          (permission: any) => permission.key === requiredPermissionKey
        )
      ) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Error checking permission:", error)
    return false
  }
}
