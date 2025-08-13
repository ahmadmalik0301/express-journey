import prisma from "../DB/DB.js";
import { createProductSchema, updateProductSchema } from "./productScheme.js";
export const getProducts = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const products = await prisma.product.findMany({
            where: { user_id: req.user.id },
            skip,
            take: limit,
        });
        res.status(200).json(products);
    }
    catch (err) {
        next(err);
    }
};
export const getProductById = async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ message: "Invalid product ID" });
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        if (product.user_id !== req.user?.id)
            return res.status(403).json({ message: "Access denied" });
        res.status(200).json(product);
    }
    catch (err) {
        next(err);
    }
};
export const createProduct = async (req, res, next) => {
    try {
        const { error, value, } = createProductSchema.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.message });
        const product = await prisma.product.create({
            data: {
                user_id: req.user.id,
                ...value,
            },
        });
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
};
export const replaceProduct = async (req, res, next) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
        return res.status(400).json({ message: "Invalid product ID" });
    const { error, value, } = createProductSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
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
    }
    catch (err) {
        next(err);
    }
};
export const updateProduct = async (req, res, next) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
        return res.status(400).json({ message: "Invalid product ID" });
    const { error, value, } = updateProductSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
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
    }
    catch (err) {
        next(err);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const productId = Number(req.params.id);
        if (Number.isNaN(productId))
            return res.status(400).json({ message: "Invalid product ID" });
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        if (product.user_id !== req.user?.id)
            return res
                .status(403)
                .json({ message: "Not authorized to delete this product" });
        await prisma.product.delete({ where: { id: productId } });
        res.json({ message: "Product deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
