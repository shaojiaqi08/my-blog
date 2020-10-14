import React, { useState, useEffect } from "react";
import { Tag, Row, Col, Badge } from "antd";
import css from "./scss/index.module.scss";
import {withRouter} from 'react-router-dom'

import { getCate } from "../../request/api.js";

function Category(props) {
  const [cateList, setCateList] = useState([]);
  useEffect(() => {
    getCate().then(res => {
      // if (res.code == 200) {
      setCateList(JSON.parse(JSON.stringify(res.data)))
      // }
    });
  }, []);

  return (
    <div className={css.category_page}>
      <Row justify="center">
        <Col>
          <h3 className={css.cate_title}>分类Category</h3>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <h5 className={css.cate_desc}>
            {cateList.length ? cateList.length : 0} categories in total
          </h5>
        </Col>
      </Row>

      <Row justify="center">
        <Col>
          <div className={css.cate_tag}>
            {cateList.length &&
              cateList.map((v, i) => (
                <Badge count={v.count} key={v.id} showZero>
                  <Tag color="blue" onClick={() => props.history.push({pathname: '/file', query: {type: v.tagname}})}>{v.tagname}</Tag>
                </Badge>
              ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(Category)
