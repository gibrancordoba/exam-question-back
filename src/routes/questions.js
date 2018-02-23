const express = require('express');
const Question = require('../models/questions');
const router = express.Router();

const mongoose = require('mongoose');

router.get('/', (req,res, next) => {
    Question.find()
        .select('_id title description type options')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                questions: docs.map(q => {
                    return {
                        title: q.title,
                        description: q.description,
                        type: q.type,
                        options: q.options,
                        _id: q._id,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/questions/'+q._id
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

    const product = new Question({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        type: req.body.typeId,
        options: req.body.options
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'question object was created',
                created: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    type: result.type,
                    options: result.options,
                    request: {
                        type: 'GET',
                        url: 'http:localhost:3000/questions/' + result._id
                    }
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({ error: err }); 
        });
});

router.get('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.findById(id)
        .select('_id title description type options')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({message: 'object not found'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err}); 
        });
});

router.patch('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Question
        .update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(deleted);
            res.status(200).json({
                message: 'Question updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/questions/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question
        .remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'question deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/questions',
                    body : { title:'String', description: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err }); 
        });
});

module.exports = router;