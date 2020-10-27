import * as React from "react";
import './ViolationRecord.css';
import './Common.css';
import { Pagination } from 'antd';

class ViolationRecord extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='parent-record parent-video-streaming'>
                <h1 className='title-record'>Violation Recorded</h1>
                <div className='parent-description'>
                    <div className='record-description'>
                        <span>Violation Type: </span>
                        <span>Passing red light</span>
                    </div>
                    <div className='record-description'>
                        <span>License Plate Number: </span>
                        <span>59-E1 12345</span>
                    </div>
                    <div className='record-description'>
                        <span>Recorded Time: </span>
                        <span>09:00 23/09/2020</span>
                    </div>
                </div>
                <div className='image-record'>
                    <img src={require('../image/black.jpg')} alt='Violation Image'/>
                </div>
                <div className='parent-view-detail-button'>
                    <button className='view-detail-button'>View Detail</button>
                </div>
                <div className='pagination-record'>
                    <Pagination defaultCurrent={1} total={10} pageSize={1} showSizeChanger={false} size={"small"}/>
                </div>
            </div>
        );
    }
}

export default ViolationRecord;