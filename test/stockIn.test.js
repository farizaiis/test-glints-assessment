const app = require('../server');
const supertest = require('supertest');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

//POST DATA STOCKIN
test('POST /v1/stock-in/', async () => {
    const token = await supertest(app).post('/v1/admin/login').send({
        email: 'fariz@glintsacademy.com',
        password: 'glints_test',
    });

    const data = {
        dataItemId: 1,
        stock: 20,
        date: today,
    };

    await supertest(app)
        .post('/v1/stock-in/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.dataItemId).toBe(data.dataItemId);
            expect(res.body.data.stock).toBe(data.stock);
            expect(res.body.data.date).toBe(data.date);
        });
});

//UPDATE DATA STOCKIN
test('PUT /v1/stock-in/:id', async () => {
    const token = await supertest(app).post('/v1/admin/login').send({
        email: 'fariz@glintsacademy.com',
        password: 'glints_test',
    });

    const data = {
        stock: 12,
        date: today,
    };

    const create = await supertest(app)
        .post('/v1/stock-in/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            dataItemId: 1,
            stock: 20,
            date: today,
        });

    await supertest(app)
        .put('/v1/stock-in/' + create.body.data.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.dataItemId).toBe(create.body.data.dataItemId);
            expect(res.body.data.stock).toBe(data.stock);
            expect(res.body.data.date).toBe(data.date);
        });
});

//DELETE DATA STOCKIN
test('DELETE /v1/stock-in/:id', async () => {
    const token = await supertest(app).post('/v1/admin/login').send({
        email: 'fariz@glintsacademy.com',
        password: 'glints_test',
    });

    const data = {
        stock: 12,
        date: today,
    };

    const create = await supertest(app)
        .post('/v1/stock-in/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            dataItemId: 1,
            stock: 20,
            date: today,
        });

    await supertest(app)
        .delete('/v1/stock-in/' + create.body.data.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});
