const express = require('express');
const TypeQuestion = require('../models/type-question');
const router = express.Router();

const mongoose = require('mongoose');

router.get('/', (req,res, next) => {
    TypeQuestion.find()
        .select('_id name')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                types: docs.map(q => {
                    return {
                        name: q.name,
                        _id: q._id,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/type-questions/'+q._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


router.post('/', (req, res, next) => {

    const product = new TypeQuestion({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'question object was created',
                created: {
                    _id: result._id,
                    name: result.name,
                    request: {
                        type: 'GET',
                        url: 'http:localhost:3000/type-questions/' + result._id
                    }
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err }); 
        });
});



router.delete('/:typeId', (req, res, next) => {
    const id = req.params.typeId;
    TypeQuestion
        .remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'question deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/type-questions',
                    body : { name:'String' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err }); 
        });
});

module.exports = router;