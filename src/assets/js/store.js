import { defineStore } from 'pinia'


export const userStore =  defineStore('main',{
    state:()=>{
        return {
            info:"",
            username:"",
            userToken:"",
            logined:false,
            id : 0,
        }
    },
    getters: {
        getUserName(state) {
            return state.username
        },
        getUserToken(state) {
            return userToken
        },
        getLogined(state) {
            return state.logined
        },
        getInfo(state) {
            return state.info
        },
        getId(state) {
            return state.id
        },
    },
    actions:{
        setNew(token,nickName,info,id){
            this.userToken = token
            this.username = nickName
            this.info = info
            this.logined = true
            this.id = id

        }
    }
})