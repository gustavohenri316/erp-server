// products-controller.ts

import { Request, Response } from "express"
import * as ProductsServices from "../../services/products-services"
import Product, { IProduct } from "../../models/products-models"

export async function createProduct(req: Request, res: Response) {
  try {
    const newProductData: IProduct = req.body

    // Validação dos campos obrigatórios
    if (
      !newProductData.description ||
      !newProductData.code ||
      !newProductData.ean
    ) {
      return res
        .status(400)
        .json({ error: "Campos description, code e ean são obrigatórios." })
    }

    // Validação dos campos numéricos
    if (
      !isNumeric(newProductData.quantity) ||
      !isNumeric(newProductData.conversionFactor) ||
      !isNumeric(newProductData.infoPrice.wholesalePrice) ||
      !isNumeric(newProductData.infoPrice.retailPrice) ||
      !isNumeric(newProductData.infoPrice.posPrice) ||
      !isNumeric(newProductData.infoProduct.netWeight) ||
      !isNumeric(newProductData.infoProduct.grossWeight) ||
      !isNumeric(newProductData.infoProduct.shelfLife) ||
      !isNumeric(newProductData.infoProduct.height) ||
      !isNumeric(newProductData.infoProduct.width) ||
      !isNumeric(newProductData.infoProduct.depth) ||
      !isNumeric(newProductData.infoProduct.volume) ||
      !isNumeric(newProductData.infoProduct.length) ||
      !isNumeric(newProductData.infoLogistics.layersPerPallet) ||
      !isNumeric(newProductData.infoLogistics.rowsPerPallet) ||
      !isNumeric(newProductData.infoLogistics.packagingQuantityPerPallet)
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos numéricos devem ser números." })
    }

    const createdProduct = await Product.create(newProductData)
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error("Erro ao criar o produto:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

function isNumeric(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
}

export async function getProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const products = await ProductsServices.getProducts(page, pageSize)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const query: string = req.query.query as string
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const products = await ProductsServices.searchProducts(
      query,
      page,
      pageSize
    )
    res.status(200).json(products)
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
