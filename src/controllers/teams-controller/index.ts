import { Request, Response } from "express"
import * as TeamsServices from "../../services/teams-services"
import { ITeamsDocument } from "../../models/teams-models"

export async function createTeam(req: Request, res: Response) {
  try {
    const { name, description, members } = req.body
    const teamData: Partial<ITeamsDocument> = {
      name,
      description,
      members,
      createdAt: new Date(),
    }
    await TeamsServices.createTeam(teamData)
    return res.status(201).json({ message: "Equipe criada com sucesso!" })
  } catch (error) {
    console.error("Error creating team:", error)
    return res.status(500).json({ error: "Failed to create team" })
  }
}

export async function listTeams(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const { total, teams } = await TeamsServices.listTeams(page, pageSize)
    return res.status(200).json({ total, pageSize, page, teams })
  } catch (error) {
    console.error("Error listing teams:", error)
    return res.status(500).json({ error: "Failed to list teams" })
  }
}
export async function getTeamById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const team = await TeamsServices.getTeamById(id)
    if (!team) {
      return res.status(404).json({ error: "Team not found" })
    }
    return res.status(200).json(team)
  } catch (error) {
    console.error("Error getting team by ID:", error)
    return res.status(500).json({ error: "Failed to get team by ID" })
  }
}

export async function updateTeam(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, description, members } = req.body
    const teamData: Partial<ITeamsDocument> = {
      name,
      description,
      members,
    }

    const updatedTeam = await TeamsServices.updateTeam(id, teamData)
    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" })
    }
    return res.status(200).json({ message: "Equipe atualizada com sucesso!" })
  } catch (error) {
    console.error("Error updating team:", error)
    return res.status(500).json({ error: "Failed to update team" })
  }
}

export async function deleteTeam(req: Request, res: Response) {
  try {
    const { id } = req.params
    await TeamsServices.deleteTeam(id)
    return res.status(204).send({ message: "Equipe deletada com sucesso!" })
  } catch (error) {
    console.error("Error deleting team:", error)
    return res.status(500).json({ error: "Failed to delete team" })
  }
}
