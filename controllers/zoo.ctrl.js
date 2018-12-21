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
                    return Animal.findOne({name}).then(animal => {
                        if (!animal) return new Animal({name}).save((err, animal) => {
                            return zoo.addAnimal(animal.id)
                        })
                        return zoo.addAnimal(animal.id)
                    })
                })).then(_result => {
                    res.send('Done')
                    next()
                }).catch(error => {
                    res.send(error)
                    next()
                })
            }
        })
    }
}
