const User = require('./../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('./../middlewares/jwtGenerate')

const createUser = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email });
        if(user) return res.status(400).json({
            ok: false,
            msg: `${email} has already been used`
        })

        const salt = bcrypt.genSaltSync()
        const dbUser = new User({
            email: email,
            password: password
        })
        dbUser.password = bcrypt.hashSync( password, salt )
        await dbUser.save()

        return res.status(201).json({

            ok: true,
            msg: 'User created successfully'
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const dbUser = await User.findOne ({ email });
        if(!dbUser) return res.status(400).json({
            ok: false,
            msg: "User doesn't exist"
        })
        const validatePassword = bcrypt.compareSync(password, dbUser.password)
        if(!validatePassword) return res.status(400).json({
            ok: false,
            msg: "Incorrect password"
        })
        const token = await generateToken(dbUser._id, dbUser.email)

        return res.status(200).json({
            id: dbUser._id,
            ok: true,
            msg: `${dbUser.email} Bienvenido`,
            token: token
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
        })
    }
}

const getDataById = async(req, res) => {
    const {id} = req.params
    try{
        const userData = await User.findById({ _id: id });
        if(userData){
            return res.status(200).json({
                ok: true,
                msg: userData
            })
        }
        return res.status(404).json({
            ok: false,
            msg: 'User not found'
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg: 'Please contact our support'
        })
    }
}

const updateUserData = async(req, res) => {
    const { name, lastName, phone, state, city, address, detail, observations } = req.body;
    const { id } = req.params;
    
    try {
        const updatedData = {};
        if (name) updatedData.name = name;
        if (lastName) updatedData.lastName = lastName;
        if (phone) updatedData.phone = phone;
        if (state) updatedData.state = state;
        if (city) updatedData.city = city;
        if (address) updatedData.address = address;
        if (detail) updatedData.detail = detail;
        if (observations) updatedData.observations = observations;
        
        const userData = await User.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!userData) return res.status(404).json({
            ok: false,
            msg: 'Data not found'
        });

        return res.status(200).json({
            ok: true,
            msg: 'Data updated successfully',
            data: User
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
        });
    }
}

const deleteUserData = async(req, res) => {
    const { id } = req.params;
    try {
        const dbUserData = await User.findByIdAndDelete(id);
        if (dbUserData) {
            return res.status(200).json({
                ok: true,
                msg: 'Data deleted successfully'
            });
        }

        return res.status(404).json({
            ok: false,
            msg: 'Data not found'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
        });
    }
}

module.exports = {
    createUser,
    loginUser,
    getDataById,
    updateUserData,
    deleteUserData
}
