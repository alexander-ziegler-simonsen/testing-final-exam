import { http, HttpResponse } from 'msw';

export const Handlers = [
    // paramater - path, resolver
    // the path request will get a mock response, from the react resolver
    http.get('/api/users', () => {
        return HttpResponse.json([
            {
                id: 1,
                name: "bob",
            },
        ]);
    }),
];