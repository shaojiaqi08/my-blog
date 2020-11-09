// import fetch from "isomorphic-fetch";

import store from '../store/index'

let state = {}
store.subscribe(() => {
    state = store.getState()
})


// const baseUrl = "https://www.jk-blog.site";
const baseUrl = "http://127.0.0.1:7001";

function fetchHelper(urlPath, options) {
    return fetch(baseUrl + urlPath, options);
}

fetchHelper.get = function (urlPath, params = {}) {
    store.dispatch({
        type: 'CHANGE_LOADING',
        payload: true
    })
    let paramsKey = Object.keys(params)
    let str = ''
    // console.log(state)
    if (paramsKey.length > 0) {
        for (let i = 0; i < paramsKey.length; i++) {
            let v = paramsKey[i]
            if (!params[v]) {
                continue;
            }
            str += v + '=' + params[v] + '&'

            // if(i < paramsKey.length - 1) str +=
        }
        str = str.split('').splice(0, str.length - 1).join('')

        urlPath = urlPath + '?' + str
    }


    return fetch(baseUrl + urlPath, {
        method: "get",
        cache: "no-cache",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${state.userReducer.token || ''}`
        }
    })
        .then(res => {
            setTimeout(() => {
                store.dispatch({
                    type: 'CHANGE_LOADING',
                    payload: false
                })
            }, 500)

            return res.json();
        })

        .catch(err => {
            setTimeout(() => {
                store.dispatch({
                    type: 'CHANGE_LOADING',
                    payload: false
                })
            }, 500)
            throw Error("fetch请求异常");
        });
};

fetchHelper.post = function (urlPath, body) {
    store.dispatch({
        type: 'CHANGE_LOADING',
        payload: true
    })
    return fetch(baseUrl + urlPath, {
        method: "post",
        mode: "cors",
        cache: "no-cache", // 请求不被缓存
        credentials: "include", // 允许跨域携带cookie
        // body:两个格式，1. json格式  2. url参数格式
        // 约定：body参数是一个js对象，此方法中通过json.stringify方法转成json字符串
        body: JSON.stringify(body),
        headers: {
            // 告诉服务器当前请求报文体中的数据格式为json格式
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${state.userReducer.token || ''}`
        }
    })
        .then(res => {
            setTimeout(() => {
                store.dispatch({
                    type: 'CHANGE_LOADING',
                    payload: false
                })
            }, 500)
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("fetch状态异常");
            }
        })
        .catch(err => {
            setTimeout(() => {
                store.dispatch({
                    type: 'CHANGE_LOADING',
                    payload: false
                })
            }, 500)
            throw new Error("fetch请求失败");
        });
};

export default fetchHelper;
