const Animal = require('./../models/Animal')
const Zoo = require('./../models/Zoo')

module.exports = {
    addAnimal: (req, res, next) => {
        let { name, zoo_ids } = req.body
        if (!name ) {
            res.status(400).send("Name is required")
            return next()
        }
        Animal.find({name}).then(existingAnimal => {
            if (existingAnimal.length > 0) {
                res.status(400).send("Animal already exists")
                return next()
            }
            new Animal({name}).save((err, animal) => {
                if (err)  { res.send(err) }
                else if (!animal) { res.send(400) }
                else if(zoo_ids) {
                    return Zoo.update(
                        { "_id" : { "$in": zoo_ids }} ,
                        { "$addToSet" : { "animals" : animal.id } } ,
                        { "multi" : true }
                    ).then(_ => {
                        return animal.addZoos(zoo_ids).then(_animal => {
                            return res.send(_animal)
                        })
                    })
                } else {
                    return res.send(animal)
                }
                next()
            })
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
