import React from 'react';
import { Alert } from 'antd';
import { useAppSelector } from '../hooks/useAppSelector';
import { PostToChannelStatus } from '../features/publisherSlice';

export default function PublisherStatusBlock() {
    const status: PostToChannelStatus = useAppSelector(state => state.publisher.status);
    const statusText = useAppSelector(state => state.publisher.statusMessage);

    switch (status) {
        case PostToChannelStatus.NoStatus:
            return null;

        case PostToChannelStatus.EmptyMessage:
            return <Alert message={statusText} type='error' showIcon />;

        case PostToChannelStatus.PostOK:
            return <Alert message={statusText}  type='success' showIcon />;

        case PostToChannelStatus.PostError:
            return <Alert message={statusText} type='error' showIcon />;
    }

    return null;
}
