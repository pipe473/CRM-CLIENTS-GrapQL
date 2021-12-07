const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
   order: {
       type: Array,
       required: true
   },
   total: {
       type: Number,
       required: true
   },
   cliente: {
       type: mongoose.SchemaType.ObjectId,
       required: true,
       ref: 'Cliente'
   },
   vendedor: {
       type: mongoose.SchemaType.ObjectId,
       required: true,
       ref: 'Usuario'
   },
   estate:{
       type: String,
       default: "PENDING"
   },
   create: {
       type: Date,
       default: Date.now()
   }
});

module.exports = mongoose.model('Order', OrderSchema);