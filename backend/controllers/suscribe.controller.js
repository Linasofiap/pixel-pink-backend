const Suscriber = require('./../models/Suscribe')

const suscribeUser = async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = await Suscriber.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: `${email} has already been used`
            });
        }

        const dbUserSuscribed = new Suscriber({
            name: name,
            email: email
        });
        await dbUserSuscribed.save();

        return res.status(201).json({
            ok: true,
            msg: 'User suscribed successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
        });
    }
}

const findAllSuscribedUsers = async(req, res) => {
    try {
        const suscribers = await Suscriber.find();
        return res.status(200).json({
            ok: true,
            msg: 'Suscribers found',
            suscribers: suscribers
        })
    } catch {
        console.log(error) 
        return res.status(500).json({
            ok: false,
            msg: 'Please contact our support'
    })
    }
}

const deleteSuscribedUser = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await Suscriber.findOneAndDelete({ email: email });
        if (user) {
            return res.status(200).json({
                ok: true,
                msg: 'The user has been successfully removed from our subscription'
            });
        }

        return res.status(404).json({
            ok: false,
            msg: `${email} is not subscribed`
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
    suscribeUser,
    findAllSuscribedUsers,
    deleteSuscribedUser
}