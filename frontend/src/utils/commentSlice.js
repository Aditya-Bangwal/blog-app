import { createSlice } from "@reduxjs/toolkit";

const commentSlice= createSlice({
    name:"commentSlice",
    initialState:{
        isOpen :false
    },
    reducers:{
        setisOpen(state,action){
            state.isOpen= action.payload==false ? false:!state.isOpen



        },
        
    }
})

export const{setisOpen}= commentSlice.actions
export default commentSlice.reducer