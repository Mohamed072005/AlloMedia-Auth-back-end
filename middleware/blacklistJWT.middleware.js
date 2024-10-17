const { findBlacklistedJWT } = require('../repositorys/jwt_blacklist.repository');

exports.isThisBlacklisterJWT = async (req, res, next) => {
    try{
        const authorization = req.headers.authorization;
        if(!authorization || authorization === ''){
            const error = new Error('No jwt token provided');
            error.status = 401;
            throw error
        }
        const token = await findBlacklistedJWT(authorization);
        if(token){
            const error = new Error('You are not authorized');
            error.status = 401;
            throw error
        }
        next()
    }catch(err){
        if(err.status === 401){
            return res.status(401).json({message: err.message})
        }
        return res.status(500).json({
            error: err,
            message: 'server error'
        })
    }
}