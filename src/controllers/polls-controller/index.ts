import { Request, Response } from "express"
import * as PollsServices from "../../services/PollsServices"
import { IFeedback, IPolls } from "../../models/PollsModels"

export async function createPoll(req: Request, res: Response) {
  try {
    const newPoll: IPolls = req.body
    await PollsServices.createPoll(newPoll)
    return res.status(201).json({ message: "Enquete criada com sucesso!" })
  } catch (error) {
    console.error("Error creating poll:", error)
    return res.status(500).json({ error: "Failed to create poll" })
  }
}

export async function addFeedback(req: Request, res: Response) {
  try {
    const pollId: string = req.params.pollId
    const feedback: IFeedback = req.body
    const updatedPoll = await PollsServices.addFeedbackToPoll(pollId, feedback)
    return res.status(200).json(updatedPoll)
  } catch (error) {
    console.error("Error adding feedback:", error)
    return res.status(500).json({ error: "Failed to add feedback" })
  }
}

export async function listPolls(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error("Error listing polls:", error)
    return res.status(500).json({ error: "Failed to list polls" })
  }
}

export async function editPoll(req: Request, res: Response) {
  try {
    const pollId: string = req.params.pollId
    const updatedData = req.body
    const updatedPoll = await PollsServices.editPoll(pollId, updatedData)
    return res.status(200).json(updatedPoll)
  } catch (error) {
    console.error("Error editing poll:", error)
    return res.status(500).json({ error: "Failed to edit poll" })
  }
}

export async function deletePoll(req: Request, res: Response) {
  try {
    const pollId: string = req.params.pollId
    await PollsServices.deletePoll(pollId)
    return res.status(204).send()
  } catch (error) {
    console.error("Error deleting poll:", error)
    return res.status(500).json({ error: "Failed to delete poll" })
  }
}

export async function getPollById(req: Request, res: Response) {
  try {
    const pollId: string = req.params.pollId
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
  try {
    const pollId: string = req.params.pollId
    const feedbackId: string = req.params.feedbackId
    await PollsServices.deleteFeedbackFromPoll(pollId, feedbackId)
    return res.status(204).send({ message: "Feedback deletado com sucesso!" })
  } catch (error) {
    console.error("Error deleting feedback:", error)
    return res.status(500).json({ error: "Failed to delete feedback" })
  }
}
