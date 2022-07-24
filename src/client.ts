const devMode = false;

export type HostConfig = {
    wsPrefix: string;
    httpPrefix: string;
};

const devConfig: HostConfig = {
    httpPrefix: 'http://localhost:8080',
    wsPrefix: 'ws://localhost:8080',
};

const prodConfig: HostConfig = {
    httpPrefix: 'https://api.limq.ru',
    wsPrefix: 'wss://api.limq.ru',
};

export const ApiConfig = (devMode) ? devConfig : prodConfig;
