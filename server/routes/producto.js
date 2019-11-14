const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto.js');

//===============================
// Obtener productos
//===============================
app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });
        });
});

//===============================
// Obtener productos por ID
//===============================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    // paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });
});

//===============================
// Buscar productos
//===============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });

        });
});

//===============================
// Crear productos
//===============================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        descripcion: body.descripcion,
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//===============================
// Actualizar productos
//===============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.descripcion = body.descripcion;
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoGuardado
            });

        });
    });
});

//===============================
// Borrar productos
//===============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            });
        });

    });
});


module.exports = app;