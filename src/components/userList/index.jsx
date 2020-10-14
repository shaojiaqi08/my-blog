import React from 'react'
import css from './scss/index.module.scss'
import { Table } from 'antd';

const columns = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        align: 'center'
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 100,
        align: 'center'
    },
    {
        title: '禁言',
        dataIndex: 'talk',
        key: 'talk',
        width: 50,
        align: 'center'
    },
    {
        title: '用户类型',
        dataIndex: 'role',
        key: 'role',
        width: 50,
        align: 'center'
    },
    {
        title: '注册时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width: 100,
        align: 'center'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: 200
    },
];


function UserList({userList}) {
    // console.log(userList)
    return (
        <div className={css.user_list}>
            <Table dataSource={userList} columns={columns}  pagination={true}/>
        </div>
    )
}

export default UserList
