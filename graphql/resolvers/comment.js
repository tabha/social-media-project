const Post = require('../../models/Post')
const checkAuth = require('../../util/checkAuth')
const {UserInputError, AuthenticationError} = require('apollo-server')
module.exports ={
    
    Mutation:{
        createComment: async (_,{postId,body},context) =>{
            const {username}  = checkAuth(context)
            if(body.trim()===''){
                throw new UserInputError("Empty comment",{
                    errors:{
                        body:'Comment body must not be emtpy'
                    }
                })
            }
            const post = await Post.findById(postId)

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            }else{
                throw new UserInputError("Post not found")
            }
            
        },
        deleteComment: async (_,{postId,commentId},context)=>{
            const {username} = checkAuth(context)
            const post = await Post.findById(postId)
            if(!post){
                throw new UserInputError("post not found",{
                    errors:{
                        body:'Post not found'
                    }
                })
            }
            const comment = post.comments.find(com => com.id)
            if(comment){
                // check if this comment is posted by the user
                if(comment.username===username){
                    // delte the comment
                    post.comments = post.comments.filter(com => com.id !==commentId)
                    console.log(post.comments)
                    await post.save()
                    return post
                }else{
                    throw new AuthenticationError("Action not allowed")
                }
            }else{
                throw new UserInputError("Comment not found")
            }
           
        }
    }
}