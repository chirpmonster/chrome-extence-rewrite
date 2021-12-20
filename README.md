# chrome-extence-rewrite

背景：charles的rewrite并不好用，并且操作较重，也占用较大内存

本地调试：

1. npm run watch
2. 将build文件夹拖入拓展程序，会热更新

打包：npm run build

核心代码：

1. /background/reWrite.js 拦截请求并操作
2. contentScript.js 页面嵌入iframe，并且转发消息，因为iframe挂载需要时间，挂载过程中的消息可能会丢失
3. /iframe 操作界面，用于操作

Q:为什么要在页面嵌入iframe而不是用popup.html？

A:失去焦点popup.html会消失，我去查阅了官方issue发现这是官方强制的。而且oneNote官方插件也是通过iframe的方式展示，所以这应该是最佳解决方案

**最近比较忙，等忙完了整理一下**