import React from 'react'
import {Collapse} from 'antd'
const {Panel} = Collapse
import {PlusCircleTwoTone} from "@ant-design/icons"

import Edit from './components/Edit'
import './index.less'



export default class Rewrite extends React.Component {

    state = {
        reWriteList: [],
        activeKey:[],
        tip:[], //用于显示修改成功
    }

    componentDidMount() {
        //初始化参数
        this.updateReWriteList()
        this.addMessageListener()
    }

    updateReWriteList = () => {
        //延时更新
        setTimeout(() => {
            this.setState({reWriteList: []})
            chrome.storage.local.get(['reWriteList'], (result) => {
                this.setState({reWriteList: result.reWriteList || []})
            });
        })
    }

    addMessageListener=()=>{
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if(request.to==='iframe'){
                if (request.type === 'openCollapse') {
                    let {activeKey}=this.state;
                    activeKey.push(request.data.toString())
                    this.setState({activeKey})
                    this.updateReWriteList()
                }else if(request.type === 'update'){
                    this.updateReWriteList()
                }
            }
        })
    }

    //提供给子组件更新数据
    updateParams = (newData) => {
        let {reWriteList} = this.state
        for (let i = 0; i < reWriteList.length; i++) {
            if (reWriteList[i].key === newData.key) {
                reWriteList[i] = newData
                this.updateToBackground(i)
                // this.updateReWriteList()
                return
            }
        }
        alert('未匹配到key')
    }

    deleteParams = (deleteData) => {
        let {reWriteList} = this.state
        for (let i = 0; i < reWriteList.length; i++) {
            if (reWriteList[i].key === deleteData.key) {
                reWriteList.splice(i, 1)
                this.updateToBackground()
                this.updateReWriteList()
                return
            }
        }
        alert('未匹配到key')
    }

    //更新至background
    updateToBackground = (index) => {
        chrome.runtime.sendMessage({
            type: "reWrite",
            data: this.state.reWriteList
        },(res)=>{
            if(index){
                let {tip}=this.state
                tip[index]=res?.data
            }
        });
    }

    //开启关闭状态
    isOpen = (item) => {
        return (<div onClick={(event) => {
            this.toggleOpen(event, item)
        }}>
            {
                item.open ? <div style={{color: '#1890ff'}}>已启用</div> : <div style={{color: 'darkgrey'}}>已关闭</div>
            }
        </div>)
    }

    toggleOpen = (event, item) => {
        event.stopPropagation()
        item.open = !item.open
        this.setState({})
        this.updateToBackground()
    }

    render() {
        let {reWriteList,tip} = this.state
        return (
            <div className='rewrite'>
                <Collapse destroyInactivePanel={true}
                          activeKey={this.state.activeKey}
                          onChange={(value)=>{
                              this.setState({activeKey: value})}
                          }>
                    {
                        reWriteList.map((item,index) => {
                            return <Panel header={item.url?.split('?')[0]||'未填写，无法生效'}
                                          key={item.key}
                                          extra={this.isOpen(item)}>
                                <Edit item={item}
                                      updateParams={this.updateParams}
                                      deleteParams={this.deleteParams}
                                      key={item.key}
                                      tip={tip[index]}
                                />
                            </Panel>
                        })
                    }
                </Collapse>
                <PlusCircleTwoTone className='rewrite-icon-plus'
                                   onClick={() => {
                                       let {reWriteList} = this.state
                                       let key = reWriteList[reWriteList.length - 1]?.key + 1 || 0
                                       reWriteList.push({
                                           open: true,
                                           rule: [{operation: 'add'}],
                                           type: 'all',
                                           key
                                       })
                                       this.setState({reWriteList})
                                       this.updateToBackground()
                                   }}/>

            </div>
        )

    }
}