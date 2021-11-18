const app = require('../server');
const supertest = require('supertest');

//ADMIN LOGIN
test('POST /v1/admin/login', async () => {
    const data = {
        email: 'fariz@glintsacademy.com',
        password: 'glints_test',
    };

    await supertest(app)
        .post('/v1/admin/login')
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe('sign in successfully');
        });
});
