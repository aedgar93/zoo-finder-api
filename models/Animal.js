const mongoose = require('mongoose')
const ZooSchema = require('./Zoo')

let AnimalSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    zoos: [{type: mongoose.Schema.ObjectId, ref: 'Zoo'}]

}, {
    timestamps: true
})

AnimalSchema.methods.addZoo = function(zoo_id) {
    this.zoos.addToSet(zoo_id)
    return this.save()
}

AnimalSchema.methods.addZoos = function(zoo_ids) {
    this.zoos.addToSet(zoo_ids)
    return this.save()
}

module.exports = mongoose.model('Animal', AnimalSchema)
