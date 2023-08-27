import { Request, Response } from "express"
import * as PollsServices from "../../services/polls-services"
import { IFeedback, IPolls } from "../../models/polls-models"
import { checkPermission } from "../../utils/permissions"

async function checkAndProceed(
  req: Request,
  res: Response,
  requiredPermissionKey: string,
  callback: () => Promise<Response<any, Record<string, any>>>
) {
  const userId = req.params.userId

  try {
    const hasPermission = await checkPermission(userId, requiredPermissionKey)
    if (!hasPermission) {
      return res.status(403).json({ error: "Access denied" })
    }

    const result = await callback()
    return result
  } catch (error) {
    console.error("Error:", error)
    return res.status(500).json({ error: "Operation failed" })
  }
}

export async function listPolls(req: Request, res: Response) {
  const requiredPermissionKey = "HEZNIZZQF84WV91W1L2VBSG1REUBBQ"
  await checkAndProceed(req, res, requiredPermissionKey, async () => {
    const { page, pageSize, filter } = req.query
    const parsedPage = parseInt(page as string, 10) || 1
    const parsedPageSize = parseInt(pageSize as string, 10) || 10
    const parsedFilter = (filter as string) || ""

    const { polls, totalCount } = await PollsServices.listPolls(
      parsedPage,
      parsedPageSize,
      parsedFilter
    )

    const totalPages = Math.ceil(totalCount / parsedPageSize)

    return res.status(200).json({
      polls,
      totalCount,
      currentPage: parsedPage,
      pageSize: parsedPageSize,
      totalPages: totalPages,
    })
  })
}

export async function createPoll(req: Request, res: Response) {
  const requiredPermissionKey = "9TLTS6BVTFVWCLX9CPYJKXAZ9HDUXA"
  await checkAndProceed(req, res, requiredPermissionKey, async () => {
    const newPoll: IPolls = req.body
    await PollsServices.createPoll(newPoll)
    return res.status(201).json({ message: "Enquete criada com sucesso!" })
  })
}

export async function addFeedback(req: Request, res: Response) {
  const pollId: string = req.params.pollId
  const feedback: IFeedback = req.body
  try {
    const updatedPoll = await PollsServices.addFeedbackToPoll(pollId, feedback)
    return res.status(200).json(updatedPoll)
  } catch (error) {
    console.error("Error adding feedback:", error)
    return res.status(500).json({ error: "Failed to add feedback" })
  }
}

export async function editPoll(req: Request, res: Response) {
  const requiredPermissionKey = "SJMPOMF6LJOGX3TMA1MTL836F0CE16"
  await checkAndProceed(req, res, requiredPermissionKey, async () => {
    const pollId: string = req.params.pollId
    const updatedData = req.body
    const updatedPoll = await PollsServices.editPoll(pollId, updatedData)
    return res.status(200).json(updatedPoll)
  })
}

export async function deletePoll(req: Request, res: Response) {
  const requiredPermissionKey = "SJMPOMF6LJOGX3TMA1MTL836F0CE16"
  await checkAndProceed(req, res, requiredPermissionKey, async () => {
    const pollId: string = req.params.pollId
    await PollsServices.deletePoll(pollId)
    return res.status(204).send()
  })
}

export async function getPollById(req: Request, res: Response) {
  const pollId: string = req.params.pollId
  try {
    const poll = await PollsServices.getPollById(pollId)
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" })
    }
    const isPrivate: boolean = req.query.isPrivate === "true"
    const isFeedbackPublic: boolean = poll.isFeedbackPublic
    if (!isPrivate && !isFeedbackPublic) {
      poll.feedbacks = []
    }
    return res.status(200).json(poll)
  } catch (error) {
    console.error("Error fetching poll by ID:", error)
    return res.status(500).json({ error: "Failed to fetch poll by ID" })
  }
}

export async function deleteFeedback(req: Request, res: Response) {
  const requiredPermissionKey = "RBPLDTXCF6HAT9AIZUPP48TWAN6NUP"
  await checkAndProceed(req, res, requiredPermissionKey, async () => {
    const pollId: string = req.params.pollId
    const feedbackId: string = req.params.feedbackId
    await PollsServices.deleteFeedbackFromPoll(pollId, feedbackId)
    return res.status(204).send({ message: "Feedback deletado com sucesso!" })
  })
}
