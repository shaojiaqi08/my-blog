import React, {Component} from "react";
import {Divider, Row, Col, Tag} from "antd";
import css from "./scss/index.module.scss";
import {Link, withRouter} from 'react-router-dom'

class AsideComp extends Component {


    render() {
        let {hotPost, tag, userinfo} = this.props.initData;
        return (
            <div className={css.aside}>
                <Row>
                    <Col span={24}>
                        <div className={css.my_info}>
                            <img src={userinfo && userinfo.avatar} alt=""/>
                            <h3 className={css.nickname}>{userinfo && userinfo.nickname}</h3>
                            <span className={css.desc}>{userinfo && userinfo.desc}</span>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <div className={css.hot_post}>
                            <Divider orientation="left">热门文章</Divider>
                            <ul>
                                {hotPost &&
                                hotPost.map((v, i) => <li key={v.id}>
                                    <Link to={'/post/' + v.id}>{v.postname}</Link>
                                </li>)}
                            </ul>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <div className={css.tag}>
                            <Divider orientation="left">标签</Divider>
                            <div className={css.tag_item}>
                                {tag &&
                                tag.map((v, i) => (
                                    <Tag color="cyan" key={v.id} style={{marginBottom: 5}}
                                         onClick={() => this.props.history.replace({
                                             pathname: '/file',
                                             query: {type: v.tagname}
                                         })}>
                                        {v.tagname}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(AsideComp)
