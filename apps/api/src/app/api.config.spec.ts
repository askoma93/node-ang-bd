import { loadApiConfig } from './api.config';

describe('uses port 3000 by default', () => {
    it('uses port 3000 by default', () => {
        expect(loadApiConfig({})).toEqual({ port: 3000 });
    });

    it('uses a valid custom port', () => {
        expect(loadApiConfig({ API_PORT: '4000' })).toEqual({ port: 4000 });
    });

    it('rejects a non-numeric port', () => {
        expect(() => loadApiConfig({ API_PORT: 'abc' })).toThrow(
            'API_PORT must be an integer between 1 and 65535',
        );
    });

    it('rejects a port below range', () => {
        expect(() => loadApiConfig({ API_PORT: '0' })).toThrow();
    });

    it('rejects a port above range', () => {
        expect(() => loadApiConfig({ API_PORT: '65536' })).toThrow();
    });
});
