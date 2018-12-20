const mongoose = require('mongoose')
const AnimalSchema = require('./Animal')

let ZooSchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: [Number],
    animals: [{type: mongoose.Schema.ObjectId, ref: 'Animal'}]

}, {
    timestamps: true
})

ZooSchema.methods.addAnimal = function(animal_id) {
    this.animals.addToSet(animal_id)
    return this.save()
}

ZooSchema.methods.addAnimals = function(animal_ids) {
    this.animals.addToSet(animal_ids)
    return this.save()
}

module.exports = mongoose.model('Zoo', ZooSchema)
