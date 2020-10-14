import React, {useState, useRef, useEffect} from 'react'
import css from './scss/index.module.scss'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import {Form, Input, Button, Tag, message} from 'antd';
import {PlusOutlined } from '@ant-design/icons'
import debounce from 'loadsh/debounce'
import {addPost, getCate, getPostDetail, updatePost} from '../../request/api'
import {withRouter} from 'react-router-dom'
import marked from 'marked'



const {CheckableTag} = Tag;

function AddPost(props) {
    const [form] = Form.useForm();
    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(""))
    const [selectedTags, setSelectedTags] = useState([])
    const [inputVisible, setInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [tags, setTags] = useState([])
    const inputRef = useRef();
    const editorRef = useRef()
    const formRef = useRef()
    const fileRef = useRef()

    // 解析富文本
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: true
    });


    useEffect(() => {

        // fetch(md).then(res => res.text()).then(result => console.log(result))

        getCate().then(res => {
            setTags(res.data)
        }, err => {
            console.log(err)
            message.error(err.msg)
        })

        console.log(props)
        const {query = {}} = props.location
        if (query.id) {
            getPostDetail(query.id).then(res => {
                form.setFieldsValue({
                    content: BraftEditor.createEditorState(marked((res.data.detail.desc))),
                    title: res.data.detail.postname
                })
                setSelectedTags([res.data.detail.tag])
            })
            return
        }

        let saveContent = localStorage.getItem('editor_content') || ''

        if (saveContent) {
            let content = BraftEditor.createEditorState(saveContent)
            setEditorState(content)
            // console.log(editorState)
        }
    }, [])

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
    }, [inputVisible])

    const handleEditorChange = debounce((editorState) => {
        // this.setState({ editorState })
        // console.log(editorState.toHTML())
        setEditorState(editorState)
    }, 1000)

    const submitContent = () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        // const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
        localStorage.setItem("editor_content", editorState.toRAW())
        message.success('保存成功');
    }

    const onFinish = values => {
        console.log('Success:', values.content.toHTML());

        if (!values.title) return message.warning('标题不能为空!')
        else if (editorState.isEmpty()) return message.warning('文章内容不能为空!')

        if (selectedTags.length > 0) {
            values.content = editorState.toHTML()
            values.tag = selectedTags[0]

        } else {
            values.content = editorState.toHTML()
        }
        const {query = {}} = props.location
        if(query.id) {
            values.id = query.id
            updatePost(values).then(res => {
                message.success(res.msg)
                form.setFieldsValue({
                    content: BraftEditor.createEditorState(''),
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
                editorRef.current.clearEditorContent()
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
                content: BraftEditor.createEditorState(marked(e.target.result))
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
                            <BraftEditor
                                value={editorState}
                                onChange={handleEditorChange}
                                onSave={submitContent}
                                defaultValue={BraftEditor.createEditorState(localStorage.getItem('editor_content'))}
                                ref={editorRef}
                            />
                        </Form.Item>

                        {/*{form.getFieldDecorator('content', {*/}
                        {/*    initialValue: BraftEditor.createEditorState('')*/}
                        {/*})(*/}
                        {/*    <BraftEditor*/}
                        {/*        value={editorState}*/}
                        {/*        onChange={handleEditorChange}*/}
                        {/*        onSave={submitContent}*/}
                        {/*    />*/}
                        {/*)}*/}
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
