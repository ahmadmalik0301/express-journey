import { Request, Response, NextFunction } from "express";
import prisma from "../DB/DB.js";
import { AuthenticatedRequest } from "../types/UserPayload.js";
import { createProductSchema, updateProductSchema } from "./productScheme.js";

export const getProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: { user_id: req.user!.id },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res.status(403).json({ message: "Access denied" });

    res.json(product);
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
    const { error, value } = createProductSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const product = await prisma.product.create({
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
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid product ID" });

  const { error, value } = createProductSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });

    const updatedProduct = await prisma.product.update({
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
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return res.status(400).json({ message: "Invalid product ID" });

  const { error, value } = updateProductSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.user_id !== req.user?.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });

    const updatedProduct = await prisma.product.update({
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
    const productId = Number(req.params.id);
    if (Number.isNaN(productId))
      return res.status(400).json({ message: "Invalid product ID" });

    const product = await prisma.product.findUnique({
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
