import * as React from "react";
import {Button, Table, Switch} from 'antd';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import 'antd/dist/antd.css';
import './AccountManagement.css';
import AccountManagementModal from "./AccountManagementModal";

const columns = [
    {
        title: 'No',
        dataIndex: 'no',
        key: 'no'
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
    },
    {
        title: 'Fullname',
        dataIndex: 'fullname',
        key: 'fullname'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: action => (
            <>
                {action === 'on' ? <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked/> :
                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked={false}/>}
            </>
        )
    }
];

const data = [
    {
        key: '1',
        no: 1,
        username: 'John Brown',
        fullname: 'New York No. 1 Lake Park',
        action: 'on'
    },
    {
        key: '2',
        no: 2,
        username: 'Jim Green',
        fullname: 'London No. 1 Lake Park',
        action: 'off'
    },
    {
        key: '3',
        no: 3,
        username: 'Joe Black',
        fullname: 'Sidney No. 1 Lake Park',
        action: 'on'
    },
];

class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            ModalText: 'Creating new camera',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <>
                <div>
                    <div className='title-camera-management'>
                        <h1>Account Management</h1>
                    </div>
                    <div className='parent-create-new'>
                        <Button onClick={this.showModal}><FontAwesomeIcon icon={faPlus}/><span className='new-camera'>New Account</span></Button>
                    </div>
                    <div className='camera-table'>
                        <Table columns={columns} dataSource={data}
                               pagination={{defaultCurrent: 1, total: 10, pageSize: 10}}/>
                    </div>
                </div>
                <AccountManagementModal handleOk={this.handleOk} visible={this.state.visible} confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}/>
            </>
        );
    }
}

export default AccountManagement;
