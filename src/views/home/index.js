import React, {useState, useEffect} from "react";
import {Divider} from "antd";
import {withRouter} from 'react-router-dom'
import css from "./scss/index.module.scss";
import marked from 'marked'

// import hljs from "highlight.js";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';


import 'highlight.js/styles/monokai-sublime.css';
import moment from 'moment'
import {search} from "../../request/api";

hljs.registerLanguage('javascript', javascript);

// 代码块添加行号
function beforNumber(code) {
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
        console.log(111)
        return beforNumber(hljs.highlightAuto(code).value);
    }
});

function Index(props) {
    // console.log(props);
    // const keyword = useSelector(state => state.keywordsReducer)
    const [searchResult, setSearchResult] = useState([])
    props.location.query = props.location.query || {keyword: ''}
    const navigatePage = (item) => {
        props.history.push('/post/' + item.id)
        // console.log(item)
    }





    useEffect(() => {

        // console.log(props.location.query.keyword)
        if (props.location.query.keyword) {
            search(props.location.query.keyword).then(res => setSearchResult(res.data))
        }
    }, [props.location.query.keyword])


    return (
        <div className={css.home_page}>
            <ul className={css.post_list}>
                {
                    searchResult.length > 0 &&
                    searchResult.map((v, i) => (
                        <li className={css.post_item} key={v.id} onClick={() => navigatePage(v)}>
                            <div>
                                <Divider orientation="left">
                  <span className={css.post_title}>
                    <span className={css.title_text}>{v.postname}</span>　-
                    <span className={css.title_time}>
                        &nbsp;&nbsp;{moment(v.createAt).format('YYYY-MM-DD')}
                    </span>
                  </span>
                                </Divider>
                                {/*<div className={css.post_desc}>{v.desc}</div>*/}
                                <div className={css.desc}>
                                    <div className="show-html" dangerouslySetInnerHTML={{__html: marked(v.desc)}}></div>
                                    {/*<ReactMarkdown*/}
                                    {/*    source={v.desc}*/}
                                    {/*    escapeHtml={false}  //不进行HTML标签的转化*/}
                                    {/*/>*/}
                                </div>

                                <div className={css.viewers}>
                                    <i className="iconfont icon-pinglun"></i>
                                    <span>{v.comment}</span>
                                    <i className="iconfont icon-chakan-"></i>
                                    <span>{v.watch}</span>
                                </div>
                            </div>
                        </li>
                    )) ||
                    props.post &&
                    props.post.map((v, i) => (
                    <li className={css.post_item} key={v.id} onClick={() => navigatePage(v)}>
                    <div>
                    <Divider orientation="left">
                    <span className={css.post_title}>
                    <span className={css.title_text}>{v.postname}</span> -
                    <span className={css.title_time}>
                    &nbsp;&nbsp;{moment(v.createAt).format('YYYY-MM-DD')}
                    </span>
                    </span>
                    </Divider>
                    {/*<div className={css.post_desc}>{v.desc}</div>*/}
                    <div className={css.desc}>
                    <div className="show-html" dangerouslySetInnerHTML={{__html: marked(v.desc)}}></div>
                    {/*<ReactMarkdown*/}
                    {/*    source={v.desc}*/}
                    {/*    escapeHtml={false}  //不进行HTML标签的转化*/}
                    {/*/>*/}
                    </div>

                    <div className={css.viewers}>
                    <i className="iconfont icon-pinglun"></i>
                    <span>{v.comment}</span>
                    <i className="iconfont icon-chakan-"></i>
                    <span>{v.watch}</span>
                    </div>
                    </div>
                    </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default withRouter(Index)
