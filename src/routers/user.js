const express = require('express')
const validator = require('validator')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const multer = require('multer')

const auth = require("../middelware/auth")

//to create
// router.post('/users', (req, res) => {
//     const user = new User(req.body)
//     user.save().then(() => {
//         res.status(200).send(user)
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// })

//to sign up with tokens
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.genetrateToken()

        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})


//to login with tokens
router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genetrateToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//to read all
router.get('/users', auth, (req, res) => {
    User.find({}).then((data) => {
        res.status(200).send(data)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

//to read one doc
router.get('/users/:id', auth, (req, res) => {
    console.log(req.params)
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('can not find the task')
        }
        res.status(200).send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

router.get('/profile', auth, (req, res) => {
    // console.log(req.params)
    // const _id = req.params.id
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send('can not find the task')
    //     }
    //     res.status(200).send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
    res.send(req.user)
})

//to update
router.patch('/users/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']
    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("can't update")
    }

    try {
        const _id = req.params.id
        const user = await User.findById(_id)
            // const user = await User.findByIdAndUpdate(_id, req.body, {
            //     new: true,
            //     runValidators: true
            // })
        if (!user) {
            return res.status(404).send("This user not found")
        }
        updates.forEach((el) => (user[el] = req.body[el]))
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)

    }
})

//to delete
router.delete('/users/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)

        if (!user) {
            return res.status(404).send('This user not found')
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)

    }
})

//to logout with one tokens
router.delete('/logout', auth, async(req, res) => {

    console.log(req.user)
    try {
        req.user.tokens = req.user.tokens.filter((el) => {
            return el !== req.token
        })
        await req.user.save()
        res.status(200).send('logout')
    } catch (error) {
        res.status(500).send("error")
    }
})

//to logout all devices all tokens
// router.delete('/logout', auth, async(req, res) => {

//     console.log(req.user)
//     try {
//         req.user.tokens = req.user.tokens.filter((el) => {
//             return el !== req.token
//         })
//         await req.user.save()
//         res.status(200).send('logout')
//     } catch (error) {
//         res.status(500).send("error")
//     }
// })
const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {

            cb(new Error("please upload image"))
        }
        cb(null, true)
    }
})
router.post('/profile/avatar', auth, uploads.single('avatar'), async(req, res) => {
    try {
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.status(200).send()

    } catch (e) { res.status(400).send(e.message) }
})

module.exports = router