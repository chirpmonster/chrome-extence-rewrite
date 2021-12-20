import {queryToObj, objToQuery} from './basic.js'

export default {
    init
}

const state = {
    reWriteList: []
}

function init() {
    //初始化数据
    initReWriteList()
    //添加事件监听器
    addMessageListener()
    //添加http请求监听器
    addRequestListener()
}

function initReWriteList(){
    chrome.storage.local.get(['reWriteList'], (result) => {
        state.reWriteList=result.reWriteList || []
    });
}

function addMessageListener() {
    //监听修改数据事件
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'reWrite') {
            console.log(request.data)
            chrome.storage.local.set({reWriteList: request.data});
            state.reWriteList = request.data
            sendResponse({data:'修改成功'})
        }
    });
    //监听点击插件事件，并发送至content
    chrome.browserAction.onClicked.addListener((tab)=>{
        chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
            chrome.tabs.sendMessage(tabs[0].id, {type:"toggle-iframe"});
        })
    });
}

function addRequestListener() {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            for (let i = 0; i < state.reWriteList?.length; i++) {
                if (state.reWriteList[i].open === false) {
                    continue
                }
                if (isSameUrl(details.url, state.reWriteList[i].url)) {
                    return reWriteParams(details, state.reWriteList[i])
                }
            }
        },
        {urls: ["<all_urls>"]},
        ["blocking", "extraHeaders", 'requestBody']
    );
}

//url可能带参数
function isSameUrl(url1, url2) {
    return url1?.split('?')[0]===url2?.split('?')[0]
}

function reWriteParams(details, list) {
    console.log(details)
    //解析params
    const params=queryToObj(details.url.split('?')[1])
    let newParams
    //获取全部参数并更新，如果修改的是全部参数，不需要获取更新
    if(list.type!=='all'||list.breakpoint===true){
        list.params=params
        chrome.storage.local.set({reWriteList: state.reWriteList})
        chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
            chrome.tabs.sendMessage(tabs[0].id, {
                type:"update",
                to:'content'
            });
        })
    }
    //根据拦截到的，打开标签页
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {
            type:"openCollapse",
            data:list.key,
            to:'content'
        });
    })
    if (list.breakpoint) {
        //自动切换至全部参数
        list.type='all'
        //延时打开标签
        setTimeout(()=>{
            chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
                chrome.tabs.sendMessage(tabs[0].id, {
                    type:"toggle-iframe",
                    data:true
                });
            })
        },1000)
        return {cancel: true}
    }
    //非get请求无法处理
    if(details.method!=='GET'){
        console.log('不支持修改非get请求')
        return
    }
    if(list.type==='part') {
        //对参数进行修改
        list.rule.forEach((item)=>{
            if(item.operation==='delete'){
                delete params[item.reWriteKey]
            }else if(item.operation==='add'){
                params[item.reWriteKey]=item.reWriteValue
            }
        })
        newParams=objToQuery(params)
        return {redirectUrl:details.url.split('?')[0]+'?'+newParams}
    }else if(list.type==='all') {
        //直接替换全部参数
        newParams=objToQuery(list.params)
        return {redirectUrl:details.url.split('?')[0]+'?'+newParams}
    }
    //已废弃，post相关
    // let a = details.requestBody?.raw[0].bytes
    // var enc = new TextDecoder("utf-8");
    // var uint8_msg = new Uint8Array(a);
    // console.log(enc.decode(uint8_msg))
}

