const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const Product = require('./../models/Product')
const { generateToken } = require('./../middlewares/jwtGenerate')

describe('Product controller testing', () => {
    const name = 'Nombre';
    const price = 123;
    const description = 'Descripción';
    const clotheCollection = 'Colección';
    const category = 'Categoría';
    const available= true;
    const imgA = '1';
    const imgB = '2';
    const imgC = '3'
    const token = generateToken('correo@test.com')

    beforeEach(async () => {
        await Product.deleteMany({})
        console.log('beforeEach ejecutado')
    }, 10000)

    afterAll(async () => {
        await Product.deleteMany({})
        await mongoose.connection.close()
        console.log('afterAll ejecutado y conexión cerrada')
    })

    it('Debería crear un nuevo producto', async () => {        
        const response = await request(app)
            .post('/api/new-product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: name, price: price, description: description, clotheCollection: clotheCollection, category: category, available: available, imgA: imgA, imgB: imgB, imgC: imgC })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Product created successfully')
    })

    it('No debería crear un nuevo producto si falta algún dato', async () => {
        const response = await request(app)
            .post('/api/new-product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: name })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'All fields are required')
    })

    it('No debería crear un producto si ya hay uno creado en base de datos con el mismo nombre', async () => {
        await new Product({
            name: 'Nombre',
            price: 123,
            description: 'Descripción',
            clotheCollection: 'Colección',
            category: 'Categoría',
            available: true,
            imgA: '1',
            imgB: '2',
            imgC: '3'
        }).save()

        const response = await request(app)
            .post('/api/new-product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: name, price: price, description: description, clotheCollection: clotheCollection, category: category, available: available, imgA: imgA, imgB: imgB, imgC: imgC })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', `Product with name ${name} has already been created`)
    })

    it('Debería actualizar un producto por ID', async () => {
        const producto = await new Product({
            name: 'Nombre',
            price: 123,
            description: 'Descripción',
            clotheCollection: 'Colección',
            category: 'Categoría',
            available: true,
            imgA: '1',
            imgB: '2',
            imgC: '3'
        }).save()

        const response = await request(app)
            .put(`/api/update-product/${producto._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Nuevo Nombre', price: 456 })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Product updated successfully')
    })

    it('Debería traer un producto por ID', async () => {
        const producto = await new Product({
            name: 'Nombre',
            price: 123,
            description: 'Descripción',
            clotheCollection: 'Colección',
            category: 'Categoría',
            available: true,
            imgA: '1',
            imgB: '2',
            imgC: '3'
        }).save()

        const response = await request(app)
            .get(`/api/get-product/${producto._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg')
    })

    it('No debería traer un producto si el ID no exíste en la base de datos', async () => {
        const id = new mongoose.Types.ObjectId()

        const response = await request(app)
            .get(`/api/get-product/${id}`)

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'Product not found')
    })

    it('Debería traer un producto por colección', async () => {
        const producto = await new Product({
            name: 'Nombre',
            price: 123,
            description: 'Descripción',
            clotheCollection: 'Colección',
            category: 'Categoría',
            available: true,
            imgA: '1',
            imgB: '2',
            imgC: '3'
        }).save()

        const response = await request(app)
            .get(`/api/get-collection/${producto.clotheCollection}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg')
    })

    // it('No debería traer un producto si la colección no exíste en la base de datos', async () => {
    //     const NotAClotheCollection = ''

    //     const response = await request(app)
    //         .get(`/api/get-collection/${NotAClotheCollection}`)

    //     expect(response.statusCode).toBe(404)
    //     expect(response.body).toHaveProperty('ok', false)
    //     expect(response.body).toHaveProperty('msg', 'Product not found')
    // })

    it('Debería traer un producto por categoría', async () => {
        const producto = await new Product({
            name: 'Nombre',
            price: 123,
            description: 'Descripción',
            clotheCollection: 'Colección',
            category: 'Categoría',
            available: true,
            imgA: '1',
            imgB: '2',
            imgC: '3'
        }).save()

        const response = await request(app)
            .get(`/api/get-category/${producto.category}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg')
    })
    
    it('Debería traer todos los productos', async () => {
        const response = await request(app)
        .get('/api/get-all-products')

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'products found')
    })
    
    it('Deberia eliminar un producto por ID', async () => {
        const producto = await new Product({
                name: 'Nombre',
                price: 123,
                description: 'Descripción',
                clotheCollection: 'Colección',
                category: 'Categoría',
                available: true,
                imgA: '1',
                imgB: '2',
                imgC: '3'
            }).save()

        const response = await request(app)
            .delete(`/api/delete-product/${producto._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Product deleted successfully') 
    })

})