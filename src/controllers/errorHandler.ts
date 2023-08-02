import { Response } from "express"

interface CustomError extends Error {
  status?: number
}
const errorHandler = (err: CustomError, res: Response) => {
  console.error("Erro:", err)
  const status = err.status || 500
  const message = err.message || "Erro desconhecido"
  res.status(status).json({ error: message })
}

export default errorHandler
