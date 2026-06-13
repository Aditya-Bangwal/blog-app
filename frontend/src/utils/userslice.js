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
            localStorage.removeItem("user")
            return{
                token:null,
            }
        
        },
        updatedata(state,action)
        {
            const data=action.payload
             localStorage.setItem("user",JSON.stringify({...state , ...data}))
            return{...state , ...data}
             



        }

    }
})

export const {login,logout,updatedata}=userslice.actions
export default userslice.reducer