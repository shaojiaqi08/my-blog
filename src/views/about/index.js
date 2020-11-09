import React, {useState, useEffect, useRef} from "react";

import {Row, Col, Divider, Rate, Input, Button, Avatar, message} from "antd";

import {QqOutlined, EditOutlined} from "@ant-design/icons";

import css from "./scss/index.module.scss";

import imgUrl from "../../assets/images/89131866.jpeg";

import CommentComp from "../../components/comment";

import {connect, useSelector} from 'react-redux'

import {about, insetComment} from '../../request/api'

function AboutPage() {

    const commentRef = useRef()

    const {TextArea} = Input

    const user = useSelector(state => state.userReducer)

    const [replyTarget, setReplyTarget] = useState({
        commentId: 0,
        replyId: 0
    })

    const [commentList, setCommentList] = useState([])

    useEffect(() => {
        about().then(res => {
            setCommentList(res.data.comments)
        })
    }, [])
    // console.log(props)
    // const [username, setUsername] = useState('')
    //
    // useEffect(() => {
    //   setUsername(JSON.parse(localStorage.getItem('username')))
    //
    // }, [username])



    const comment = () => {
        if(!!user.username){
            // console.log(commentRef.current.state.value)
            let data = {
                user_id: user.user_id,
                content: commentRef.current.state.value
            }
            insetComment(data).then(res => {
                if(res.code === 200){
                    commentRef.current.state.value = ''
                    about().then(res => {
                        setCommentList(res.data.comments)
                    })
                }
            })
        }else{
            message.warning('请先登录再进行此操作');
        }
    }

    const setList = (arr) => {
        setCommentList(arr)
    }

    const setReply = ({commentId, replyId}) => {
        if(!user.user_id) return message.warning('请先登录再进行此操作')
        setReplyTarget({commentId, replyId})
    }

    // const hideEditor = (setStatus) => {
    //     console.log(111)
    //     setStatus(true)
    // }

    return (
        <div className={css.about_page}>
            <Row>
                <Col>
                    {/*{JSON.stringify(ui)}*/}
                    <div className={css.about_title}>
                        <img src={imgUrl} alt=""/>
                        <span>前端搬运工, 爱折腾, 实践才是检验真理的唯一标准</span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Divider orientation="left">博客简述</Divider>
                    <div className={css.about_desc}>
                        <p>本博客使用的技术为react hooks + antd + eggjs + mysql</p>
                        <p>源码地址为: https://github.com/shaojiaqi08/my-blog.git</p>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Divider orientation="left">关于我</Divider>
                    <div className={css.about_us}>
                        <ul>
                            <li>姓名: 邵嘉祺</li>
                            <li>学历: 全日制大专</li>
                            <li>
                                联系方式: <QqOutlined/> 453257452 | shaojiaqi08@163.com
                            </li>
                            <li>坐标: 广州</li>
                            <li>
                                <div>技能</div>
                                <ul>
                                    <li>
                                        HTML、CSS、Javascript：能熟练开发符合 W3C 标准的页面！
                                        <Rate disabled defaultValue={3}/>
                                    </li>
                                    <li>
                                        react vue 框架：掌握使用！
                                        <Rate disabled defaultValue={3}/>
                                    </li>
                                    <li>
                                        es6：日常开发必备，以及掌握基本面向对象编程实现！！
                                        <Rate disabled defaultValue={3}/>
                                    </li>
                                    <li>
                                        webpack: 可以对脚手架进行针对性的打包配置！！
                                        <Rate disabled defaultValue={2}/>
                                    </li>
                                    <li>
                                        node
                                        mysql：针对需求可以做到简单的数据库设计、接口的开发与设计！
                                        <Rate disabled defaultValue={2}/>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <div>其他</div>
                                <ul>
                                    <li>常用开发工具： vscode、git</li>
                                    <li>熟悉的 UI 工具： antd、element-ui</li>
                                    <li>良好的代码习惯： 略微代码洁癖、注释规范 jsdoc</li>
                                </ul>
                            </li>

                            <li>
                                <div>个人</div>
                                <ul>
                                    <li>偶尔玩玩游戏、打羽毛球、观看前端技术视频, 加强自身技术栈</li>
                                    <li>欢迎交流</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className={css.message}>
                        <span style={{fontSize: 16}}><span
                            style={{color: '#619eee', marginRight: 5, fontSize: 20}}>{commentList.length}</span>条留言</span>
                        <span style={{fontSize: 16}}>{user.username ? user.username : '未登录'}</span>
                    </div>
                </Col>
            </Row>

            {/*<textarea className={css.textarea}></textarea>*/}
            <Row>
                <Col span={1}>
                    <Avatar
                        style={{
                            backgroundColor: "#cccccc",
                            verticalAlign: "middle"
                        }}
                        size="large"
                    >
                        {user.username ? user.username : '未登录'}
                    </Avatar>
                </Col>
                <Col span={23}>
                    <TextArea ref={commentRef} rows={4} style={{resize: 'none', borderRadius: 5}} placeholder='说点什么...'/>
                </Col>
            </Row>


            <div className={css.msg_btn}>
                {
                    user.user_id ? null : <span className={css.tipSpan}>登录后可进行留言或评论</span>
                }
                <Button type="primary" shape="round" icon={<EditOutlined/>} onClick={comment}>
                    留言
                </Button>
            </div>
            <div className={css.commentBox}>
                {
                    commentList.map((v, i) => (
                        /**
                         * @pItem: 一级评论
                         * @item: 此次渲染的评论
                         */
                        <CommentComp item={v} key={v.id} pItem={v} setCommentList={setList} editorVisible={v.id === replyTarget.commentId && !replyTarget.replyId} setReplayTarget={setReply}>
                            {
                                v.replies.length > 0 && v.replies.map((v1, i) => (
                                    <CommentComp item={v1} key={v1.id} pItem={v} setCommentList={setList} editorVisible={v.id === replyTarget.commentId && replyTarget.replyId === v1.id} setReplayTarget={setReply}/>
                                ))
                            }
                        </CommentComp>
                    ))
                }
            </div>


        </div>
    );
}

export default connect(null, null)(AboutPage)
