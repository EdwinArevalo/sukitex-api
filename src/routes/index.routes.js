const router = require('express').Router(); 

router.route('/')
    .get((req,res) => {
        return res.json({ msg: 'welcome to Sukitex API', status: 200});
    }); 

router.route('/products')
    .get((req,res) => {
        return res.json({ });
    }); 

router.route('/materials')
    .get((req,res) => {
        return res.json({ });
    }); 

router.route('/warehouses')
    .get((req,res) => {
        return res.json({ });
    });

router.route('/clients')
    .get((req,res) => {
        return res.json({ });
    });

router.route('/providers')
    .get((req,res) => {
        return res.json({ });
    });

router.route('/users')
    .get((req,res) => {
        return res.json({ });
    });

module.exports = router;