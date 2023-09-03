// products-services.ts

import Product, { IProduct } from "../../models/products-models"

export async function createProduct(productData: IProduct): Promise<IProduct> {
  console.log(productData)
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
  query: string,
  page: number,
  pageSize: number
): Promise<IProduct[]> {
  const searchRegex = new RegExp(query, "i")
  const products = await Product.find({
    $or: [
      { description: searchRegex },
      { code: searchRegex },
      { ean: searchRegex },
    ],
  })
    .populate("supplier", "corporateReason")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
  return products
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
  console.log("Solicitando produto com ID:", productId)
  const product = await Product.findById(productId)
  console.log("Produto recuperado:", product)
  return product
}
