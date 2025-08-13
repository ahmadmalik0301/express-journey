import { Request, Response, NextFunction } from "express";
import prisma from "../DB/DB.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { createProductSchema, updateProductSchema } from "./productScheme.js";
import ProductInterface from "../types/ProductInterface.js";

export const getProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const products: ProductInterface[] = await prisma.product.findMany({
      where: { user_id: req.user!.id },
      skip,
      take: limit,
    });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const id: number = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

  try {
    const product: ProductInterface | null = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res.status(403).json({ message: "Access denied" });

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      error,
      value,
    }: {
      error: any;
      value: Omit<
        ProductInterface,
        "id" | "user_id" | "created_at" | "updated_at"
      >;
    } = createProductSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const product: ProductInterface = await prisma.product.create({
      data: {
        user_id: req.user!.id,
        ...value,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const replaceProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const id: number = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid product ID" });

  const {
    error,
    value,
  }: {
    error: any;
    value: Omit<
      ProductInterface,
      "id" | "user_id" | "created_at" | "updated_at"
    >;
  } = createProductSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const product: ProductInterface | null = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });

    const updatedProduct: ProductInterface = await prisma.product.update({
      where: { id },
      data: {
        ...value,
        updated_at: new Date(),
      },
    });
    res.status(200).json({ updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const id: number = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid product ID" });

  const {
    error,
    value,
  }: {
    error: any;
    value: Omit<
      ProductInterface,
      "id" | "user_id" | "created_at" | "updated_at"
    >;
  } = updateProductSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const product: ProductInterface | null = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });

    const updatedProduct: ProductInterface = await prisma.product.update({
      where: { id },
      data: {
        ...value,
        updated_at: new Date(),
      },
    });
    res.status(200).json({ updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId: number = Number(req.params.id);
    if (Number.isNaN(productId))
      return res.status(400).json({ message: "Invalid product ID" });

    const product: ProductInterface | null = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};
