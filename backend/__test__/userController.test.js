const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./../models/User')
const { generateToken } = require('./../middlewares/jwtGenerate')

describe('User controller testing', () => {
    const email = 'correo@test.com';
    const password = 'Contraseña_123'
    const token = generateToken('correo@test.com')

    beforeEach(async () => {
        await User.deleteMany({})
        console.log('beforeEach ejecutado')
    }, 10000)

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
        console.log('afterAll ejecutado y conexión cerrada')
    })

    it('Debería registrar un usuario nuevo si el correo no existe en la base de datos', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: password })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'User created successfully')
    })

    it('No debería registrar un usuario si el correo existe en la base de datos', async () => {
        await new User({
            email: email, 
            password: password
        }).save()

        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: password })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', `${email} has already been used`)
    })

    it('No debería registrar a un usuario nuevo si el campo email está vacio', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: null, password: password })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg.email.msg', "Email is not valid" )
    })

    it('No debería registrar un usuario nuevo si el campo email no es válido', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: 'notValid', password: password })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg.email.msg', "Email is not valid" )
    })

    it('No debería registrar un usuario nuevo si el campo password no cumple con los requisitos', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: 'notValid' })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg.password.msg', "Your password is not strong enough. It must contain at least one uppercase, lowercase, number and special character" )
    })

    it('Debería iniciar la sesión de un usuario', async () => {
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await new User({
            email: email, 
            password: hashedPassword
        })
        await user.save()

        const response = await request(app)
                .post('/api/login')
                .send({ email: user.email, password: password })

            expect(response.statusCode).toBe(200)
            expect(response.body).toHaveProperty('ok', true)
            expect(response.body).toHaveProperty('msg', `${user.email} Bienvenido`)
            expect(response.body).toHaveProperty('token')
    })

    it('No debería iniciar la sesión de un usuario que no está registrado', async () => {
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await new User({
            email: email, 
            password: hashedPassword
        })
        user.save()

        const response = await request(app)
            .post('/api/login')
            .send({ email: 'correoErroneo@test.com', password: password })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', "User doesn't exist")
    })

    it('No debería iniciar la sesión de un usuario si la contraseña es incorrecta', async () => {
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await new User({
            email: email, 
            password: hashedPassword
        }).save()

        const response = await request(app)
            .post('/api/login')
            .send({ email: email, password: 'ContraseñaErronea_123' })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', "Incorrect password")
    })

    it('Debería retornar un error de servidor al hacer el inicio de sesión', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Simulando error en base de datos')
        })

        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: password })

        expect(response.statusCode).toBe(500)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', "Please contact our support")
    })

    it('Debería traer la información de un usuario si se llama por ID', async () => {
        const user = await new User({
            email: email, 
            password: password
        }).save()

        const response = await request(app)
            .get(`/api/data/${user._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg')
        console.log(response.body.msg)
    })

    it('No debería traer la información de un usuario si el ID no exíste en la base de datos', async () => {
        const id = new mongoose.Types.ObjectId()

        const response = await request(app)
            .get(`/api/data/${id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'User not found')
    })

    it('Debería actualizar los datos de un usuario', async () => {
        const user = await new User({
            email: email, 
            password: password
        }).save()

        const response = await request(app)
            .put(`/api/update-data/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Nombre', lastName: 'Apellido' })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Data updated successfully')
    })

    it('No debería traer actualizar los datos de un usuario si el ID no exíste en la base de datos', async () => {
        const id = new mongoose.Types.ObjectId()

        const response = await request(app)
            .put(`/api/update-data/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Nombre', lastName: 'Apellido' })

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'Data not found')
    })

    it('Debería eliminar un usuario por ID', async () => {
        const user = await new User({
            email: email, 
            password: password
        }).save()

        const response = await request(app)
            .delete(`/api/delete-data/${user._id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('ok', true)
        expect(response.body).toHaveProperty('msg', 'Data deleted successfully') 
    })

    it('No debería eliminar un usuario por ID si no existe en la base de datos', async () => {
        const id = new mongoose.Types.ObjectId()

        const response = await request(app)
            .delete(`/api/delete-data/${id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(404)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'Data not found')
    })
})