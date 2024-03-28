const router = require('express').Router();

const api_router = require('./api-route');
const admin_route = require('./admin-route');

router.use('/api/v1/cars', api_router);
router.use('/admin/cars/list-car', admin_route);

module.exports = router;
