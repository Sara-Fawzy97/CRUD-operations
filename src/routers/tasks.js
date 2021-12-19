const express = require('express')

const router = new express.Router()

const Task = require('../models/tasks')
const auth = require('../middelware/auth')


//to create
router.post('/tasks', auth, (req, res) => {
    const task = new Task({...req.body, owner: req.user._id })
        // const task = new Task(req.body)
    task.save().then(() => {
        res.status(200).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

//to read all
// router.get('/tasks', (req, res) => {
//     Task.find({}).then((data) => {
//         res.status(200).send(data)
//     }).catch((error) => {
//         res.status(500).send(error)
//     })
// })

router.get('/tasks', auth, async(req, res) => {
    try {
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (e) {
        res.send(e.message)
    }

})

//to read one doc

router.get('/tasks/:id', auth, async(req, res) => {
    console.log(req.params)
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('can not find the task')
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send('can not find the task')
    //     }
    //     res.status(200).send(task)
    // })

})

//update
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("can't update")
    }

    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send("No Task")
        }
        updates.forEach((update) => (task[update] = req.body[ubdate]))
        await user.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)

    }
})

//to delete
router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })


        if (!task) {
            return res.status(404).send('This task not found')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)

    }
})

module.exports = router