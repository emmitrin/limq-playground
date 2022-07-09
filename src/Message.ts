enum MessageType {
    Binary,
    Text,
    Service
}

type Message = {
    type: MessageType;
    data: string | ArrayBuffer;
    timestamp: string;
}

export { MessageType };
export type { Message };
