const express = require('express')
const multer = require('multer')
const User = require('../models/users')
const router = new express.Router()

const upload = multer({
  limits: {
      fileSize: 2000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
})

router.post('/users', upload.single('avatar'), async (req, res) => {

  data = {
    name: req.body.name,
    email: req.body.email,
    avatar: req.file.buffer
  }

  const user = new User(data);

    try {
        await user.save()

        res.status(201).send({ user})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/users/:id', upload.single('avatar'), async (req, res) => {

  const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))


    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }



  try {
    const user = await User.findOne({ _id: req.params.id });

    updates.forEach((update) => user[update] = req.body[update]);

        await user.save()
        res.status(201).send({ user})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router