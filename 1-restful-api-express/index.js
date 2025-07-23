//Testing
const express = require(`express`);
const app = express();
function sendMessageJson(msg) {
    return { message: msg };
}

app.use(express.json());

app.use((req, res, next) => {
    const { title, price } = req.body;
    const method = req.method;
    console.log(`Method: ${method} | User requested: ${req.url}`);

    if (method === 'POST' || method === 'PUT') {
        if (title === undefined || price === undefined) {
            return res.status(400).json(sendMessageJson('Missing title or price'));
        } else if (typeof title !== 'string') {
            return res.status(400).json(sendMessageJson('Title must be a string'));
        } else if (typeof price !== 'number') {
            return res.status(400).json(sendMessageJson('Price must be a valid number'));
        }
    } else if (method === 'PATCH') {
        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json(sendMessageJson('Title must be a string'));
        } else if (price !== undefined && typeof price !== 'number') {
            return res.status(400).json(sendMessageJson('Price must be a valid number'));
        }
    }

    next();
});


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


app.get(`/`, (req, res) => {
    res.status(200).json(sendMessageJson("This is My Home page."));
});


app.get(`/products`, (req, res) => {
    res.status(200).json({ products });
});


app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.status(200).json({ product });
    } else {
        res.status(404).json(sendMessageJson("Product not found"));
    }
});

app.post('/products', (req, res) => {
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

app.put('/products/:id', (req, res) => {
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


app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json(sendMessageJson(`Product with ID ${productId} not found`));
    }

    products.splice(index, 1);

    res.status(200).json(sendMessageJson(`Product with ID ${productId} deleted successfully`));
});

app.patch('/products/:id', (req, res) => {
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

// 404 - Not Found (for any unmatched route)
app.use((req, res, next) => {
    res.status(404).json(sendMessageJson("404 - Page Not Found"));
});

// 500 - Internal Server Error (generic error handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(sendMessageJson("Internal Server Error"));
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
