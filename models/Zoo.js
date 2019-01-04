const mongoose = require('mongoose')
const AnimalSchema = require('./Animal')

let ZooSchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: [Number],
    animals: [{type: mongoose.Schema.ObjectId, ref: 'Animal'}]

}, {
    timestamps: true
})

ZooSchema.virtual('animal_objects', {
    ref: 'Animal',
    localField: 'animals',
    foreignField: '_id'
});

ZooSchema.set('toObject', { virtuals: true });
ZooSchema.set('toJSON', { virtuals: true });


ZooSchema.methods.addAnimal = function(animal_id) {
    this.animals.addToSet(animal_id)
    return this.save()
}

ZooSchema.methods.addAnimals = function(animal_ids) {
    this.animals.addToSet(animal_ids)
    return this.save()
}

module.exports = mongoose.model('Zoo', ZooSchema)
