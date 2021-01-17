const {ApolloServer,PubSub} = require('apollo-server')
const mongoose = require('mongoose')

const Post = require('./models/Post')
const {MONGODB} = require('./config')

const pubSub = new PubSub()

const PORT = process.env.PORT || 5000

const typeDefs = require('./graphql/typeDefs.js')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>({req,pubSub})
})


mongoose
    .connect(MONGODB,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(res=>{
        console.log('MongoDB Connected')
        return server.listen({port:PORT})
    })
    .then(res =>{
        console.log(`Server running at ${res.url}`)
    }).catch(err=>{
        console.log(err)
    })