const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET = 'secret123';

app.use(express.json());

const user = {
    name: 'ahmad',
    pass: '1234'
}
function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Your Request Does not have Any Auth Token' });
    }
    else {
        try {
            const token = authHeader.split(" ")[1];
            const user = jwt.verify(token, SECRET);
            console.log(`Welcome ${user.name}`);
            next();
        } catch (error) {
            res.status(401).json({message:"Your Token is Invalid"});
            
        }
    }
}

app.get(`/`, (req, res) => {
    res.status(200).json({ message: 'This is Home page' });
})
app.get(`/login`, (req, res) => {
    res.status(200).json({ message: 'This is Login Page' });
})
app.post(`/login`, (req, res) => {
    const { name, pass } = req.body;
    console.log(req.body);

    if (user.name == name && user.pass == pass) {
        const token = jwt.sign({ name }, SECRET);
        res.status(201).json({ message: token });
    }
    else {
        res.status(401).json({ message: "Wrong password or username!" });
    }
})
app.get('/secret', verifyToken, (req, res) => {
    res.status(200).send({ message: "You are verified" });
})
app.use((error,req,res,next)=> {
    console.log(error.message);
    res.status(500).json({message :"Message Something Went Wrong"});
});
app.use((req,res,next)=> {
    res.status(404).json({message:'Page not Found'});
})

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
