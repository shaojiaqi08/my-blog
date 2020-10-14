import React, {useState, useEffect} from 'react'
import css from './scss/index.module.scss'
import {Table, Button, Modal, message} from 'antd';
import {getCate, delTag, deleteAllTag} from '../../request/api'
import {ExclamationCircleOutlined} from '@ant-design/icons';
import moment from 'moment'

const {confirm} = Modal;

function Cate() {
    const columns = [
        {
            title: '分类名称',
            dataIndex: 'tagname',
            key: 'tagname',
            align: 'center'
        },
        {
            title: '文章数量',
            dataIndex: 'count',
            key: 'count',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            align: 'center',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Button size="middle" type='link' onClick={() => showDeleteConfirm(record)}>
                    <a>删除</a>
                </Button>
            ),
        },
    ];

    // 分类列表
    const [cateList, setCateList] = useState([])

    // 多选框选中行(id)
    const [selectedRowKeys, setSelectedRowKeys ] = useState([])

    // 多选框选中行数据(对象)
    const [selectedRow, setSelectedRow] = useState([])

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        getCate().then(res => {
            const {data} = res
            for (let i = 0; i < data.length; i++) {
                data[i].key = data[i].id
                data[i].createAt = moment(data[i].createAt).format('YYYY-MM-DD HH:mm:ss')
            }
            setCateList(data)
        })
    }

    // 删除一个标签和里面的文章
    const deleteTag = (record) => {
        console.log(record)
        delTag(record).then(res => {
            res.code == 200 ? message.success(res.msg) : message.error(res.msg)
            init()
        })
    }

    // 删除所有标签和里面的文章
    const deleteAll = (rowKey) => {
        console.log(rowKey)
        deleteAllTag(rowKey).then(res => {
            res.code == 200 ? message.success(res.msg) : message.error(res.msg)
            init()
        })
    }

    // 弹出删除选中项的对话框
    function DeleteAllConfirm(rowKey) {
        confirm({
            title: '删除选中分类',
            icon: <ExclamationCircleOutlined/>,
            content: '确定删除所有选中的分类 (包括分类下的文章) 吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                deleteAll(rowKey)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 点击删除弹出对话框
    function showDeleteConfirm(record) {
        confirm({
            title: '删除分类',
            icon: <ExclamationCircleOutlined/>,
            content: '确定删除此分类 (包括分类下的文章) 吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                deleteTag(record)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 表格多选框改变
    const onSelectChange = (rowKeys, filters, sorter) => {
        console.log('selectedRowKeys changed: ', rowKeys, filters, sorter);
        setSelectedRowKeys(rowKeys)
        setSelectedRow(filters)
    };

    return (
        <div className={css.cate}>
            <Table rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
            }} columns={columns} dataSource={cateList} bordered/>
            <div className={css.btn}>
                <Button type="primary" disabled={selectedRowKeys.length == 0} onClick={() => DeleteAllConfirm(selectedRow)}>删除</Button>
            </div>

        </div>
    )
}

export default Cate
