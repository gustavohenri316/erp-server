interface IForgot extends Document {
  email: string
  code: string
}

interface INotification extends Document {
  receivedBy: mongoose.Types.ObjectId[] | string[]
  message: string
  subject?: string
  title: string
  sentBy: mongoose.Types.ObjectId
  timestamp: Date
  createdAt: Date
  isRead: boolean
  linkUrl?: string
  imageUrl?: string
  isGlobal: boolean
  excludedFor?: mongoose.Types.ObjectId[]
  readBy?: mongoose.Types.ObjectId[]
}

interface IPrivileges {
  name: string
  createdAt: Date
  createdByUser: string
  description: string
  key: string
  permissions: Schema.Types.ObjectId[]
}

interface IPrivilegesDocument extends IPrivileges, Document {}

interface IPermission extends Document {
  name: string
  createdAt: Date
  createdByUser: string
  description: string
  key: string
}
