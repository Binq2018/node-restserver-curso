const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

//===============================
// Mostrar todas las categorias
//===============================
app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else {

                return res.json({
                    ok: true,
                    categorias
                });
            }
        });
});

//===============================
// Mostrar una categorias por ID
//===============================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            } else {

                return res.json({
                    ok: true,
                    categoria: categoriaDB
                });
            }

        }

    });

});

//===============================
// Crea nueva categoria
//===============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                return res.json({
                    ok: true,
                    categoria: categoriaDB
                });
            }
        }
    });

});

//===============================
// Actualizar categoria
//===============================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                return res.json({
                    ok: true,
                    categoria: categoriaDB
                });
            }
        }
    });
});

//===============================
// Borrar categoria
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            if (!categoriaBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'categoria no encontrado'
                    }
                });
            } else {

                return res.json({
                    ok: true,
                    message: 'Categoria Borrada'
                });
            }
        }
    });
});

module.exports = app;