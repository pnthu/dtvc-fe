import * as React from "react";
import {Modal, Button, Form, Input} from 'antd';
import './AccountManagementModal.css';

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 24},
};

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

class AccountManagementModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        }
    }

    onFinish = values => {
        console.log('Success:', values);
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return (
            <Modal
                visible={this.props.visible}
                onOk={this.props.handleOk}
                confirmLoading={this.props.confirmLoading}
                onCancel={this.props.onCancel}>
                <h1 className='title-new-camera'>New Account</h1>
                <Form
                    layout="vertical"
                    {...layout}
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Please input username!'}]}>
                        <Input placeholder='Input username'/>
                    </Form.Item>
                    <Form.Item
                        label="Fullname"
                        name="fullname"
                        rules={[{required: true, message: 'Please input fullname!'}]}>
                        <Input placeholder='Input full name of user'/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: 'Please input password!'}]}>
                        <Input.Password placeholder='Input password'/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" id='submit-form-new-camera'>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default AccountManagementModal;

