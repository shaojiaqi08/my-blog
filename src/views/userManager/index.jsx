import React, {useState, useEffect} from 'react'
import css from './scss/index.module.scss'

import Screen from '../../components/screen'

import UserList from '../../components/userList'

import {connect, useSelector, useDispatch} from 'react-redux'

import { Button, message, Modal, Switch } from 'antd'

import {getUserList, deleteUser, changeTalk, changeRole, userScreen} from '../../request/api'
import moment from 'moment'

import { ExclamationCircleOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

import {withRouter} from 'react-router-dom'

const { confirm } = Modal;

function UserManager(props) {
    const [userList, setUserList] = useState([])

    const user = useSelector(state => state.userReducer)

    const dispatch = useDispatch()

    const searchValue = (value) => {
        let bl = false
        let arrKey = Object.keys(value)
        arrKey.forEach((v, i) => {
            if (value[v]){
                bl = true
            }
        })
        if(bl){
            userScreen(value).then(res => {
                if(res.code === 200){
                    initData(res.data.userList)
                    setUserList(res.data.userList)
                }else if (res.code === 401){
                    console.log(props)
                }

            })
        }else{
            init()
        }

    }

    function showDeleteConfirm(item) {
        confirm({
            title: '删除用户',
            icon: <ExclamationCircleOutlined />,
            content: '此操作不可逆, 确定删除此用户?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                delUser(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const delUser = (del) => {
        let data = {
            role: user.role,
            user_id: user.user_id,
            id: del.id
        }
        deleteUser(data).then(res => {
            if (res.code === 200){
                message.success('删除成功!!')
                init()
            }else{
                message.error('删除失败, 此数据不存在')
            }
        })
    }

    const clickHandle = (type, item) => {
        // console.log(type, item)
        let data = {
            role: 0,
            id: item.id
        }
        switch (type) {
            case '删除':
                showDeleteConfirm(item)
                break;
            case '提升权限':
                data.role = 1
                changeRole(data).then(res => {
                    if(res.code === 200) message.success('修改成功')
                    else message.error('修改失败')
                    init()
                })
                break;
            case '降低权限':
                data.role = 2
                changeRole(data).then(res => {
                    if(res.code === 200) message.success('修改成功')
                    else message.error('修改失败')
                    init()
                })
                break;
        }
    }

    const switchChange = (checked, item) => {
        let data = {
            talk: checked ? 0 : 1,
            id: item.id
        }

        changeTalk(data).then(res => {
            console.log(res)
            if(res.code === 200){
                message.success('修改成功')
                // init()
            }else{
                message.error('修改失败')
            }
        })
    }

    const initData = (userList) => {
        userList.map(v => {
            let action = [v.role === 2 ? '提升权限' : '降低权限', '删除']
            v.role = v.role === 1 ? '管理员' : '用户'
            v.talk = <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={!(v.talk === 1)}
                onChange={(checked) => switchChange(checked, v)}
            />
            v.createAt = moment(v.createAt).format('YYYY-MM-DD')
            v.key = v.id
            v.action = action.map((v1, i) => (
                <Button type="primary" shape="round" key={i} size='small' style={{margin: '0 10px'}} onClick={() => clickHandle(v1, v)}>
                    {v1}
                    {/*撒旦法*/}
                </Button>
            ))
        })
    }

    const init = () => {
        getUserList().then(res => {
            if (res.code === 200){
                initData(res.data.userList)
                setUserList(res.data.userList)
            }else if (res.code === 401){
                message.warning(res.msg + ', 请更换账号或重新登录')
                dispatch({type: 'CHANGE_USERNAME', payload: {}})
                props.history.push('/')
            }

        })
    }

    useEffect(() => {
        init()
    }, [])
    return (
        <div className={css.user_manager}>
            <Screen search={searchValue}/>
            <UserList userList={userList}/>
        </div>
    )
}

export default connect(null, null)(withRouter(UserManager))
