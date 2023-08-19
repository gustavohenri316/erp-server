/* eslint-disable no-useless-catch */

import Polls, { IFeedback, IPolls, IPollsDocument } from "../models/PollsModels"

export async function createPoll(newPoll: IPolls) {
  try {
    const createdPoll = await Polls.create(newPoll)
    return createdPoll
  } catch (error) {
    throw error
  }
}

export async function addFeedbackToPoll(pollId: string, feedback: IFeedback) {
  try {
    const poll: IPollsDocument | null = await Polls.findById(pollId)
    if (!poll) {
      throw new Error("Poll not found")
    }

    poll.feedbacks.push(feedback)
    const updatedPoll = await poll.save()
    return updatedPoll
  } catch (error) {
    throw error
  }
}

export async function listPolls(
  page: number = 1,
  pageSize: number = 10,
  filter: string = ""
): Promise<{ polls: IPollsDocument[]; totalCount: number }> {
  try {
    const query: any = {}
    if (filter) {
      query.$or = [
        { title: { $regex: filter, $options: "i" } }, // Case-insensitive title search
        { createdByName: { $regex: filter, $options: "i" } }, // Case-insensitive creator search
      ]
    }

    const totalCount = await Polls.countDocuments(query)

    const polls = await Polls.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    return { polls, totalCount }
  } catch (error) {
    throw error
  }
}

export async function editPoll(
  pollId: string,
  updatedData: Partial<IPolls>
): Promise<IPollsDocument | null> {
  try {
    const updatedPoll = await Polls.findByIdAndUpdate(pollId, updatedData, {
      new: true,
    })
    return updatedPoll
  } catch (error) {
    throw error
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  try {
    await Polls.findByIdAndDelete(pollId)
  } catch (error) {
    throw error
  }
}

export async function getPollById(
  pollId: string
): Promise<IPollsDocument | null> {
  try {
    const poll = await Polls.findById(pollId)
    return poll
  } catch (error) {
    throw error
  }
}

export async function deleteFeedbackFromPoll(
  pollId: string,
  feedbackId: string
): Promise<void> {
  try {
    const poll = await Polls.findById(pollId)
    if (!poll) {
      throw new Error("Poll not found")
    }

    const feedbackIndex = poll.feedbacks.findIndex(
      (feedback) => feedback._id.toString() === feedbackId
    )

    if (feedbackIndex === -1) {
      throw new Error("Feedback not found")
    }

    poll.feedbacks.splice(feedbackIndex, 1)
    await poll.save()
  } catch (error) {
    throw error
  }
}
