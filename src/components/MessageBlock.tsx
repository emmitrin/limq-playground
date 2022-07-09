import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Typography } from 'antd';
import { FileTextOutlined, FontSizeOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Message, MessageType } from '../Message';

const { Text } = Typography;

function MessageBlock(props: { msg: Message }) {
    const { msg } = props;

    let content: ReactNode = <></>;
    let title: ReactNode = <></>;

    const [hasShow, setHasShow] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => setHasShow(true), 15);
        return () => clearTimeout(timeoutId);
    }, [])

    switch (msg.type) {
        case MessageType.Binary:
            // content = <em>Binary messages are not supported at the moment.</em>;
            content = (
                <Button type="default" icon={<DownloadOutlined />} size='small' onClick={() => {
                    // reconstruct the blob again cuz can't pass it through redux anyway
                    const blob = new Blob([msg.data], {type: "application/x-octet-stream"});

                    const objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                }}>
                    Download binary data
                </Button>
            )


            const binaryCount = (msg.data as ArrayBuffer).byteLength;
            title = <span><FileTextOutlined size={32} /> Binary message ({binaryCount} bytes)</span>;
            break;

        case MessageType.Text:
            content = (
                <Text code>
                    {msg.data as string}
                </Text>
            );

            const count = (msg.data as string).length;
            title = <span><FontSizeOutlined size={32} /> Text message ({count} chars)</span>;
            break;

        case MessageType.Service:
            content = <em>{msg.data as string}</em>;
            title = <span><InfoCircleOutlined size={32} /> Status message</span>;
            break;
    }

    return (
        <>
            <Card title={title} size='small' className={hasShow ? 'show' : ''}>
                {content}
            </Card>
        </>
    );
}
export default MessageBlock;
