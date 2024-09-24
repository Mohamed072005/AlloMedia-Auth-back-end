const { register } = require('../services/user.services');
const { getUsers } = require('../repositorys/user.repository')

exports.register = async (req, res) => {
    const userData = req.body;
    try{
        const newUser = await register(userData);

        return res.status(200).json({
            message: "registered",
            user: newUser
        })
    }catch(error){
        if(error.message === 'user already exists'){
            return res.status(409).json({
                errorMessage: error.message
            })
        }

        return res.status(500).json(error);
    }
}

exports.getUsers = async (req, res) => {
    const response = await getUsers();
    return res.status(200).json(response);
}