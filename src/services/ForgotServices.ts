import Forgot, { IForgot } from "../models/ForgotModels"
import User from "../models/UserModels"
import nodemailer from "nodemailer"

const generateRandomCode = (): string => {
  const code = Math.floor(1000 + Math.random() * 9000).toString()
  return code
}

export const createForgot = async (forgotData: {
  email: string
}): Promise<IForgot> => {
  const existingForgot = await Forgot.findOne({ email: forgotData.email })
  if (existingForgot) {
    await Forgot.deleteOne({ email: forgotData.email })
  }
  const code = generateRandomCode()
  const user = await User.findOne({ email: forgotData.email })
  if (!user) {
    const errorObj = {
      status: 404,
      message: "Email não encontrado na tabela de usuários",
    }
    throw errorObj
  }
  const forgot = {
    email: forgotData.email,
    code: code,
  }
  const createdForgot = await Forgot.create(forgot)
  setTimeout(async () => {
    try {
      await Forgot.deleteOne({ _id: createdForgot._id })
      console.log("Registro de esquecimento excluído", createdForgot._id)
    } catch (error) {
      console.error("Erro ao excluir o registro de esquecimento:", error)
    }
  }, 130000)

  try {
    await sendCodeByEmail(forgotData.email, code)
  } catch (error) {
    const errorObj = {
      status: 500,
      message: "Erro ao enviar o e-mail",
    }
    throw errorObj
  }
  return createdForgot
}

const sendCodeByEmail = async (email: string, code: string) => {
  console.log("Tentando enviar o e-mail...")
  const transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: "ghtechnologies@outlook.com.br",
      pass: "Bara98ks@",
    },
  })
  const mailOptions = {
    from: "ghtechnologies@outlook.com.br",
    to: email,
    subject: "Código de Recuperação de Senha",
    text: `Seu código de recuperação de senha é: ${code}`,
  }
  return transporter.sendMail(mailOptions)
}

export const getForgotUserId = async (
  email: string,
  code: string,
): Promise<string | null> => {
  const foundForgot = await Forgot.findOne({ email, code })
  if (!foundForgot) {
    return null
  }
  const user = await User.findOne({ email })
  if (!user) {
    const errorObj = {
      status: 404,
      message: "Email não encontrado na tabela de usuários",
    }
    throw errorObj
  }
  return user._id
}
