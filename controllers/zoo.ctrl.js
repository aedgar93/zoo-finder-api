const Zoo = require('./../models/Zoo')
const Animal = require('./../models/Animal')

module.exports = {
    addZoo: (req, res, next) => {
        let { name, location } = req.body
        if (!name) {
            res.status(400).send("Name is required")
            return next()
        }

        new Zoo({name, location}).save((err, zoo) => {
            if (err)  { res.send(err) }
            else if (!zoo) { res.send(400) }
            else {
                return res.send(zoo)
            }
            next()
        })
    },
    getAll: (_req, res, next) => {
        Zoo.find()
        .populate('animals')
        .exec((err, zoos) => {
            if (err) res.send(err)
            else if(!zoos) res.send(404)
            else res.send(zoos)
            next()
        })
    },
    getZoo: (req, res, next) => {
        Zoo.findById(req.params.id)
        .populate('animals')
        .exec((err, zoo) => {
            if (err) res.send(err)
            else if (!zoo) res.send(404)
            else res.send(zoo)
            next()
        })
    },
    populateZoo: (req, res, next) => {
        let { animal_names } = req.body
        Zoo.findById(req.params.id)
        .then(zoo => {
            if (!zoo) {
                res.send(404)
                next()
            }
            else {
                Promise.all(animal_names.map(name => {
                    name = name.toLowerCase()
                    return Animal.findOne({name}).then(animal => {
                        if (!animal) return new Animal({name}).save((_err, animal) => {
                            return addAnimal(zoo, animal)
                        })
                        return addAnimal(zoo, animal)
                    })
                })).then(_result => {
                    zoo.save()
                    res.send('Done')
                    next()
                }).catch(error => {
                    res.send(error)
                    next()
                })
            }
        })

        function addAnimal(zoo, animal) {
            return Promise.all([
                zoo.animals.addToSet(animal.id),
                animal.addZoo(zoo.id)
            ])
        }
    },
    deleteZoo: (req, res, next) => {
        var id = req.params.id
        Promise.all([
            Zoo.deleteOne({ "_id": id }),
            Animal.update(
                { zoos : id} ,
                { "$pull" : { "zoos" : id } } ,
                { "multi" : true }
            )
        ])
        .then(_ => res.json({ msg: "Done" }))
        .catch(next)
    }
}
