// products-services.ts

import Product, { IProduct } from "../../models/products-models"

export async function createProduct(productData: IProduct): Promise<IProduct> {
  const newProduct = new Product(productData)
  return newProduct.save()
}

export async function getProducts(
  page: number,
  pageSize: number
): Promise<IProduct[]> {
  const products = await Product.find()
    .populate("supplier", "corporateReason")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
  return products
}

export async function searchProducts(
  filter: any,
  page: number,
  pageSize: number
): Promise<IProduct[]> {
  const products = await Product.find(filter)
    .populate("supplier", "corporateReason")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
  return products
}

export async function getProductCount(filter: any = {}): Promise<number> {
  return Product.countDocuments(filter).exec()
}

export async function updateProduct(
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> {
  return Product.findByIdAndUpdate(productId, updateData, { new: true })
}

export async function deleteProduct(productId: string): Promise<void> {
  await Product.findByIdAndDelete(productId)
}

export async function getProductById(
  productId: string
): Promise<IProduct | null> {
  const product = await Product.findById(productId)
  return product
}
