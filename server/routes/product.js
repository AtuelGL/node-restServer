const express = require('express');

const { verifyToken } = require('../middlewares/auth');

app = express();

let Product = require('../models/product');

// SEARCH PRODUCTS
app.get('/products/search/:path', verifyToken, (req, res) => {
    let path = req.params.path;
    let regex = new RegExp(path, 'i')

    Product.find({ name: regex })
        .populate('category', 'desc')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                products
            });
        });

});

// GET ALL
app.get('/products', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ available: true })
        .populate('user', 'name email')
        .populate('category', 'desc')
        .skip(from)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                });
            });

        });
});

// GET BY ID
app.get('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'desc')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                products
            });
        });

});

// CREATE 
app.post('/products', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        price: body.price,
        desc: body.desc,
        available: true,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: productDB
        });
    });



    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            msj: 'The name is necesary'
        });
    } else {
        //  res.json({ body });
    }
});

// UPDATE
app.put('/products/:id', verifyToken, (req, res) => {
    // actualizar producto
    let id = req.params.id;
    let body = req.body;

    let changeProduct = {
        name: body.name,
        price: body.price,
        desc: body.desc,
        category: body.category,
        user: req.user._id
    };

    Product.findByIdAndUpdate(id, changeProduct, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productDB
        });
    });
});


//DELETE
app.delete('/products/:id', verifyToken, (req, res) => {
    // cambiar el estado de available
    let id = req.params.id;
    let body = req.body;

    let changeAvailable = {
        available: false
    };

    Product.findByIdAndUpdate(id, changeAvailable, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productDB
        });
    });
});

module.exports = app;