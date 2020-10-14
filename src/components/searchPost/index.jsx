import React, {useEffect, useState} from 'react'

import { Form, Input, Button, Cascader } from 'antd';

import {getCate, searchPost} from '../../request/api'

import css from './scss/index.module.scss'

function SearchPost({searchResult}) {

    const [form] = Form.useForm();

    const [options, setOptions] = useState([])

    const onFinish = values => {
        console.log('Success:', values);
        searchPost(values).then(res => searchResult(res.data.list))
    };

    function onChange(value) {
        console.log(value);
    }

    useEffect(() => {

        getCate().then(res => {
            res.data.map((v, i) => {
                v.value = v.tagname
                v.label = v.tagname
            })
            setOptions(res.data)
        })
    }, [])

    return (
        <div className={css.search}>
            <Form
                layout='inline'
                form={form}
                onFinish={onFinish}
            >
                <Form.Item label="关键词" name='keywords'>
                    <Input placeholder="请输入文章关键词" />
                </Form.Item>
                <Form.Item label="标签" name='tag'>
                    <Cascader options={options} onChange={onChange} placeholder="Please select" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">检索</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SearchPost
