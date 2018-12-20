const zooController = require('./../controllers/zoo.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {
    /**
     * Get all zoos.
     */
    router.route('/zoos')
    .get(zooController.getAll)

    /**
     * add an zoo
     */
    router.route('/zoo')
    .post(multipartWare, zooController.addZoo)

    /**
     * get a single zoo
     */
    router.route('/zoo/:id')
    .get(zooController.getZoo)
}
