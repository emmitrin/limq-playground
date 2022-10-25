import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Select, Space, Upload, UploadFile, UploadProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import { MessageType } from '../Message';
import {
    PostToChannelStatus,
    setMessage,
    setMessageType,
    setStatus,
    setStatusMessage,
    setTextFieldStatus,
} from '../features/publisherSlice';
import PublisherStatusBlock from '../components/PublisherStatusBlock';
import PublishToChannel, { APIPostResponse } from '../api/publish';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;


export default function PublisherView() {
    const dispatch = useAppDispatch();

    const msgType = useAppSelector(state => state.publisher.messageType);
    const textFieldStatus = useAppSelector(state => state.publisher.textFieldStatus);
    const messageContent = useAppSelector(state => state.publisher.message);
    const key = useAppSelector(state => state.channel.key);

    function handleResponse(response: APIPostResponse) {
        switch (response) {
            case APIPostResponse.Ok:
                dispatch(setStatusMessage('Message successfully posted'));
                dispatch(setStatus(PostToChannelStatus.PostOK));
                return;

            case APIPostResponse.AuthenticationError:
                dispatch(setStatusMessage('Invalid channel access key!'));
                break;

            case APIPostResponse.UnknownError:
                dispatch(setStatusMessage('Unknown error'));
                break;

            case APIPostResponse.ChannelIsFull:
                dispatch(setStatusMessage('Channel is overfilled with messages'));
                break;

            case APIPostResponse.UnknownMessageType:
                dispatch(setStatusMessage('Bug is found! Unknown message type'));
                break;

            default:
                dispatch(setStatusMessage('Unknown error (2)'));
        }

        dispatch(setStatus(PostToChannelStatus.PostError));
    }

    function sendMessage() {
        if (msgType === MessageType.Binary)
            return sendBinaryMessage(binModeFile as RcFile);
        return sendTextMessage();
    }

    function sendTextMessage() {
        const text = messageContent as string;

        if (text.length === 0) {
            dispatch(setTextFieldStatus('error'));
            dispatch(setStatus(PostToChannelStatus.EmptyMessage));
            dispatch(setStatusMessage('Message must be non-empty'));

            return;
        }

        PublishToChannel(key, text)
            .then(response => handleResponse(response));
    }

    const [binModeFile, setBinModeFile] = useState<UploadFile>();

    function sendBinaryMessage(file: RcFile) {
        if (file === undefined) {
            dispatch(setStatusMessage('No file selected'));
            dispatch(setStatus(PostToChannelStatus.PostError));
        }

        const validSize = file.size / 1024 < 256;

        if (!validSize) {
            dispatch(setStatusMessage('Message size must not exceed 256 KB'));
            dispatch(setStatus(PostToChannelStatus.PostError));
            return;
        }

        file.arrayBuffer().then(ab => {
            PublishToChannel(key, ab).then(response => handleResponse(response));
        });
    }

    const props: UploadProps = {
        onRemove: file => {
            setBinModeFile(undefined);
        },

        beforeUpload: file => {
            setBinModeFile(file);

            return false;
        },

        fileList: (binModeFile === undefined) ? [] : [binModeFile!],
    };


    return (
        <>
            <Row gutter={[7, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col xs={24} lg={12}>
                    <Space>
                        <Button icon={<SendOutlined />} type='primary' onClick={sendMessage}>Send
                            message</Button>

                        <Select defaultValue={msgType} onChange={(value, option) => {
                            dispatch(setMessageType(value));
                        }}>
                            <Option value={MessageType.Text}>Text message</Option>
                            <Option value={MessageType.Binary}>Binary message</Option>
                        </Select>
                    </Space>

                </Col>

               <Col xs={24} lg={12}>
                   <PublisherStatusBlock />
               </Col>
            </Row>

            <Divider />

            <Form>
                {msgType === MessageType.Text ?
                    <TextArea
                        style={{}}
                        onChange={(event) => {
                            dispatch(setMessage(event.target.value));
                            dispatch(setStatus(PostToChannelStatus.NoStatus));
                        }}
                        rows={12}
                        placeholder='Place your text message here'
                        allowClear
                        status={textFieldStatus as ('' | 'warning' | 'error' | undefined)}
                    />
                    :
                    <>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select file</Button>
                        </Upload>
                    </>
                }
            </Form>
        </>
    );
}
