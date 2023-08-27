import CustomersModel, { ICustomers } from "../../models/customers-models"
import UserModel from "../../models/user-models"

export const createCustomer = async (customerData: ICustomers) => {
  const newCustomer = new CustomersModel(customerData)
  return await newCustomer.save()
}
export const getAllCustomers = async () => {
  return await CustomersModel.find()
}
export const getCustomerById = async (customerId: string) => {
  return await CustomersModel.findById(customerId)
}
export const updateCustomer = async (
  customerId: string,
  updateData: Partial<ICustomers>
) => {
  return await CustomersModel.findByIdAndUpdate(customerId, updateData, {
    new: true,
  })
}
export const deleteCustomer = async (customerId: string) => {
  return await CustomersModel.findByIdAndDelete(customerId)
}

export const getAllCustomersWithResponsibleNames = async () => {
  const customers = await CustomersModel.find().lean()
  const customersWithResponsibleNames = await Promise.all(
    customers.map(async (customer: any) => {
      const responsible: any | null = await UserModel.findById(
        customer.responsible
      ).lean()
      const responsibleName = responsible
        ? `${responsible.firstName} ${responsible.lastName}`
        : "N/A"
      return {
        ...customer,
        responsibleName,
      }
    })
  )
  return customersWithResponsibleNames
}
