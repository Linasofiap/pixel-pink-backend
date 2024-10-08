const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]
    try {
        if(!token) return res.status(401).json({
            ok: false, 
            msg: 'User is not authorized'
        })
        const secret = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false, 
            msg: 'Please contact our support'
        })
    }
}

module.exports = { validateToken }