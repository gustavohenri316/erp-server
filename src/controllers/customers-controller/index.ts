import { Request, Response } from "express"
import * as CustomersService from "../../services/customers-services"

export const createCustomer = async (req: Request, res: Response) => {
  try {
    await CustomersService.createCustomer(req.body)
    res.status(201).json({ message: "Customer created successfully" })
  } catch (error) {
    res.status(500).json({ error: "Could not create customer." })
  }
}

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers =
      await CustomersService.getAllCustomersWithResponsibleNames()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ error: "Could not fetch customers." })
  }
}

export const getCustomerById = async (req: Request, res: Response) => {
  const customerId = req.params.id
  try {
    const customer = await CustomersService.getCustomerById(customerId)
    if (!customer) {
      res.status(404).json({ error: "Customer not found." })
    } else {
      res.json(customer)
    }
  } catch (error) {
    res.status(500).json({ error: "Could not fetch customer." })
  }
}

export const updateCustomer = async (req: Request, res: Response) => {
  const customerId = req.params.id
  try {
    const updatedCustomer = await CustomersService.updateCustomer(
      customerId,
      req.body
    )
    if (!updatedCustomer) {
      res.status(404).json({ error: "Customer not found." })
    } else {
      res.json(updatedCustomer)
    }
  } catch (error) {
    res.status(500).json({ error: "Could not update customer." })
  }
}

export const deleteCustomer = async (req: Request, res: Response) => {
  const customerId = req.params.id
  try {
    const deletedCustomer = await CustomersService.deleteCustomer(customerId)
    if (!deletedCustomer) {
      res.status(404).json({ error: "Customer not found." })
    } else {
      res.json(deletedCustomer)
    }
  } catch (error) {
    res.status(500).json({ error: "Could not delete customer." })
  }
}
