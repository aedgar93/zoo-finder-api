const Zoo = require('./../models/Zoo')

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
    }
}
