export interface ApiConfig {
    readonly port: number;
}

export function loadApiConfig(env: NodeJS.ProcessEnv): ApiConfig {
    const port = Number(env['API_PORT'] ?? 3000);

    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
        throw new Error('API_PORT must be an integer between 1 and 65535');
    }

    return { port };
}
