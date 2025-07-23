const express = require('express');
const router = express.Router();
function sendMessageJson(msg) {
    return { message: msg };
}
let currentId = 5;
const products = [
    {
        id: 1,
        title: "Wireless Mouse",
        price: 29.99,

    },
    {
        id: 2,
        title: "Running Shoes",
        price: 89.99,

    },
    {
        id: 3,
        title: "Smart Watch",
        price: 129.99,

    },
    {
        id: 4,
        title: "Graphic T-Shirt",
        price: 15.99,
    }
];




router.get(`/`, (req, res) => {
    res.status(200).json({ products });
});


router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.status(200).json({ product });
    } else {
        res.status(404).json(sendMessageJson("Product not found"));
    }
});

router.post('/', (req, res) => {
    console.log(req.body);
    const { title, price } = req.body;

    const newProduct = {
        id: currentId++,
        title: title,
        price: price
    };

    products.push(newProduct);

    res.status(201).json({
        ...sendMessageJson("New Product Added"),
        product: newProduct
    });
});

router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, price } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json(sendMessageJson(`Product with ID ${productId} not found`));
    }

    products[productIndex] = {
        id: productId,
        title,
        price
    };

    res.status(200).json({
        ...sendMessageJson("Product Updated"),
        product: products[productIndex]
    });
});


router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json(sendMessageJson(`Product with ID ${productId} not found`));
    }

    products.splice(index, 1);

    res.status(200).json(sendMessageJson(`Product with ID ${productId} deleted successfully`));
});

router.patch('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { title, price } = req.body;

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json(sendMessageJson(`Product with ID ${productId} not found`));
    }

    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;

    res.status(200).json({
        ...sendMessageJson("Product Updated"),
        product
    });
});

module.exports = router;