import React from 'react'

import css from './scss/index.module.scss'

import {Form, Input, Button, DatePicker, Cascader } from 'antd';

import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';


function AdminContent({search}) {

    const [form] = Form.useForm();
    const {RangePicker} = DatePicker;

    const options = [
        {
            value: '1',
            label: '管理员'
        },
        {
            value: '2',
            label: '用户'
        }
    ];

    function onChange(value) {
        console.log(value);
    }

    const onFormLayoutChange = (fieldsValue) => {
        const values = {
            // ...fieldsValue,
            username: fieldsValue.username ? fieldsValue.username : '',
            role: fieldsValue.role ? fieldsValue.role : '',
            'createAt': fieldsValue.createAt ? [fieldsValue.createAt[0].format('YYYY-MM-DD'), fieldsValue.createAt[1].format('YYYY-MM-DD')] : ''
        };
        // console.log('Received values of form: ', values);
        search(values)
    }

    return (
        <div className={css.screen_content}>
            <div>
                <Form
                    layout='inline'
                    form={form}
                    onFinish={onFormLayoutChange}
                >
                    <Form.Item label="姓名" name="username">
                        <Input placeholder="请输入用户名称"/>
                    </Form.Item>
                    <Form.Item label="用户类型" name="role">
                        <Cascader options={options} onChange={onChange} placeholder="Please select" />
                    </Form.Item>
                    <Form.Item label="创建日期" name="createAt">
                        <RangePicker locale={locale}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AdminContent
