const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middlewares/auth');

let app = express();

let Category = require('../models/category');

// get categorías
app.get('/category', verifyToken, (req, res) => {
    Category.find()
        .sort('desc')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Category.countDocuments((err, count) => {
                res.json({
                    ok: true,
                    categories,
                    count
                });
            });

        });
});

// get categoría por id
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoryDB
        });
    });
});

// Crear categorías
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        desc: body.desc,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // userDB.passwd = ':D'

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Actualizar categoría por id
app.put('/category/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let changeCategory = {
        desc: body.desc
    }

    Category.findByIdAndUpdate(id, changeCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Borrar categoría por id
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryRemoved
        });
    });
});



module.exports = app;