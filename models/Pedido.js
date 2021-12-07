const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    //pedido
    order: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    //estado
    estate: {
        type: String,
        default: "PENDIENTE"
    },
    //creado
    create: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Pedido', ProductoSchema);