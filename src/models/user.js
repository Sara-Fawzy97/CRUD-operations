const monogose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
    // const uploads = require('multer')

const jwt = require('jsonwebtoken')

const userSchema = monogose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error('Email is invalid')
            }
        }

    },

    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new error('Number must be positive')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    tokens: [{
        type: String,
        require: true
    }],
    avatar: {
        type: Buffer
    }
})

//virtual relation

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('no user is found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('is not match')
    }
    return user

}


userSchema.methods.genetrateToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat(token);
    await user.save();
    return token
}
userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.pre('save', async function(next) {
    const user = this
        // const hashedPassword = user.password
    if (user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})


const User = monogose.model('User', userSchema)


module.exports = User