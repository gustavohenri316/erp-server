import { Request, Response, NextFunction } from "express"

interface CustomError extends Error {
  status?: number
}
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Erro:", err)
  const status = err.status || 500
  const message = err.message || "Erro desconhecido"
  res.status(status).json({ error: message })
}

export default errorHandler
