import {local} from "@/assets/js/file.js";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const ChangeUserName = async (name) => {
    let result = {
        success : true,
        resultname : name,
        message: '',
    }
    try{
        const res = await axios.post(local+"api/v1/user/newname", {
            newName:name
        },{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        if (res.status === 200 ){
            if (res.data.error === false) {
            }else{
                console.log(res.data.message)
                result.message = res.data.message
            }
        }else{
            result.message = "网络错误"
            result.success = false
        }
    }catch(e){
        result.message = "网络错误"
        result.success = false
    }
    return result
}
export const ChangeUserPassword = async (password) => {
    let result = {
        success : true,
        message: '',
    }
    try{
        const res = await axios.post(local+"api/v1/user/newpassword", {
            newPassword:password
        },{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        if (res.status === 200){
            if (res.data.error === false){
            }else{
                result.success = false
                result.message = res.data.message
            }
        }else{
            result.success= false
            result.message = "网络错误"
        }
    }catch(e){
        result.success= false
        result.message = "网络错误"
    }
    return result
}

export const DeleteUser = async () => {
    let result = {
        success : true,
        message: '',
    }
    let jwtvalue = jwtDecode(localStorage.getItem('token'))
    try{
        const res = await axios.delete(local+"api/v1/user/delete?userid="+jwtvalue.id,{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        })
        if (res.status === 200){
            if (res.data.error === false){
            }else{
                result.success = false
                result.message = res.data.message
            }
        }else{
            result.success= false
            result.message = "网络错误"
        }
    }catch(e){
        result.success= false
        result.message = "网络错误"
    }
    return result
}
