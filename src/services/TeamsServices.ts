import TeamsModel, { ITeamsDocument } from "../models/TeamsModels"

export async function createTeam(
  teamData: Partial<ITeamsDocument>
): Promise<ITeamsDocument> {
  try {
    const team = new TeamsModel(teamData)
    return await team.save()
  } catch (error) {
    throw new Error("Failed to create team")
  }
}
export async function listTeams(
  page: number,
  pageSize: number
): Promise<{
  total: number
  pageSize: number
  page: number
  teams: ITeamsDocument[]
}> {
  try {
    const total = await TeamsModel.countDocuments()
    const skipAmount = (page - 1) * pageSize
    const teams = await TeamsModel.find().skip(skipAmount).limit(pageSize)
    return { total, pageSize, page, teams }
  } catch (error) {
    throw new Error("Failed to list teams")
  }
}
export async function getTeamById(id: string): Promise<ITeamsDocument | null> {
  try {
    return await TeamsModel.findById(id)
  } catch (error) {
    throw new Error("Failed to get team by ID")
  }
}
export async function updateTeam(
  id: string,
  teamData: Partial<ITeamsDocument>
): Promise<ITeamsDocument | null> {
  try {
    return await TeamsModel.findByIdAndUpdate(id, teamData, { new: true })
  } catch (error) {
    throw new Error("Failed to update team")
  }
}
export async function deleteTeam(id: string): Promise<void> {
  try {
    await TeamsModel.findByIdAndDelete(id)
  } catch (error) {
    throw new Error("Failed to delete team")
  }
}
