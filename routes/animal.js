const animalController = require('./../controllers/animal.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()
module.exports = (router) => {
    /**
     * Get all animals.
     */
    router.route('/animals')
    .get(animalController.getAll)

    /**
     * add an animal
     */
    router.route('/animal')
    .post(multipartWare, animalController.addAnimal)

    /**
     * get a single animal
     */
    router.route('/animal/:id')
    .get(animalController.getAnimal)

    /**
     * delete an animal
     */
    router.route('/animal/:id')
    .delete(animalController.deleteAnimal)


    /**
     * add a zoo to an animal
     */
    router.route('/animal/:animal_id/zoo/:zoo_id')
    .post(animalController.addZoo)
}
