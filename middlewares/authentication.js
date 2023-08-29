require('dotenv').config()
const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        
        if(authorization === undefined){
            res.status(400).json({message: 'Unauthorized'})
        } else {
            const token = authorization.split(' ')[1] // untuk memisahkan 'Bearer'
            const decoded = jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
                if (error) {
                    res.status(404).json({message : 'Wrong Token || Invalid Signature'})
                } else {
                    req.userLogged = {
                        id: data.id,
                        username: data.username
                    }
                    next()
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = authentication