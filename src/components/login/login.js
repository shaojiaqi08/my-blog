import React from "react";

import { Form, Input, Button, Checkbox, message } from "antd";

import css from './scss/index.module.scss'

import {login} from '../../request/api'

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};


export default function Login({cancelLoginModal, changeUsername}) {
  const [form] = Form.useForm();

  const onFinish = values => {
    login(values).then(res => {
      if (res.code == 200){
        message.success("登录成功!!");
        form.resetFields()
        changeUsername(res.data.user)
        cancelLoginModal()
      }else{
        message.warning(res.msg)
      }
    })
  };

  const onFinishFailed = errorInfo => {
    // console.log("Failed:", errorInfo);
    message.error('请输入正确的用户名和密码!!')
  };
  return (
    <div className={css.login_form}>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "请输入你的用户名"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入账号密码"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" className={css.login_btn}>
          登录
        </Button>
      </Form>
    </div>
  );
}
