const jwt = require('jsonwebtoken')


// =================
//  Verificar Token
// =================

let verifyToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
        next();
    });
};

let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no permitido'
            }
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdminRole
};