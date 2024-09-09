
let express = require('express');
let router = express.Router();
 
const empleado = require('../controllers/controller.empleado.js');

router.post('/empleado/create', empleado.create);
router.get('/empleado/all', empleado.retrieveAllEmpleados);
router.get('/empleado/onebyid/:id', empleado.getEmpleadoById);
router.put('/empleado/update/:id', empleado.updateById);
router.delete('/empleado/delete/:id', empleado.deleteById);

router.get('/test', (req, res) => {
    res.send('Ruta de prueba funcionando');
});


module.exports = router;

