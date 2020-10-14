import React, {useState, useEffect} from 'react'
import {Layout, Menu, Breadcrumb, Dropdown} from 'antd';
import {DownOutlined, TeamOutlined, CopyOutlined, UnorderedListOutlined, FormOutlined, AppstoreOutlined} from '@ant-design/icons';
import './scss/index.scss'
import { connect, useSelector, useDispatch } from "react-redux";
import UserManager from '../../views/userManager'
import PostManager from "../../views/postManager";
import AddPost from "../../views/addPost";
import CateManager from '../../views/cateManager'
import {Route, Switch, withRouter, Redirect} from 'react-router-dom'
import {mapDispatchToProps} from '../../utils/mapUserStateDispatch'
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

function AdminIndex(props) {
    const user = useSelector(user => user.userReducer)
    const navLink = useSelector(state => state.navLinkReducer)
    const {history} = props
    const [selectorNavItem, setSelectorNavItem] = useState(['用户管理'])

    const dispatch = useDispatch()

    useEffect(() => {
        switch (navLink) {
            case '用户管理':
                history.push('/admin')
                break;
            case '管理':
                history.push('/admin/manager')
                break;
            case '新增':
                history.push('/admin/add')
                break;
            case '分类管理':
                history.push('/admin/cate')
                break;
        }
    }, [])

    const onClick = ({key, keyPath}) => {
        // console.log(value)
        if (keyPath.length > 1) {
            setSelectorNavItem([keyPath[1], keyPath[0]])
        }else{
            setSelectorNavItem([keyPath[0]])
        }

        switch (key) {
            case '用户管理':
                history.push('/admin')
                break;
            case '管理':
                history.push('/admin/manager')
                break;
            case '新增':
                history.push('/admin/add')
                break;
            case '分类管理':
                history.push('/admin/cate')
                break;
        }

        dispatch({type: 'CHANGE_NAV_LINK', payload: key})

    };

    const backToHome = (e) => {
        switch (e.key) {
            case 'home':
                history.push('/')
                break;
            case 'exit':
                props.changeUsername({})
        }
    }

    const menu = (
        <Menu onClick={backToHome}>
            <Menu.Item key="home" >返回首页</Menu.Item>
            <Menu.Item key="exit">退出并返回</Menu.Item>
        </Menu>
    );

    if (user.role !== 1 || !user.user_id){
        console.log(111)
        return(
            <Redirect to='/'/>
        )
    }

    return (
        <div className='admin_layout'>
            <Layout>
                <Header className="header">
                    <div className='logo'>
                        Manager
                    </div>

                    <Dropdown overlay={menu} className='layout_right'>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {
                                user.user_id ? user.username : '未登录'
                            } <DownOutlined/>
                        </a>
                    </Dropdown>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[navLink ||'用户管理']}
                            defaultOpenKeys={navLink.includes('新增') || navLink === '管理' ? ['文章'] : []}
                            style={{height: '100%', borderRight: 0}}
                            onClick={onClick}
                        >
                            <Menu.Item key="用户管理"><TeamOutlined />用户管理</Menu.Item>
                            <Menu.Item key="分类管理"><AppstoreOutlined />分类管理</Menu.Item>
                            <SubMenu key="文章" title={
                                <>
                                    <CopyOutlined />
                                    <span>文章</span>
                                </>
                            }>
                                <Menu.Item key="管理"><UnorderedListOutlined />管理</Menu.Item>
                                <Menu.Item key="新增"><FormOutlined />新增</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>后台管理</Breadcrumb.Item>
                            {
                                selectorNavItem.map((v, i) => {
                                    return (
                                        (
                                            <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>
                                        )
                                    )
                                })
                            }
                        </Breadcrumb>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <Switch>
                                <Route path='/admin' exact render={() => <UserManager />}/>
                                <Route path='/admin/manager' render={() => <PostManager />}/>
                                <Route path='/admin/add' render={() => <AddPost />}/>
                                <Route path='/admin/cate' render={() => <CateManager />}/>
                            </Switch>


                        </Content>
                    </Layout>
                </Layout>
            </Layout>

        </div>
    )
}

export default connect(null, mapDispatchToProps)(withRouter(AdminIndex))
