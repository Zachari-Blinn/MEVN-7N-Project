const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * 
 * @param {email, password} req 
 * @param {*} res 
 */
exports.user_register = async (req, res) => {
    try {
        await User.findOne({email: req.body.email}, function (err, user) {
            if(err){
                console.log(err);
            }

            if(!user){
                bcrypt.hash(req.body.password, 10).then(cryptedPassword => {
                    req.body.password = cryptedPassword;
                    req.body.isActive = true;

                    User.create(req.body).then(
                        (message) => {
                            res.status(201).json({
                                message: message
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(500).json({
                                error: error
                            });
                        }
                    );

                })
            } else {
                return res.status(400).json({
                    error: "User already existing"
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {email, password} req 
 * @param {*} res 
 */
exports.user_login = async (req, res) => {
    try {
        await User.findOne({email: req.body.email}, function (err, user) {
            if(err){
                console.log(err);
            }

            if(user) {
                if(await bcrypt.compare(req.body.password, user.password)){
                    res.status(200).send({
                        user: user,
                        message: "authentication is successful"
                    });
                } else {
                    res.status(404).send({
                        user: null,
                        message: "Authentication failed"
                    })
                }
            } else {
                res.status(404).json({
                    error: "User does not exist"
                });
            }
        })    
    } catch (error) {
        console.log(error);
        res.status(500).send("Error on the server");
    }
}

