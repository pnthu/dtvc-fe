import * as React from "react";
import {Modal, Button, Form, Input} from 'antd';
import './NewCameraModal.css';

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 24},
};

const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

class NewCameraModal extends React.Component {

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
                <h1 className='title-new-camera'>New Camera</h1>
                <Form
                    layout="vertical"
                    {...layout}
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input camera name!'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Location"
                        name="location"
                        rules={[{required: true, message: 'Please input camera location!'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[{required: true, message: 'Please input camera position!'}]}>
                        <Input/>
                    </Form.Item>
                    <Button id='test-connection-button'>Test connection</Button>
                    <Form.Item
                        label="Test connection"
                        name="connection">
                        <img src={require('../image/black.jpg')} alt='Violation Image' className="test-image"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" id='submit-form-new-camera'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default NewCameraModal;
