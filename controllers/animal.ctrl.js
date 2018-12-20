const Animal = require('./../models/Animal')
const Zoo = require('./../models/Zoo')

module.exports = {
    addAnimal: (req, res, next) => {
        let { name, scientific_name, zoo_ids } = req.body
        if (!name || !scientific_name) {
            res.status(400).send("Name and Scientific Name are required")
            return next()
        }

        new Animal({name, scientific_name}).save((err, animal) => {
            if (err)  { res.send(err) }
            else if (!animal) { res.send(400) }
            else if(zoo_ids) {
                return animal.addZoos(zoo_ids).then(_animal => {
                    return res.send(_animal)
                })
            } else {
                return res.send(animal)
            }
            next()
        })
    },
    getAll: (_req, res, next) => {
        Animal.find()
        .populate('zoos')
        .exec((err, animals) => {
            if (err) res.send(err)
            else if(!animals) res.send(404)
            else res.send(animals)
            next()
        })
    },
    getAnimal: (req, res, next) => {
        Animal.findById(req.params.id)
        .populate('zoos')
        .exec((err, animal) => {
            if (err) res.send(err)
            else if (!animal) res.send(404)
            else res.send(animal)
            next()
        })
    },
    addZoo: (req, res, next) => {
        Promise.all([
            Animal.findById(req.params.animal_id).then(animal => {
                return animal.addZoo(req.params.zoo_id)
            }),
            Zoo.findById(req.params.zoo_id).then(zoo => {
                return zoo.addAnimal(req.params.animal_id)
            })
        ])
        .then(_ => res.json({ msg: "Done" }))
        .catch(next)
    },
    deleteAnimal: (req, res, next) => {
        var id = req.params.id
        Promise.all([
            Animal.deleteOne({ "_id": id }),
            Zoo.update(
                { animals : id} ,
                { "$pull" : { "animals" : id } } ,
                { "multi" : true }
            )
        ])
        .then(_ => res.json({ msg: "Done" }))
        .catch(next)
    }
}
