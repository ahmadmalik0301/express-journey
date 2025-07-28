const express = require("express");
const router = express.Router();
const prisma = require("../DB/db.js");
const {
  productSchema,
  productPatchSchema,
} = require("../validations/productSchema");

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};

router.get("/", async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

router.patch("/:id", isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { error, value } = productPatchSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const updatedProduct = await prisma.products.update({
      where: { id },
      data: value,
    });
    res.json({ message: "Product updated", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
});

router.post("/", isAdmin, async (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const product = await prisma.products.create({ data: value });
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.products.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
