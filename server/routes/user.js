const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const User = require('../models/user');


const app = express();


app.get('/user', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email img state role google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            User.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                });
            });

        });
});

app.post('/user', (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        passwd: bcrypt.hashSync(body.passwd, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // userDB.passwd = ':D'

        res.json({
            ok: true,
            user: userDB
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

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});


app.delete('/user/:id', (req, res) => {
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {

    let changeState = {
        state: false
    }
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };
        res.json({
            ok: true,
            user: userDeleted
        });
    });





});


module.exports = app;