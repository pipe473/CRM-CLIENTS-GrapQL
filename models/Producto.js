const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    // existencia
    stock: {
        type: Number,
        required: true,        
        trim: true
    },
    // precio
    price: {
        type: Number,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Producto', ProductSchema);