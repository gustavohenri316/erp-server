import Forgot, { IForgot } from "../models/ForgotModels";
import User from "../models/UserModels";
import nodemailer from "nodemailer";
// Função para gerar um código de recuperação de senha aleatório
const generateRandomCode = (): string => {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  return code;
};
// Função para criar um registro de recuperação de senha
export const createForgot = async (forgotData: {
  email: string;
}): Promise<IForgot> => {
  const existingForgot = await Forgot.findOne({ email: forgotData.email });
  // Se já houver um registro anterior de recuperação de senha para o mesmo e-mail, exclui-o
  if (existingForgot) {
    await Forgot.deleteOne({ email: forgotData.email });
  }
  // Gera um código aleatório para a recuperação de senha
  const code = generateRandomCode();
  // Verifica se o e-mail fornecido está registrado na tabela de usuários
  const user = await User.findOne({ email: forgotData.email });
  if (!user) {
    const errorObj = {
      status: 404,
      message: "Email não encontrado na tabela de usuários",
    };
    throw errorObj;
  }
  // Cria um novo registro de recuperação de senha
  const forgot = {
    email: forgotData.email,
    code: code,
  };
  const createdForgot = await Forgot.create(forgot);
  // Agendamento para excluir o registro de recuperação de senha após um período de tempo (neste caso, 130 segundos)
  setTimeout(async () => {
    try {
      await Forgot.deleteOne({ _id: createdForgot._id });
      console.log("Registro de esquecimento excluído", createdForgot._id);
    } catch (error) {
      console.error("Erro ao excluir o registro de esquecimento:", error);
    }
  }, 130000);
  // Envia o código de recuperação de senha para o e-mail do usuário
  try {
    await sendCodeByEmail(forgotData.email, code);
  } catch (error) {
    const errorObj = {
      status: 500,
      message: "Erro ao enviar o e-mail",
    };
    throw errorObj;
  }
  return createdForgot;
};
// Função para enviar o código de recuperação de senha por e-mail
const sendCodeByEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSE_EMAIL_ADDRESS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Código de Recuperação de Senha",
    text: `Seu código de recuperação de senha é: ${code}`,
  };
  return transporter.sendMail(mailOptions);
};
// Função para obter o ID do usuário associado ao e-mail e código de recuperação de senha
export const getForgotUserId = async (
  email: string,
  code: string
): Promise<string | null> => {
  const foundForgot = await Forgot.findOne({ email, code });
  if (!foundForgot) {
    return null;
  }
  // Verifica se o e-mail fornecido está registrado na tabela de usuários
  const user = await User.findOne({ email });
  if (!user) {
    const errorObj = {
      status: 404,
      message: "Email não encontrado na tabela de usuários",
    };
    throw errorObj;
  }
  // Retorna o ID do usuário associado ao e-mail e código de recuperação de senha
  return user._id;
};
