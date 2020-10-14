import React, {useEffect, useState} from 'react'
import {getPostDetail} from '../../request/api'
import {withRouter} from 'react-router-dom'
import css from './scss/index.module.scss'
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import moment from 'moment'
import { Tag } from 'antd';
import {FieldTimeOutlined, TagsOutlined} from '@ant-design/icons'

// 代码块添加行号
function beforeNumber(code) {
    if (!code.trim()) {
        return code;
    }
    const list = code.split('\n');
    const spanList = ['<span aria-hidden="true" line-row>'];
    list.forEach(() => {
        spanList.push('<span></span>');
    });
    spanList.push('</span>');
    list.push(spanList.join(''));
    return list.join('\n');
}

function PostDetail(props) {
    const [data, setData] = useState({})
    const [desc, setDesc] = useState('')
    const id = props.match.params.id
    useEffect(() => {

        getPostDetail(id).then(res => {
            setData(res.data.detail)
            setDesc(marked(res.data.detail.desc))
        })
    }, [id])
    // 解析富文本
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code) {
            return beforeNumber(hljs.highlightAuto(code).value);
        }
    });
    return (
        <div className={css.detail}>
            <div className={css.detail_title}>
                {data.postname}
            </div>

            <div className={css.detail_desc}>
                {/*{data.desc}*/}
                <div className={css.ctime}>
                    <FieldTimeOutlined />
                    <span>创建时间: {moment(desc.ctime).format('YYYY-MM-DD')}</span>
                </div>

                <div className={css.tags}>
                    <TagsOutlined />
                    <span>标签: <Tag color="orange">orange</Tag></span>
                </div>

            </div>

            <div className={css.detail_content}>
                {/*<Md source={data.desc} renderers={{code: CodeBlock}} escapeHtml={false}/>*/}
                <div className="show-html" dangerouslySetInnerHTML={{ __html: desc }}></div>
            </div>
            {/*<md/>*/}
        </div>
    )
}

export default withRouter(PostDetail)
