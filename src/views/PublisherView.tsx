import { SendOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Select, Space } from 'antd';
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
import PostToChannel, { APIPostResponse } from '../api/post';

const { Option } = Select;
const { TextArea } = Input;

export default function PublisherView() {
    const dispatch = useAppDispatch();

    const msgType = useAppSelector(state => state.publisher.messageType);
    const textFieldStatus = useAppSelector(state => state.publisher.textFieldStatus);
    const messageContent = useAppSelector(state => state.publisher.message);
    const key = useAppSelector(state => state.channel.key);

    function sendMessage() {
        if (messageContent instanceof ArrayBuffer)
            return sendBinaryMessage();
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

        PostToChannel(key, text)
            .then(response => {
                switch (response) {
                    case APIPostResponse.Ok:
                        dispatch(setStatusMessage('Message successfully posted'))
                        dispatch(setStatus(PostToChannelStatus.PostOK))
                        return;

                    case APIPostResponse.AuthenticationError:
                        dispatch(setStatusMessage('Invalid channel access key!'))
                        break;

                    case APIPostResponse.UnknownError:
                        dispatch(setStatusMessage('Unknown error'))
                        break;

                    case APIPostResponse.ChannelIsFull:
                        dispatch(setStatusMessage('Channel is overfilled with messages'))
                        break;

                    case APIPostResponse.UnknownMessageType:
                        dispatch(setStatusMessage('Bug is found! Unknown message type'))
                        break;

                    default:
                        dispatch(setStatusMessage('Unknown error (2)'))
                }

                dispatch(setStatus(PostToChannelStatus.PostError));
            })
    }

    function sendBinaryMessage() {

    }

    return (
        <>
            <Space>
                <Button icon={<SendOutlined />} type='primary' onClick={sendMessage}>Send
                    message</Button>

                <Select defaultValue={msgType} style={{ width: 256 }} onChange={(value, option) => {
                    dispatch(setMessageType(value));
                }}>
                    <Option value={MessageType.Text}>Text message</Option>
                    <Option value={MessageType.Binary}>Binary message</Option>
                </Select>

                <PublisherStatusBlock />
            </Space>

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
                    <></>
                }
            </Form>
        </>
    );
}
