import { Button, Divider, Space, Typography } from 'antd';
import { baseURL } from '../client';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import { useEffect } from 'react';
import MessageBlock from '../components/MessageBlock';
import { Message, MessageType } from '../Message';
import { clearMessages, pushMessage } from '../features/listenerSlice';
import { ClearOutlined } from '@ant-design/icons';

const wsURL = `ws://${baseURL}`;

export default function ListenerView() {
    const key = useAppSelector(state => state.channel.key);
    const messages = useAppSelector(state => state.messages.messagesHistory);
    const dispatch = useAppDispatch();

    const endpoint = `${wsURL}/ws_listen${key}`;

    const { lastMessage, readyState } = useWebSocket(endpoint, { share: true });

    function parseNewMessage(m: MessageEvent<any>) {
        if (m === null) return;

        if (m.data instanceof Blob) {
            const blob = m.data as Blob;
            blob.arrayBuffer().then(ab => {
                const message: Message = {
                    type: MessageType.Binary,
                    data: ab,
                    timestamp: '' // todo
                }

                dispatch(pushMessage(message));
            });
        } else if (typeof m.data === "string") {
            const message: Message = {
                type: MessageType.Text,
                data: m.data as string,
                timestamp: '' // todo
            }

            dispatch(pushMessage(message));
        } else {
            console.error('unknown data type', typeof m.data, m);
        }
    }

    function parseReadyState(rs: ReadyState) {
        let statusText = 'Unknown state';

        switch (rs) {
            case ReadyState.UNINSTANTIATED:
                statusText = 'Unknown error while instantiating'
                return;

            case ReadyState.CONNECTING:
                return;

            case ReadyState.OPEN:
                statusText = 'Successfully connected to the LiMQ WebSocket API. Listening for a new messages';
                break;

            case ReadyState.CLOSING:
                statusText = 'Closing the connection'
                break;

            case ReadyState.CLOSED:
                statusText = 'Unable to establish the connection. Is the access key valid?'
                break;
        }

        const msg: Message = {
            type: MessageType.Service,
            data: statusText,
            timestamp: '' // todo
        };

        dispatch(pushMessage(msg));
    }

    useEffect(() => {
        if (lastMessage === null) return;
        parseNewMessage(lastMessage);
    }, [lastMessage]);

    useEffect(() => {
        parseReadyState(readyState);
    }, [readyState])

    return (
        <>
            <Button icon={<ClearOutlined />} onClick={() => dispatch(clearMessages())}>Clear all messages</Button>
            <Divider />
            <Space direction='vertical' size='middle' style={{ display: 'flex' }} className={'fade'}>
                {messages.map((m, msgId) => (
                    <MessageBlock msg={m} key={`msgdisp${msgId}`} />
                ))}
            </Space>
        </>

    );
}