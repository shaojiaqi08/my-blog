// 整合所有布局组件
import React, {useEffect, useState} from "react";


// antd layout布局
import {Layout, Spin} from "antd";

import css from "./scss/index.module.scss";

import App from "../../App";

import HeaderComponent from "../../layout/header/index";

import AsideComponent from "../../layout/aside/index";

import {getIndex} from "../../request/api";

import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import Admin from '../admin/index'
import IndexComp from "../../views/home";
// import TimeLineComp from "../../views/timeline";
// import CategoryComp from "../../views/category";
// import AboutComp from "../../views/about";
import {connect, useSelector} from "react-redux";
import Loadable from 'react-loadable'

// import Post from '../../views/postDetail'

const {Header, Sider, Content} = Layout;



const LoadingComp = () => {
    return (
        <div className={css.layout_loading}>
            <div className={css.loading_container}>
                <Spin tip="Loading..." size="large" spinning={true}/>
            </div>
        </div>
    )
}

// import { SlackSquareOutlined } from "@ant-design/icons";

const DelayFile = Loadable({
    loader: () => import('../../views/timeline/index'),
    loading: LoadingComp
})

const DelayCate = Loadable({
    loader: () => import('../../views/category/index'),
    loading: LoadingComp
})

const DelayAbout = Loadable({
    loader: () => import('../../views/about/index'),
    loading: LoadingComp
})



const DelayPost = Loadable({
    loader: () => import('../../views/postDetail/index'),
    loading: LoadingComp
})

function LayoutComp(props) {
    const [indexData, setIndexData] = useState({})
    const state = useSelector(state => state)



    useEffect(() => {
        // console.log(props)
        getIndex().then(res => {
                setIndexData(res.data)
                // dispatch({
                //     type: 'CHANGE_LOADING',
                //     payload: false
                // })
            }
        );
    }, [])
    return (
        <div className={css.layout}>
            <Router>
                <Switch>
                    <Route path='/admin' render={() => <Admin/>}/>
                    <Route path='/' render={() => <MainLayout indexData={indexData} exact/>}/>
                </Switch>
            </Router>
            {
                state.loadingReducer && <LoadingComp />
            }


        </div>
    )
}

function MainLayout({indexData}) {
    return (
        <Layout>
            <Header className={css.big_header}>
                <HeaderComponent/>
            </Header>
            <Layout>
                <Sider className={css.aside} width={300}>
                    <AsideComponent initData={indexData}/>
                </Sider>
                <Content>
                    <App>
                        <Switch>
                            <Route path="/" render={() => <IndexComp post={indexData.post}/>} exact/>
                            <Route path="/file" render={() => <DelayFile/>}/>
                            <Route path='/cate' render={() => <DelayCate/>}/>
                            <Route path='/about' render={() => <DelayAbout/>}/>
                            <Route path='/post/:id' render={() => <DelayPost/>}/>
                            <Redirect to='/'/>
                        </Switch>

                    </App>
                </Content>
            </Layout>
        </Layout>
    )
}

export default connect(null, null)(LayoutComp)

