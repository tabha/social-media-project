const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput,validateLoginInput} = require('../../util/validators')
const {SECRET_KEY} = require('../../config')

function generateToken(user){
    return  jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username,

    },SECRET_KEY,{expiresIn:'1h'})
}

module.exports={
    Mutation:{
        async register(_,
            {
                registerInput:{username,email,password,confirmPassword}
            },context,info){
            console.log("registering a user")
            const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword)
            if(!valid){
                throw new UserInputError("Errors",{errors})
            }
            // TODO Make sure user doesn't already exit
            const user = await User.findOne({username})
            if(user){
                throw new UserInputError("username is taken",{
                    errors:{
                        username:"this username is taken"
                    }
                })
            }
            // TODO hash passowrd and create an auth token
            password = await bcrypt.hash(password,12)
            const newUser = new User({
                email,
                username,
                password,
                createdAt:new Date().toISOString()
            })
            //console.log(newUser)
            const res = await newUser.save()
            console.log("doc:",res._doc)
            const token = generateToken(res)
            return {
                ...res._doc,
                id:res._id,
                token,
            }
        },
        async login(_,{username,password}){
            const {errors,valid} = validateLoginInput(username,password)
            if(!valid){
                throw new UserInputError("errors",{errors})
            }
            const user = await User.findOne({username})
            if(!user){
                errors.general = "User not found"
                throw new UserInputError("User not found",{errors})
            }
            const match = await bcrypt.compare(password,user.password)
            if(!match){
                errors.general="Wrong crendentials"
                throw new UserInputError("Wrong credentials",{errors})
            }
            const token = generateToken(user)
            return {
                ...user._doc,
                id:user._id,
                token
            }
        }
        
    }

}