import React, {useState, useRef, useEffect} from 'react'
import css from './scss/index.module.scss'
// 引入编辑器组件
// import BraftEditor from 'braft-editor'
// 引入编辑器样式
// import 'braft-editor/dist/index.css'
// import 'braft-extensions/dist/code-highlighter.css'
import {Form, Input, Button, Tag, message, Modal} from 'antd';
import {PlusOutlined, ExclamationCircleOutlined  } from '@ant-design/icons'
// import debounce from 'loadsh/debounce'
import {addPost, getCate, getPostDetail, updatePost} from '../../request/api'
import {withRouter} from 'react-router-dom'
// import marked from 'marked'

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


const {CheckableTag} = Tag;
const { confirm } = Modal;

function AddPost(props) {
    const [form] = Form.useForm();
    const [editorState, setEditorState] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [inputVisible, setInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [tags, setTags] = useState([])
    const inputRef = useRef();
    const formRef = useRef()
    const fileRef = useRef()

    // 解析富文本
    // marked.setOptions({
    //     renderer: new marked.Renderer(),
    //     gfm: true,
    //     pedantic: false,
    //     sanitize: false,
    //     tables: true,
    //     breaks: true,
    //     smartLists: true,
    //     smartypants: true
    // });


    useEffect(() => {


        getCate().then(res => {
            setTags(res.data)
        }, err => {
            console.log(err)
            message.error(err.msg)
        })
        const {query = {}} = props.location
        if (query.id) {
            getPostDetail(query.id).then(res => {
                form.setFieldsValue({
                    content: res.data.detail.desc,
                    title: res.data.detail.postname
                })
                setSelectedTags([res.data.detail.tag])
            })
            return
        }

        let saveContent = localStorage.getItem('editor_content') || ''

        if (saveContent) {
            confirmModel(saveContent)
            // form.setFieldsValue({
            //     content: saveContent
            // })
            // let content = BraftEditor.createEditorState(saveContent)
            // setEditorState(content)
            // console.log(editorState)
        }
    }, [])

    const confirmModel = saveContent => {
        confirm({
            title: '已保存内容未进行发布!',
            icon: <ExclamationCircleOutlined />,
            content: '是否要对已保存的文章内容进行编辑?',
            centered: true,
            onOk() {
                form.setFieldsValue({
                    content: saveContent
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
    }, [inputVisible])


    const onFinish = values => {
        console.log('Success:', values);

        if (!values.title) return message.warning('标题不能为空!')
        else if (!values.content) return message.warning('文章内容不能为空!')
        if (selectedTags.length > 0) {
            values.tag = selectedTags[0]
        }
        const {query = {}} = props.location
        if(query.id) {
            values.id = query.id
            updatePost(values).then(res => {
                message.success(res.msg)
                form.setFieldsValue({
                    content: '',
                    title: ''
                })
                setSelectedTags([])
            })
        }else{
            addPost(values).then(res => {
                message.success(res.msg)
                localStorage.setItem('editor_content', '')
                // console.log(editorRef)
                formRef.current.resetFields()
                // editorRef.current.clearEditorContent()
                setSelectedTags([])
            }, err => {
                message.error(err.msg)
                console.log(err)
            })
        }



    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (tag, checked) => {
        // const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        // console.log('You are interested in: ', nextSelectedTags, tag);
        // this.setState({ selectedTags: nextSelectedTags });
        setSelectedTags([tag])
    }

    const showInput = () => {
        // this.setState({ inputVisible: true }, () => this.input.focus());
        setInputVisible(true)
    };

    const handleInputChange = e => {
        // this.setState({ inputValue: e.target.value });
        setInputValue(e.target.value)
    };

    const handleInputConfirm = (tags) => {

        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, {tagname: inputValue}];
        }
        // console.log(tags);
        // this.setState({
        //     tags,
        //     inputVisible: false,
        //     inputValue: '',
        // });
        setTags(tags)
        setInputVisible(false)
        setInputValue('')
    };

    const contentChange = (value) => {
        // setEditorState(value)
        form.setFieldsValue({
            content: value
        })
    }

    const chooseFile = () => {
        if(!fileRef.current)return false

        const reader = new FileReader();
        console.log(reader.result)
        // 用readAsText读取TXT文件内容
        reader.readAsText(fileRef.current.files[0]);

        // reader.readAsDataURL(fileRef.current.files[0]);
        reader.onload = function (e) {
            console.log(e)
            form.setFieldsValue({
                content: e.target.result
            })
            // console.log(e.target.result); 　　 //读取结果保存在字符串中
            // let my_str = e.target.result;　　　　//直接保存全部数据为一个字符串
            // let my_arr = my_str.split(/[\s\n]/); 　　//按空格和换行符切割字符串，并保存在数组中
            //
            //
            // this.setState({
            //     previewPic: e.target.result,
            //     arr : my_arr
            // });
        }.bind(this);
        // fetch(fileRef.current.value).then(res => console.log(res))
    }

    const onKeyDown = (e) => {
        if (e.ctrlKey && e.keyCode == 83 || e.metaKey && e.keyCode == 83) {
            // console.log('----', e.keyCode, e.ctrlKey, e.metaKey, e.shiftKey)
            e.preventDefault();
            // console.log('-----开始保存了')
            localStorage.setItem('editor_content', form.getFieldValue('content'))
            message.success('保存成功!')
        }
    }
    const editorFocus = () => {
        document.addEventListener("keydown", onKeyDown)
    }

    return (
        <div className={css.add_post}>
            <Form
                name="basic"
                initialValues={{remember: true}}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                ref={formRef}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    // rules={[{ required: true, message: '请输入标题!' }]}
                >

                    <Input/>

                </Form.Item>
                <Form.Item
                    label="标签"
                >
                    {tags.map(tag => (
                        <CheckableTag
                            key={tag.tagname}
                            checked={selectedTags.indexOf(tag.tagname) > -1}
                            onChange={checked => handleChange(tag.tagname, checked)}
                        >
                            {tag.tagname}
                        </CheckableTag>
                    ))}
                    {inputVisible && (
                        <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            className={css.tag_input}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={() => handleInputConfirm(tags)}
                            onPressEnter={() => handleInputConfirm(tags)}
                        />
                    )}
                    {!inputVisible && (
                        <Tag className="site-tag-plus" onClick={showInput}>
                            <PlusOutlined/> New Tag
                        </Tag>
                    )}
                </Form.Item>

                <Form.Item>
                    <div className={css.editor}>
                        <Form.Item name="content">
                            <SimpleMDE
                                id="editor"
                                onFocus={editorFocus}
                                value={editorState}
                                options={{
                                    spellChecker: false,
                                    toolbar: [
                                        'bold',
                                        'italic',
                                        'heading',
                                        '|',
                                        'quote',
                                        'code',
                                        'table',
                                        'horizontal-rule',
                                        'unordered-list',
                                        'ordered-list',
                                        '|',
                                        'link',
                                        'image',
                                        '|',
                                        'side-by-side',
                                        'fullscreen',
                                        '|',
                                        'guide'
                                    ]
                                }}
                                onChange={contentChange}
                            />
                        </Form.Item>
                    </div>
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <div className={css.file}>
                        上传文件内容
                        <input type="file" id='file' ref={fileRef} onChange={chooseFile}/>
                    {/*    <Button type="primary" htmlType="submit">*/}
                    {/*        上传文件内容*/}
                    {/*    </Button>*/}
                    </div>


                    {/*<Upload>*/}
                    {/*    <Button*/}
                    {/*        type="primary"*/}
                    {/*        icon={<UploadOutlined />}*/}
                    {/*        onChange={chooseFile}*/}
                    {/*    >*/}
                    {/*        上传文件显示到文本框*/}
                    {/*    </Button>*/}
                    {/*</Upload>*/}

                    <span className={css.saveTip}>按 ctrl + s 可进行保存</span>


                </Form.Item>
            </Form>


        </div>
    )
}

export default withRouter(AddPost)
