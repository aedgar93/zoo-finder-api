const animal = require('./animal')
const zoo = require('./zoo')
module.exports = (router) => {
    animal(router)
    zoo(router)
}
