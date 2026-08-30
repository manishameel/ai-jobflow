const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

//signup
async function signup(req, res){
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            {userId: newUser.id,role: newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            message: 'Signup successful',
            token: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

//login
async function login(req,res){
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await prisma.user.findUnique({
            where: {email: email}
        });

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

module.exports = {signup, login};