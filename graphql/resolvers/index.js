const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentResolvers = require('./comment')

module.exports = {
    Post:{
        // parent hold data commes from the previous step
        likeCount: (parent) =>  parent.likes.length,
        commentCount : (parent)=>parent.comments.length
    },
    Query:{
        ...postsResolvers.Query,
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription:{
        ...postsResolvers.Subscription
    }
}