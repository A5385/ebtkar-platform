describe('GET /api', () => {
    it('should return a message', async () => {
        const res = await fetch('/api', {
            method: 'GET',
        });

        expect(res.status).toBe(200);

        const data = await res.json();

        expect(data).toEqual({
            message: 'Hello API',
        });
    });
});
