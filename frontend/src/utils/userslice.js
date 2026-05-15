import { createSlice } from "@reduxjs/toolkit";


const userslice =createSlice({
    name :"userslice",
    initialState:JSON.parse(localStorage.getItem("user")) || {token : null},
    reducers:{
        login(state,action){
            
            // state.name=action.payload.name
            // state.email=action.payload.email
            // state.token=action.payload.token
            localStorage.setItem("user",JSON.stringify(action.payload))
            return action.payload


        },
        logout(state,action){
        
        }

    }
})

export const {login,logout}=userslice.actions
export default userslice.reducer