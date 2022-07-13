const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
    //Validamos que antes se verifique el token para así poder acceder al req.usuario
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol antes de validar el token - validar token primero'
        });
    }

    //Validamos el rol
    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar esta acción`
        });
    }

    next();
}

const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol antes de validar el token - validar token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `Esta acción solo está permitida a usuarios con uno de estos roles: ${roles}`
            });
        }

        next();
    }
    
}
module.exports = {
    esAdminRole,
    tieneRol
}