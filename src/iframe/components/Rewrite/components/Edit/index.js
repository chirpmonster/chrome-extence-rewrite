import React from 'react';
import {Button, Checkbox, Input, Radio, Select, Table} from 'antd'
const {Option} = Select;
import {PlusCircleTwoTone, CloseOutlined} from '@ant-design/icons';
import {JsonEditor as Editor} from "jsoneditor-react";

import deepclone from 'clone-deep'
import 'jsoneditor-react/es/editor.min.css';
import './index.less'

export default class Edit extends React.Component {

    state = {
        item: {rule: []}
    }

    componentDidMount() {
        let item = deepclone(this.props.item)
        this.parseParams(item.params)
        this.setState({item})
    }

    columns = [
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (data, list, index) => {
                return <Select value={data} style={{width: 120}} onChange={(value) => {
                    let {item} = this.state
                    list.operation = value
                    item.breakpoint = false
                    this.setState({item})
                }}>
                    <Option value="add">添加/修改</Option>
                    <Option value="delete">删除</Option>
                </Select>
            }
        },
        {
            title: 'key',
            dataIndex: 'reWriteKey',
            key: 'reWriteKey',
            width: 180,
            render: (data, list, index) => {
                return <Input value={data}
                              onChange={(e) => {
                                  let {item} = this.state
                                  list.reWriteKey = e.target.value
                                  item.breakpoint = false
                                  this.setState({item})
                              }}
                />
            }
        },
        {
            title: 'value',
            dataIndex: 'reWriteValue',
            key: 'reWriteValue',
            width: 180,
            render: (data, list, index) => {
                return <Input value={data}
                              onChange={(e) => {
                                  let {item} = this.state
                                  list.reWriteValue = e.target.value
                                  item.breakpoint = false
                                  this.setState({item})
                              }}
                />
            }
        }, {
            dataIndex: 'delete',
            key: 'delete',
            width: 0,
            render: (data, list, index) => {
                return <CloseOutlined className='edit-icon-delete'
                                      onClick={() => {
                                          let {item} = this.state
                                          item.rule.splice(index, 1)
                                          this.setState({item})
                                      }}
                />
            }
        }
    ]

    parseParams = (obj) => {
        if (typeof obj === 'object') {
            Object.keys(obj).forEach((key) => {
                obj[key] = this.parseJSON(obj[key])
            })
        }
    }

    parseJSON = (str) => {
        if (typeof str == 'string') {
            try {
                return JSON.parse(str)
            } catch (e) {
                return str
            }
        } else {
            return str
        }
    }

    stringifyParams = (obj) => {
        if (typeof obj === 'object') {
            Object.keys(obj).forEach((key) => {
                if (typeof obj[key] === 'object') {
                    obj[key] = JSON.stringify(obj[key])
                }
            })
        }
    }

    render() {
        let {item} = this.state
        return (
            <div className='edit'>
                <div>
                    url：
                    <Input
                        value={item.url}
                        className='rewrite-edit-url'
                        onChange={(e) => {
                            item.url = e.target.value
                            this.setState({item})
                        }
                        }/>
                    <Checkbox checked={item.breakpoint}
                              className='rewrite-edit-breakpoint'
                              onChange={(e) => {
                                  item.breakpoint = e.target.checked
                                  this.setState({item})
                              }}
                    />
                    阻断以获取全部参数
                </div>
                <Radio.Group value={item.type}
                             className='rewrite-edit-type'
                             onChange={(e) => {
                                 item.type = e.target.value
                                 this.setState({item})
                             }}>
                    <Radio.Button value='all'>全部参数修改</Radio.Button>
                    <Radio.Button value='part'>部分参数修改</Radio.Button>
                </Radio.Group>
                {
                    item.type === 'all' ?
                        <div style={{marginBottom: '10px'}}>
                            {
                                item.params ? <Editor
                                    value={item.params}
                                    onChange={(value) => {
                                        item.params = value
                                        item.breakpoint = false
                                        this.setState({item})
                                    }}
                                /> : null
                            }
                        </div> : null
                }
                {
                    item.type === 'part' ?
                        <div>
                            <Table className='rewrite-edit-table' columns={this.columns} dataSource={[...item.rule]}
                                   pagination={false}/>
                            <PlusCircleTwoTone className='edit-icon-plus'
                                               onClick={() => {
                                                   item.rule.push({
                                                       reWriteKey: '',
                                                       reWriteValue: '',
                                                       operation: 'add'
                                                   })
                                                   this.setState({})
                                               }}/>
                        </div> : null
                }
                <Button type="primary" onClick={() => {
                    this.stringifyParams(item.params)
                    this.props.updateParams(item)
                }}>确认修改</Button>
                <Button type="danger" style={{margin: '0 10px'}}
                        onClick={() => this.props.deleteParams(item)}>删除</Button>
                <span>{this.props.tip}</span>
            </div>)
    }
}