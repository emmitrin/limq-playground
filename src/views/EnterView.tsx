import { useAppDispatch, useAppSelector } from '../hooks/useAppSelector';
import React from 'react';
import { setKey, setPermissions } from '../features/channelSlice';
import { Button, Col, Divider, Input, Radio, Row, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { setView, Views } from '../features/viewSlice';

const { Title, Paragraph } = Typography;

export default function EnterView() {
    const key = useAppSelector(state => state.channel.key);
    const permissions = useAppSelector(state => state.channel.permissions);
    const dispatch = useAppDispatch();

    function onKeyEnterEdit(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        dispatch(setKey(value));
    }

    function openNextView() {
        if (key.length !== 32) return;

        if (permissions === 0) // hardcoded
            dispatch(setView(Views.Listener));
        else
            dispatch(setView(Views.Publisher));
    }

    return (
        <>
            <div id='credentials-enter'>
                <Row>
                    <Col span={21}>
                        <Input size='large'
                               autoFocus
                               status={key.length > 0 && key.length !== 32 ? 'error' : ''}
                               placeholder='Enter a channel access key'
                               prefix={<LockOutlined />}
                               onChange={onKeyEnterEdit}
                        />
                    </Col>

                    <Col span={3}>
                        <Button
                            style={{ marginLeft: '8px', width: '100%' }}
                            size='large'
                            type='primary'
                            onClick={openNextView}
                        >Open</Button>
                    </Col>

                </Row>

                <Divider />

                <Row>
                    <Col span={24}>
                        <Radio.Group value={permissions} onChange={(e) => {
                            dispatch(setPermissions(e.target.value as number));
                        }}>
                            <Radio value={0}>listen for messages (WebSocket)</Radio>
                            <Radio value={1}>post new messages</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
            </div>


            <Row>
                <Col span={24}>
                    <div id='intro-block'>
                        <Typography>
                            <Title level={4}>LiMQ playground / online console</Title>
                            <Paragraph>
                                Using this tool you can try out LiMQ features.
                            </Paragraph>
                            <Paragraph>
                                LiMQ is a powerful and lightweight SaaS (cloud) message broker.
                                Enter your LiMQ key and select its permissions
                            </Paragraph>
                        </Typography>
                    </div>
                </Col>
            </Row>
        </>
    );
}