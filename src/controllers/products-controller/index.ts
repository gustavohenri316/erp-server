import { Request, Response } from "express"
import * as ProductsServices from "../../services/products-services"
import Product, { IProduct } from "../../models/products-models"

export async function createProduct(req: Request, res: Response) {
  try {
    const newProductData: IProduct = req.body
    if (
      !newProductData.description ||
      !newProductData.code ||
      !newProductData.ean
    ) {
      return res
        .status(400)
        .json({ error: "Campos description, code e ean são obrigatórios." })
    }

    const createdProduct = await Product.create(newProductData)
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error("Erro ao criar o produto:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
export async function searchProducts(req: Request, res: Response) {
  try {
    const query: string = req.query.query as string
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const filter: any = {}

    if (query) {
      // Create a regular expression for case-insensitive search
      const searchRegex = new RegExp(query, "i")
      filter.$or = [
        { description: searchRegex },
        { code: searchRegex },
        { ean: searchRegex },
      ]
    }

    if (req.query.name) {
      filter.name = req.query.name
    }

    if (req.query.supplier) {
      filter.supplier = req.query.supplier
    }

    const result = await ProductsServices.searchProducts(filter, page, pageSize)
    const totalItems = await ProductsServices.getProductCount(filter)

    const response = {
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems,
      data: result,
    }

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const productId: string = req.params.id
    const updateData: Partial<IProduct> = req.body
    const updatedProduct = await ProductsServices.updateProduct(
      productId,
      updateData
    )
    if (updatedProduct) {
      res.status(200).json(updatedProduct)
    } else {
      res.status(404).json({ error: "Produto não encontrado" })
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId: string = req.params.id
    await ProductsServices.deleteProduct(productId)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const productId: string = req.params.id
    const product = await ProductsServices.getProductById(productId)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ error: "Produto não encontrado" })
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
