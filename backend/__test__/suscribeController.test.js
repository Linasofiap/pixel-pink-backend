const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const Suscriber = require('./../models/Suscribe')

describe('Subscriber controller testing', () => {
    const email = 'correo@test.com'
    const name = 'Nombre'

    beforeEach(async () => {
        await Suscriber.deleteMany({})
        console.log('beforeEach ejecutado')
    }, 10000)

    afterAll(async () => {
        await Suscriber.deleteMany({})
        await mongoose.connection.close()
        console.log('afterAll ejecutado y conexión cerrada')
    })

    it('Debería suscribir un usuario nuevo si el correo no existe en la base de datos', async () => {
        const response = await request(app)
            .post('/api/suscribe')
            .send({ name: name, email: email })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'User suscribed successfully')
    })

    it('No debería registrar un usuario si el correo existe en la base de datos', async () => {
        await new Suscriber({
            email: 'correo@test.com',
            name: 'Nombre'
        }).save()

        const response = await request(app)
            .post('/api/suscribe')
            .send({ name: name, email: email })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', `${email} has already been used`)
    })

    it('Debería traer todos usuarios suscritos', async () => {
        const response = await request(app)
            .get('/api/find-suscribers')

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Suscribers found')
    })

    it('Debería eliminar un usuario suscrito si lo encuentra por su correo', async () => {
        await new Suscriber({
            email: 'correo@test.com',
            name: 'Nombre'
        }).save()

        const response = await request(app)
            .delete('/api/delete-suscribtion')
            .send({ email: 'correo@test.com' })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'The user has been successfully removed from our subscription') 
    })

    it('No debería eliminar un usuario suscrito si no lo encuentra por su correo', async () => {
        const response = await request(app)
            .delete('/api/delete-suscribtion')
            .send({ email })

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', `${email} is not subscribed`)
    })

    it('Debería retornar un error de servidor al hacer la suscripción', async () => {
        jest.spyOn(Suscriber, 'findOne').mockImplementationOnce(() => {
            throw new Error('Simulando error en base de datos')
        })

        const response = await request(app)
            .post('/api/suscribe')
            .send({ name: name, email: email })

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', "Please contact our support")
    })
})