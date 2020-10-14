import React, { useState } from "react";

import { Form, Input, Button, message } from "antd";

import css from "./scss/index.module.scss";

import { register, checkUser } from "../../request/api";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
};

export default function Register(props) {
  const [form] = Form.useForm();

  const [bl, setBl] = useState(false);

  const onFinish = values => {
    // console.log("Received values of form: ", values);

    if (bl) {
      return false;
    }
    delete values.confirm;

    register(values).then(res => {
      // console.log(res);
      if (res.code === 200) {
        message.success("注册成功!!");
        form.resetFields();
        props.changeVisible();
        props.changeUsername(res.data.username);
        localStorage.setItem("username", JSON.stringify(res.data.username));
      } else {
        message.error("注册失败!!");
      }
    });
  };

  function blurHandler() {
    let username = form.getFieldValue("username");
    // console.log(username);
    if (!username) {
      return false;
    }
    checkUser(username).then(res => {
      if (res.code === 400) {
        setBl(true);
      } else {
        setBl(false);
      }
    });
    // console.log("blur");
    // setBl(true);
  }

  return (
    <div className={css.register}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label={<span>用户名</span>}
          rules={[
            {
              required: true,
              message: "请输入用户名",
              whitespace: true
            },
            {
              max: 10,
              message: "超出最大长度",
              whitespace: true
            },
            {
              pattern: new RegExp(/^[0-9a-zA-Z_]{1,}$/, "g"),
              message: "名称只允许包含数字、字母和下划线"
            }
          ]}
          help={bl ? "用户名已注册" : null}
        >
          <Input onBlur={blurHandler} />
          {/* {bl ? (
            <span style={{ fontSize: 12, color: "red" }}>用户名已注册</span>
          ) : null} */}
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: "email",
              message: "请输入邮箱地址!"
            },
            {
              required: true,
              message: "请输入邮箱地址",
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码!",
              whitespace: true
            },
            {
              max: 18,
              message: "超出最大长度"
            },
            {
              min: 6,
              message: "密码最少6个字符长度"
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "请再次输入密码!"
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject("两次密码输入不一样!");
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form>
    </div>
  );
}
