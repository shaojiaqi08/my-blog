import React, { useState, useEffect, Fragment } from "react";

import { Timeline } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import css from "./scss/index.module.scss";
import { getPost, categoryDetail } from "../../request/api";
import { Link, withRouter } from "react-router-dom";

// 对返回的数组进行排序
function category(list) {
  let groups = {};
  list.forEach(v => {
    let group = JSON.stringify(v.createAt.slice(0, 4));
    groups[group] = groups[group] || [];
    groups[group].push(v);
  });
  // console.log(groups)
  return Object.keys(groups).map(group => groups[group]);
}

function FileComp(props) {
  const [list, setList] = useState([]);
  props.location.query = props.location.query || {type: ''}

  useEffect(() => {
    console.log(props.location.query.type)
    if(props.location.query && props.location.query.type){
      // console.log(props.location.query.type)
      // setType(props.location.query.type)
      // console.log(type)
      categoryDetail({type: props.location.query.type}).then(res => {
        let list = category(res.data);
        setList(list);
      })
    }else{
      getPost().then(res => {
        let list = category(res.data);
        setList(list);
      });
    }

  }, [props.location.query.type]);

  return (
    <div className={css.file_comp}>
      {
        props.location.query.type && (
            <h1 className={css.tag_title}>{props.location.query.type}</h1>
        )
      }
      <Timeline>
        {list.length &&
          list.map((v, i) => (
            <Fragment key={i}>
              <Timeline.Item
                dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
                color="red"
                className={css.clock_text}
              >
                {v[0].createAt.slice(0, 4)}...
              </Timeline.Item>

              {v.map((v1, i1) => (
                <Timeline.Item key={i1}>
                  <Link to={'/post/' + v1.id}>
                    <span style={{ color: "#666" }}>
                      {v1.createAt.split("T")[0]}
                    </span>{" "}
                    <span style={{ marginLeft: 10, fontSize: 16 }}>
                      {v1.postname}
                    </span>
                  </Link>
                </Timeline.Item>
              ))}
            </Fragment>
          ))}
      </Timeline>
    </div>
  );
}

export default withRouter(FileComp);
