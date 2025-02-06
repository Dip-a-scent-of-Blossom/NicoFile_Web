import axios from "axios";
import {ref} from "vue";
export const uploading = ref(0)
export const auth = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjEsImV4cCI6MTczODc1MDkyOSwiaWF0IjoxNzM4MTQ3MzI5fQ.nPhzH5kNBMaEAelUf9kDa_kftdHJ2ZA1r4uDRa-ZLag"
export const useable = ref(false)
const server = "http://152.32.133.174:7235/"
const local1 = "http://127.0.0.1:8888/"
export const local = local1
export async function download(prefix,auth,path,fileName){
    const pathParts = path.split('/');
    const filteredParts = pathParts.filter(part => part !== '');
    console.log("filteredParts",filteredParts[0])
    const url = local+"api/v1/file/download?url="+filteredParts[0]
    await axios.get(url, {
        headers: {
            'Authorization': auth,
            'range': 'bytes=0-'
        },
        responseType : 'arraybuffer'
    })
        .then(response => {
            if (!response.status>=400 && !response.status<500) {
                // throw new Error('Unauthorized or file not found');
            }
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(new Blob([response.data]));
            link.href = objectUrl;
            link.setAttribute('download', fileName); // 强制指定文件名
            document.body.appendChild(link);
            link.click();
            console.log(link)
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl); // 释放 URL 对象
        })
        .catch(error => console.error('There was a problem with the download:', error));
}

export const deletefile = async (prefix,fileid,auth) => {
    const res = await axios.delete(prefix + "api/v1/file/delete?fileid="+fileid,{
            headers: {
                "Authorization": auth,
            }
        }
    )
    console.log(res.data.message)
    return res
}

export async function checkchunk(prefix,chunkTotal, fileName,md5arr,fileMd5,Ext,auth) {
    const resp = await axios.post(prefix+"api/v1/file/checkchunk", {
        chunkNum: chunkTotal,
        filename: fileName,
        md5 : md5arr,
        fileMd5 : fileMd5,
        ext : Ext
    },{
        headers: {
            "Authorization": auth,
        }
    })
    return resp.data
}
export const uploadFileToServer = async (prefix,auth,file, chunkNumber, fileName,_md5) => {
    let form = new FormData();
    form.append("chunk", file);
    form.append("chunkIndex", chunkNumber);
    form.append("md5", _md5);
    form.append("filename", fileName);
    console.log(_md5,chunkNumber)
    var result
    await axios.post(prefix+"api/v1/file/uploadchunk", form,{
        headers: {
            "Authorization": auth,
            'Connection': 'keep-alive',
        },
    }).then(res => {
        result = res
        console.log(res)
        return res
    }).catch(err => {
        console.log(err)
        return err
    })
    return result
}

export const mergeFiles = async (prefix,auth,fileMd5,chunkTotal, fileName,ext,size) => {
    console.log("merge chunks: ",chunkTotal)
    const result =await axios.post(prefix+"api/v1/file/mergechunk", {
        chunkNum: chunkTotal,
        filename: fileName,
        md5 :fileMd5,
        ext: ext,
        size: size,
        description :''
    },{
        headers: {
            "Authorization": auth,
        }
    })
    return result
}

export const calc = (filesize)=> {
    if (filesize < 1024) {
        return filesize + ' B';
    } else if (filesize < 1024 * 1024) {
        return (filesize / 1024).toFixed(2) + ' KB';
    } else if (filesize < 1024 * 1024 * 1024) {
        return (filesize / 1024 / 1024).toFixed(2) + ' MB';
    }else  {
        return (filesize / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    }
}
export const fmtDownloadTimes = (times) => {
    if (times < 1000) {
        return times + ' 次下载';
    } else if (times < 10000) {
        return (times / 1000).toFixed(2) + ' 千次下载';
    } else if (times < 1000000) {
        return (times / 10000).toFixed(2) + ' 万次下载';
    }else  {
        return (times / 1000000).toFixed(2) + ' 百万次下载';
    }
}