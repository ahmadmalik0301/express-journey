const express = require('express');
const app = express();
const productsRouter = require('./Routes/productsRouter');

app.use(express.json());

app.use((req, res, next) => {
    const { title, price } = req.body;
    const method = req.method;
    console.log(`Method: ${method} | User requested: ${req.url}`);

    if (method === 'POST' || method === 'PUT') {
        if (title === undefined || price === undefined) {
            return res.status(400).json({ message: 'Missing title or price' });
        } else if (typeof title !== 'string') {
            return res.status(400).json({ message: 'Title must be a string' });
        } else if (typeof price !== 'number') {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }
    } else if (method === 'PATCH') {
        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json({ message: 'Title must be a string' });
        } else if (price !== undefined && typeof price !== 'number') {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }
    }

    next();
});

app.get('/', (req, res) => {
    res.status(200).json({ message: "This is My Home page." });
});

app.use('/products', productsRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "404 - Page Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
