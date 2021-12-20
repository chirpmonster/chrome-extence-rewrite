let iframe;
let iframeLoading = false;
// 只在最顶层页面嵌入iframe
if (window.self === window.top) {

    iframeLoading=true;

    //用于转发请求，因为iframe加载要时间
    chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.to === 'content') {
            contentToIframe(request)
        }
    });

    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            iframe = document.createElement('iframe');
            iframe.className = "api-interceptor";
            iframe.style.setProperty('height', '100%', 'important');
            iframe.style.setProperty('width', '500px', 'important');
            iframe.style.setProperty('min-width', '1px', 'important');
            iframe.style.setProperty('position', 'fixed', 'important');
            iframe.style.setProperty('top', '0', 'important');
            iframe.style.setProperty('right', '0', 'important');
            iframe.style.setProperty('left', 'auto', 'important');
            iframe.style.setProperty('bottom', 'auto', 'important');
            iframe.style.setProperty('z-index', '9999999999999', 'important');
            iframe.style.setProperty('opacity', '0.9', 'important');
            iframe.style.setProperty('transform', 'translateX(520px)', 'important');
            iframe.style.setProperty('transition', 'all .4s', 'important');
            iframe.style.setProperty('box-shadow', '0 0 15px 2px rgba(0,0,0,0.12)', 'important');
            iframe.frameBorder = "none";
            iframe.src = chrome.runtime.getURL("iframe.html")
            document.body.appendChild(iframe);
            let show = false;
            iframeLoading=false;
            //开启关闭
            chrome.runtime.onMessage.addListener((request, sender) => {
                if (request.type === 'toggle-iframe') {
                    show = request.data??!show;
                    iframe.style.setProperty('transform', show ? 'translateX(0)' : 'translateX(520px)', 'important');
                }
            });
        }
    }
}

function contentToIframe(request,time=1){
    if(time>10){
        return
    }
    if(iframeLoading){
        setTimeout(()=>{
            contentToIframe(request,time+1)
        },1000)
    }else{
        request.to='iframe'
        chrome.runtime.sendMessage(request);
    }
}