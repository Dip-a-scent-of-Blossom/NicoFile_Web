import {local} from "@/assets/js/file.js";
import axios from "axios";

export const FetchArticle = async (id) => {
    let result = {
        success : true,
        message: '',
        article: {},
    }
    try{
        const res = await axios.get(local+"/api/v1/article/"+id)
        if (res.status === 200){
            if (res.data.error === false){
                result.article = res.data.article
            }else{
                result.success = false
                result.message = res.data.message
            }
        }else{
            result.success = false
            result.message = "网络错误"
        }
    }catch(e){
        result.success = false
        result.message = "网络错误"
    }
    return result
}