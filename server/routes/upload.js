const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));



app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    let validExtension = ['png', 'jpg', 'jpg', 'jpeg'];
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido. Los tipos permitidos son: ' + validTypes.join(', ')
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let newFile = req.files.file;
    let archiveName = newFile.name.split('.');
    let extension = archiveName[archiveName.length - 1].toLowerCase();



    if (validExtension.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no valido. Las extensiones permitidas son: ' + validExtension.join(', ')
            }
        });
    }

    let newFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    newFile.mv(`uploads/${type}/${newFileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (type === 'users') {
            imageUser(id, res, newFileName);
        } else {
            imageProduct(id, res, newFileName);
        }

    });

});


function imageUser(id, res, newFileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(newFileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(newFileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = newFileName;

        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                userSaved,
                img: newFileName
            });
        });
    });
}

function imageProduct(id, res, newFileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(newFileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(newFileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = newFileName;

        productDB.save((err, productSaved) => {
            res.json({
                ok: true,
                productSaved,
                img: newFileName
            });
        });
    });
}

function deleteFile(nameImg, type) {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;