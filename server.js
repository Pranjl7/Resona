const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const zod = require('zod')
const jwt = require('jsonwebtoken')
const user = require('./models/User')
let app = express()
const port = process.env.PORT || 3000


// Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`)
    })
}
main()

// Zod validation
let zodschema = zod.object({
    username: zod.string().min(2),
    email: zod.email(),
    password: zod.string().min(8).refine((v) => /[A-Z]/.test(v) && /[a-z]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v), {
        message: "Password must contain atleast one uppercase, lowercase and one special character."
    })
})

// Ejs-Routes
app.get("/", (req, res) => {
    res.render("signup-form")
})

app.get("/login", (req, res) => {
    res.render("login-form")
})

app.get("/signup", (req, res) => {
    res.render("signup-form")
})

app.get("/logout", (req, res) => {
    res.render("login-form")
})

// Authentication-Routes
app.post("/signup", async (req, res) => {
    try {
        let username = req.body.username
        let email = req.body.email
        let password = await bcrypt.hash(req.body.password, 10)
        let User = zodschema.safeParse(req.body)
        if (!User.success) {
            res.status(404).send(User.error)
        }
        else {
            await user.create({
                username,
                email,
                password
            })
            res.render("resona")
        }
    } catch (error) {
        console.log(error)
        if (error.code == 11000) {
            res.status(404).send("Email already exists.")
        }
        else {
            res.status(500).send("Internal server error.")
        }
    }
})

app.post("/login", async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password

        let User = zodschema.safeParse(req.body)
        if (!User.success) {
            res.status(404).send(User.error)
        }
        else {
            let User = await user.findOne({ email })
            if (!User) res.status(404).send("Sign up First.")
            let check = await bcrypt.compare(password, User.password)
            if (!check) {
                res.status(404).send("Invalid password.")
            }
            else {
                let token = jwt.sign({ email }, process.env.JWT_SECRET)
                res.render("resona")
                // res.status(200).json({
                //     msg: "User logged in successfully.",
                //     token
                // })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error.")
    }
})