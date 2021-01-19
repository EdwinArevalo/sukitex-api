const request = require('supertest');
const App = require('../app');
const app = new App(3000).app;
/**
 * Testing Sukitex API
 */
describe('GET -> /clients', () => {
    it('se espera una respuesta Json que contiene la lista de clientes', done => {
        request(app)
            .get('/clients')
            .set('Accept','application/json')
            .expect('Content-Type',/json/)
            .expect(200,done);
     } )
})

// describe('GET -> /providers', () => {
    // it('se espera una respuesta Json que contiene la lista de proveedores', done => {
        // request(app)
            // .get('/providers')
            // .set('Accept','application/json')
            // .expect('Content-Type',/json/)
            // .expect(200,done);
    // } )
// })

// describe('GET -> /users', () => {
//     it('se espera una respuesta Json que contiene la lista de usuarios', done => {
//         request(app)
//             .get('/users')
//             .set('Accept','application/json')
//             .expect('Content-Type',/json/)
//             .expect(200,done);
//     } )
// })

//  describe('GET -> /materials', () => {
//     it('se espera una respuesta Json que contiene la lista de materiales', done => {
//         request(app)
//             .get('/materials')
//             .set('Accept','application/json')
//             .expect('Content-Type',/json/)
//             .expect(200,done);
//     } )
// })
// describe('GET -> /products', () => {
//     it('se espera una respuesta Json que contiene la lista de productos', done => {
//         request(app)
//             .get('/products')
//             .set('Accept','application/json')
//             .expect('Content-Type',/json/)
//             .expect(200,done);
//     } )
// })

// describe('GET -> /warehouses/', () => {
//     it('se espera una respuesta Json que contiene la lista de almacenes', done => {
//         request(app)
//             .get('/warehouses')
//             .set('Accept','application/json')
//             .expect('Content-Type',/json/)
//             .expect(200,done);
//     } )
// })





