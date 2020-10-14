import React, {useState, useEffect} from 'react'
import css from './scss/index.module.scss'
import {Table, Tag, Button, message, Modal, Switch} from 'antd';
import {getPost, delPost, isHot} from '../../request/api'
import moment from 'moment'
import {ExclamationCircleOutlined, CloseOutlined, CheckOutlined} from '@ant-design/icons';

import SearchPost from '../../components/searchPost'

import {withRouter} from 'react-router-dom'

const {confirm} = Modal;


function PostManager(props) {
    const [postList, setPostList] = useState([])

    const columns = [
        {
            title: '标题',
            dataIndex: 'postname',
            key: 'postname',
            align: 'center',
        },
        {
            title: '标签',
            key: 'tag',
            dataIndex: 'tag',
            align: 'center',
            render: tag => (
                <>
                    <Tag color='volcano' key={tag}>
                        {tag}
                    </Tag>
                </>
            ),
        },
        {
            title: '查看人数',
            dataIndex: 'watch',
            key: 'watch',
            align: 'center',
        },
        {
            title: '设为热门文章',
            dataIndex: 'is_hot',
            key: 'is_hot',
            render: (text, record) => (
                <>
                    <Switch
                        checkedChildren={<CheckOutlined/>}
                        unCheckedChildren={<CloseOutlined/>}
                        defaultChecked={record.is_hot == 1}
                        onChange={() => switchChange(record)}
                    />
                </>
            ),
            align: 'center',
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
            render: (text, record) => (
                <>
                    <Button type="link" size='small' onClick={() => navigateDetail(record)}>
                        查看
                    </Button>
                    <Button type="link" size='small' onClick={() => navigateAddPost(record)}>
                        编辑
                    </Button>
                    <Button type="link" size='small' onClick={() => showConfirm(record)}>
                        删除
                    </Button>
                </>
            ),
            align: 'center',
        },
    ];

    function showConfirm(record) {
        confirm({
            title: '删除文章',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要删除此文章吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deletePost(record)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    function switchChange(record){
        // console.log(record)
        let data = {
            is_hot: record.is_hot == 1 ? 0 : 1,
            id: record.id
        }
        console.log(data)
        isHot(data).then(res => console.log(res))
    }

    function navigateDetail(record) {
        props.history.push('/post/' + record.id)
    }

    function navigateAddPost(record) {
        props.history.push({pathname: '/admin/add', query: {id: record.id}})
    }

    function deletePost(record) {
        delPost(record).then(res => {
            if (res.code == 200) {
                message.success(res.msg)
                init()
            } else {
                message.error(res.msg)
                init()
            }
        })
    }

    function init() {
        getPost().then(res => {
            res.data.map(v => {
                v.key = v.id
                v.createAt = moment(v.createAt).format('YYYY-MM-DD HH:mm:ss')
            })
            setPostList(res.data)
        })
    }

    function searchResult(data) {
        setPostList(data)
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div className={css.post_manager}>
            <SearchPost searchResult={searchResult}/>
            <div className={css.table}>
                <Table bordered columns={columns} dataSource={postList}/>
            </div>

        </div>
    )
}

export default withRouter(PostManager)
