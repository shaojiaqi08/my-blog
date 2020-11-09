import React, {Component} from "react";
import {
    TwitterOutlined,
    HomeOutlined,
    EditOutlined,
    FolderOutlined,
    UserOutlined,
    SearchOutlined,
    PieChartOutlined
} from "@ant-design/icons";
import {Input, Menu, Button, Modal, Avatar, Popover} from "antd";

import styles from "../../layout/header/scss/index.module.scss";

import {Link, withRouter} from "react-router-dom";

import Register from "../../components/register/register";

import Login from "../../components/login/login";

import {connect} from 'react-redux'

import {mapDispatchToProps, mapStateToProps} from '../../utils/mapUserStateDispatch'

class HeaderComp extends Component {
    state = {
        current: "home",
        loading: false,
        visible: false,
        user: {},
        userVisible: false,
        loginVisible: false,
        searchValue: ''
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    showLoginModal = () => {
        this.setState({
            loginVisible: true
        });
    };

    cancelLoginModal = () => {
        this.setState({loginVisible: false});
    };

    changeUsername = user => {
        const {changeUsername} = this.props

        changeUsername(user)

        // console.log(this.props)

        // localStorage.setItem('username', username)
        // this.setState({
        //     user: this.props.user
        // });
    };

    handleOk = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false, visible: false});
        }, 3000);
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    componentWillMount() {
        let currentLocation = this.props.location.pathname;
        if (currentLocation === "/") {
            this.setState({
                current: "home"
            });
        } else {
            let location = currentLocation.slice(1);
            this.setState({
                current: location
            });
        }
    }

    componentDidMount() {
        // let username = localStorage.getItem('username') || ''
        // this.setState({
        //   username
        // })
        // console.log(this.props)
    }

    handleClick = e => {
        // console.log("click ", e);
        this.setState({
            current: e.key
        });
    };

    hide = () => {
        this.setState({
            userVisible: false,
            user: {}
        });
        // localStorage.setItem("username", "");
        this.props.changeUsername({})
    };

    searchHandle (e) {
        this.props.history.replace({pathname: '/', query: {keyword: e.currentTarget.value}})
    }

    render() {
        // console.log(this.props)
        return (
            <div className={styles.header}>
                <div className={styles.logo}>
                    <TwitterOutlined className={styles.font_logo}/>
                    <span className={styles.logo_title}>JacKie_Shao的博客</span>

                    <div className={styles.search}>
                        <Input
                            placeholder="输入需要搜索的标题"
                            size="small"
                            // className={styles.search_input}
                            prefix={
                                <SearchOutlined/>
                            }
                            allowClear
                            bordered='false'
                            onPressEnter={this.searchHandle.bind(this)}
                        />
                    </div>
                </div>

                <div className={styles.nav}>
                    <div className={styles.nav_menu}>
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="home">
                                <Link to="/">
                                    <HomeOutlined/>
                                    首页
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="file">
                                <Link to="/file?type=null">
                                    <EditOutlined/>
                                    归档
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="category">
                                <Link to="/cate">
                                    <FolderOutlined/>
                                    分类
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="about">
                                <Link to="/about">
                                    <UserOutlined/>
                                    关于
                                </Link>
                            </Menu.Item>

                        </Menu>
                        {
                            this.props.user.role === 1 ? (
                                    <Menu
                                        onClick={this.handleClick}
                                        selectedKeys={[this.state.current]}
                                        mode="horizontal"
                                    >
                                        <Menu.Item key="admin">
                                            <Link to="/admin">
                                                <PieChartOutlined/>
                                                后台管理
                                            </Link>
                                        </Menu.Item>
                                        {/*<Menu.Item key="back">*/}
                                        {/*    <Link to="/home">*/}
                                        {/*        <RollbackOutlined/>*/}
                                        {/*        返回首页*/}
                                        {/*    </Link>*/}
                                        {/*</Menu.Item>*/}

                                    </Menu>
                                )
                                : null
                        }

                    </div>


                    <div className={!this.props.user.username ? styles.login : ""}>
                        {this.props.user.username ? (
                            <Popover
                                placement="bottom"
                                title={false}
                                content={<a onClick={this.hide}>退出登录</a>}
                            >
                                <Avatar
                                    style={{
                                        backgroundColor: "#cccccc",
                                        verticalAlign: "middle"
                                    }}
                                    size="large"
                                >
                                    {this.props.user.username}
                                </Avatar>
                            </Popover>
                        ) : (
                            <div className={styles.login}>
                                <Button onClick={this.showLoginModal}>登录</Button>
                                <Button onClick={this.showModal}>注册</Button>
                            </div>
                        )}

                        <div className={styles.register}>
                            <Modal
                                visible={this.state.visible}
                                title="用户注册"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={false}
                            >
                                <Register
                                    changeUsername={this.changeUsername}
                                    changeVisible={this.handleCancel}
                                />
                            </Modal>
                        </div>

                        <div className={styles.register}>
                            <Modal
                                visible={this.state.loginVisible}
                                title="用户登录"
                                onOk={this.handleOk}
                                onCancel={this.cancelLoginModal}
                                footer={false}
                                // getContainer={false}
                                // forceRender={true}
                                // destroyOnClose={false}
                            >

                                <Login cancelLoginModal={this.cancelLoginModal} changeUsername={this.changeUsername}/>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// function mapStateToProps(state){
//   return {
//     username: state.userReducer
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderComp));
