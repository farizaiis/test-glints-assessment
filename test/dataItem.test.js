const app = require("../server");
const supertest = require("supertest");

// CREATE DATA-ITEM
test('POST /v1/data-item/', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

    const data = {
        name: "Test 1",
        price: 1500,
        stock: 20,
        category: "Snack"
    }

    await supertest(app)
        .post('/v1/data-item/')
        .set("Authorization", "Bearer " + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.name).toBe(data.name);
            expect(res.body.data.price).toBe(data.price);
            expect(res.body.data.stock).toBe(data.stock);
            expect(res.body.data.category).toBe(data.category);
        });
});

//UPDATE DATA-ITEM
test('PUT /v1/data-item/', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

    const data = {
        name: "Test Update",
        price: 2000,
        category: "Minuman"
    }

    const create = await supertest(app)
        .post('/v1/data-item/')
        .set("Authorization", "Bearer " + token.body.token)
        .send({
            name: "Test 2",
            price: 1500,
            stock: 20,
            category: "Snack"
        })

        await supertest(app)
        .put('/v1/data-item/' + create.body.data.id)
        .set("Authorization", "Bearer " + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.name).toBe(data.name);
            expect(res.body.data.price).toBe(data.price);
            expect(res.body.data.stock).toBe(create.body.data.stock);
            expect(res.body.data.category).toBe(data.category);
        });
});

//DELETE DATA-ITEM
test('DELETE /v1/data-item/:id', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

    const create = await supertest(app)
        .post('/v1/data-item/')
        .set("Authorization", "Bearer " + token.body.token)
        .send({
            name: "Test 3",
            price: 1500,
            stock: 20,
            category: "Snack"
        })

        await supertest(app)
        .delete('/v1/data-item/' + create.body.data.id)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});

//READ ONE DATA-ITEM WITHOUT HISTORY STOCK
test('GET /v1/data-item/:id', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 2)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITHOUT HISTORY STOCK
test('GET /v1/data-item/:id', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN
test('GET /v1/data-item/:id?stock=in', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=in')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN & FILTER BY SPECIFIC YEAR
test('GET /v1/data-item/:id?stock=in&filter=year&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=in&filter=year&date=' + '2021')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN & FILTER BY SPECIFIC MONTH
test('GET /v1/data-item/:id?stock=in&filter=month&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=in&filter=month&date=' + '2021-11')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN & FILTER BY SPECIFIC WEEK
test('GET /v1/data-item/:id?stock=in&filter=week&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=in&filter=week&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN & FILTER BY SPECIFIC DAY
test('GET /v1/data-item/:id?stock=in&filter=day&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=in&filter=day&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK OUT
test('GET /v1/data-item/:id?stock=out', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=out')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK OUT & FILTER BY SPECIFIC YEAR
test('GET /v1/data-item/:id?stock=out&filter=year&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=out&filter=year&date=' + '2021')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK OUT & FILTER BY SPECIFIC MONTH
test('GET /v1/data-item/:id?stock=out&filter=month&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=out&filter=month&date=' + '2021-11')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK OUT & FILTER BY SPECIFIC WEEK
test('GET /v1/data-item/:id?stock=out&filter=week&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=out&filter=week&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK OUT & FILTER BY SPECIFIC DAY
test('GET /v1/data-item/:id?stock=out&filter=day&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=out&filter=day&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN AND OUT
test('GET /v1/data-item/:id?stock=all', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=all')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN AND OUT & FILTER BY SPECIFIC YEAR
test('GET /v1/data-item/:id?stock=all&filter=year&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=all&filter=year&date=' + '2021')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN AND OUT & FILTER BY SPECIFIC MONTH
test('GET /v1/data-item/:id?stock=all&filter=month&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=all&filter=month&date=' + '2021-11')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN AND OUT & FILTER BY SPECIFIC WEEK
test('GET /v1/data-item/:id?stock=all&filter=week&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=all&filter=week&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//READ ONE DATA-ITEM WITH STOCK IN AND OUT & FILTER BY SPECIFIC DAY
test('GET /v1/data-item/:id?stock=all&filter=day&date=:date', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/' + 1 + '?stock=all&filter=day&date=' + '2021-11-12')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

//SEARCH DATA BY NAME
test('GET /v1/data-item?name=:name', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?name=' + "sa")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//SEARCH DATA BY NAME & CATEGORY
test('GET /v1/data-item?name=:name&category=:category', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?name=' + "sa" + "&category=" + "MCK")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//SEARCH DATA BY NAME & CATEGORY WITH FILTER
test('GET /v1/data-item?name=:name&category=:category&filter=:filter&min=:price&max=:price', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?name=' + "sa" + "&category=" + "MCK" + "&filter=price" + "&min=" + 1000 + "&max=" + 10000)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//SEARCH DATA BY NAME & CATEGORY WITH FILTER AND SORT BY HIGHEST
test('GET /v1/data-item?name=:name&category=:category&filter=:filter&min=:price&max=:price&sort=:sortby', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?name=' + "sa" + "&category=" + "MCK" + "&filter=price" + "&min=" + 1000 + "&max=" + 10000 + "&sort=" + "price")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA BY CATEGORY
test('GET /v1/data-item?category=:category', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?category=' + "MCK")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA BY CATEGORY WITH FILTER
test('GET /v1/data-item?category=:category&filter=:filter&min=:price&max=:price', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?category=' + "MCK" + "&filter=price" + "&min=" + 1000 + "&max=" + 10000)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA BY CATEGORY WITH FILTER AND SORT
test('GET /v1/data-item?category=:category&filter=:filter&min=:price&max=:price&sort=:sortby', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?category=' + "MCK" + "&filter=price" + "&min=" + 1000 + "&max=" + 10000 + "&sort=" + "price")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA
test('GET /v1/data-item', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item/')
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA WITH FILTER
test('GET /v1/data-item?filter=:filter&min=:price&max=:price', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item' + "?filter=" + "price" + "&min=" + 1000 + "&max=" + 10000)
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA WITH SORT
test('GET /v1/data-item?sort=:sortby', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item' + "?sort=" + "price")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

//GET ALL DATA WITH FILTER AND SORT
test('GET /v1/data-item?filter=:filter&min=:price&max=:price&sort=:sortby', async () => {
    const token = await supertest(app)
    .post("/v1/admin/login")
    .send({
        email : "fariz@glintsacademy.com",
        password : "glints_test"
    })

        await supertest(app)
        .get('/v1/data-item?' + "filter=" + "price" + "&min=" + 1000 + "&max=" + 10000 + "&sort=" + "price")
        .set("Authorization", "Bearer " + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});