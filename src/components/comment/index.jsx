import React, { useRef, useEffect, Component} from 'react'

import {connect, useSelector} from 'react-redux'

import css from './scss/index.module.scss'

import {about, replyPost} from '../../request/api'

import {mapStateToProps} from '../../utils/mapUserStateDispatch'

import {Comment, Tooltip, Avatar, Form, Button, Input, message} from 'antd';
import moment from 'moment';

class CommentComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: true,

        }
    }

    showEditor() {
        console.log(this.props)
        this.setState({
            status: false
        })
    }

    render() {
        let {children, item, pItem, setCommentList, user, editorVisible, setReplayTarget} = this.props

        let replyId = item.id === pItem.id ? 0 : item.id

        const actions = [
            <span key={user.user_id ? user.user_id : 0} onClick={() => setReplayTarget({commentId: pItem.id, replyId})}>回复</span>
        ];
        return (
            <div className={css.commentList}>
                <Comment
                    actions={user.user_id && user.user_id != item.user_id ? actions : null }
                    author={<a>{item.from_user}</a>}
                    avatar={
                        <Avatar
                            style={{
                                backgroundColor: "#cccccc",
                                verticalAlign: "middle"
                            }}
                            size="large"
                        >
                            {item.from_user}
                        </Avatar>
                    }
                    content={
                        <p>
                            {item.to_user ? '回复@' + item.to_user + ' :  ' + item.content : item.content}
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(item.createdAt).fromNow()}</span>
                        </Tooltip>
                    }
                >
                    {editorVisible ? <Editor setCommentList={setCommentList} userItem={item} pItem={pItem}/> : null}
                    {children}
                </Comment>
            </div>
        )
    }
}



const Editor = function (props) {
    const user = useSelector(state => state.userReducer)
    const {TextArea} = Input
    const editorRef = useRef()
    const {userItem, pItem ,setCommentList} = props

    useEffect(() => {
        // console.log(editorRef)
        editorRef.current.focus()
    }, [])

    const handleSubmit = (e) => {
        console.log(userItem, pItem, user)
        if (!e.commentItem) {
            message.warning('请输入回复信息')
            return false
        }else if(!user.user_id){
            message.warning('请先登录, 再进行此操作!!')
            return  false
        }
        let data = {
            content: e.commentItem,
            user_id: user.user_id,
            last_id: userItem.id,
            pid: pItem.id,
            to_uid: userItem.user_id
        }

        replyPost(data).then(res => {
            if(res.code === 200){
                about().then(res => {
                    editorRef.current.state.value = ''
                    setCommentList(res.data.comments)
                })
            }
        })
    };

    return (
        <div style={{width: '100%'}} className={css.editor}>
            <Form name="comment" onFinish={handleSubmit}>
                <Form.Item name='commentItem'>
                    <TextArea ref={editorRef} rows={4} placeholder={'回复' + userItem.from_user + ':'}/>
                </Form.Item>
                <Form.Item>
                    <div style={{textAlign: 'right'}}>
                        <Button htmlType="submit" type="primary" disabled={!user.talk}>
                            回复
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

// function CommentComp(props) {
//     const {children, item, onhide} = props
//     const [status, setStatus] = useState(true)
//     const [upData, setUpData] = useState([32])
//
//
//
//
//
//
//
//
//
//
//
//
//     return (
//
//     )
// }

export default connect(mapStateToProps, null)(CommentComp)
