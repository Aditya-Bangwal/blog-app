import {configureStore} from "@reduxjs/toolkit"
import userslice from "./userslice";
import selectedBlogSlice from "./selectedblogslice"
import commentSlice from "./commentSlice"
const store = configureStore({reducer : {
    user : userslice,
   selectedBlogSlice : selectedBlogSlice,
   comment:commentSlice
}})

export default store;