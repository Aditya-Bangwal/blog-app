import { createSlice, current } from "@reduxjs/toolkit"

const storedBlog = localStorage.getItem("selectedblog")

const initialState =
    storedBlog && storedBlog !== "undefined"
        ? JSON.parse(storedBlog)
        : {}

const selectedBlogSlice = createSlice({
    name:"selectedBlogSlice",

    initialState,

    reducers:{

        addselectedblog(state,action){

            if(!action.payload) return state

            localStorage.setItem(
                "selectedblog",
                JSON.stringify(action.payload)
            )

            return action.payload
        },

        removeselectedblog(state,action){

            localStorage.removeItem("selectedblog")

            return {}
        },

        changeLikes(state,action){

            if(state.likes.includes(action.payload)){

                state.likes = state.likes.filter(
                    like => like != action.payload
                )

            } else {

                state.likes = [
                    ...state.likes,
                    action.payload
                ]
            }

            return state
        },

        setcomments(state,action){

            if(!state.comments){
                state.comments = []
            }

            state.comments = [
                ...state.comments,
                action.payload
            ]
        },

        setcommentlikes(state,action){

            let {commentid,userId} = action.payload

            // let comment = state.comments.find(
            //     (comment)=> comment._id == commentid
            // )

            // if (!comment) return state

            // if(comment.likes.includes(userId)){
            //     comment.likes = comment.likes.filter(
            //         like => like != userId)
            // } else {

            //     comment.likes = [
            //         ...comment.likes,
            //         userId
            //     ]
            // }

            // return state
            function togglelike(comments)
            {
                return comments.map((comment) => {
                  if (comment._id == commentid) {
                    if (comment.likes.includes(userId)) {
                       comment.likes = comment.likes.filter(
                        (like) => like != userId,
                      );
                      return comment
                    } else {
                      comment.likes = [...comment.likes, userId];
                      return comment
                    }
                  }
                  if(comment.replies && comment.replies.length>0 )
                  {
                    return {...comment,replies :togglelike(comment.replies)}

                  }
                  return comment;
                });
            }
            state.comments = togglelike(state.comments)
        },
        setreplies(state,action)
        {
            let newreply=action.payload
            function findparentcomment(comments)
            {
                let parentcomment;
                for(const comment of comments)
                {
                    if(comment._id ==newreply.parentcomment)
                    {
                        parentcomment={
                            ...comment,replies : [...comment.replies,newreply]
                        }
                        break
                    }

                    if(comment.replies.length>0)
                    {
                       parentcomment= findparentcomment(comment.replies)
                       if(parentcomment)
                       {
                        parentcomment={
                            ...comment,replies:comment.replies.map((reply)=>reply._id == parentcomment._id ?parentcomment:reply)
                        }
                        break;

                       }
                       
                    }
                }
                return parentcomment
            }

            let parentcomment=findparentcomment(state.comments)
            // console.log(parentcomment)
            state.comments=state.comments.map((comment)=>comment._id==parentcomment._id ? parentcomment:comment)

        },
        setUpdatedcomment(state,action)
        {
            function updatedcomment(comments)
            {
               return comments.map((comment)=>
                comment._id == action.payload._id ? {...comment,comment:action.payload.comment} : comment.replies 
               && comment.replies.length>0 ? {...comment,replies:updatedcomment(comment.replies)} : comment)
            }
            state.comments=updatedcomment(state.comments)

        },
        deletecommentandreply(state,action)
        {
            function deletecomment(comments)
            {
                return comments.filter((comment)=>comment._id != action.payload )
                .map((comment)=>comment.replies && comment.replies.length>0 ?{...comment,replies:deletecomment(comment.replies)}
                :comment)


            }
            state.comments=deletecomment(state.comments)

        }
    }
})

export const {
    addselectedblog,
    removeselectedblog,
    changeLikes,
    setcomments,
    setcommentlikes,
    setreplies,
    setUpdatedcomment,
    deletecommentandreply
} = selectedBlogSlice.actions

export default selectedBlogSlice.reducer