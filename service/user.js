'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize) {
    const 
        User = sequelize.import("../model/user"),
        Creds = sequelize.import("../model/creds"),
        Skill = sequelize.import("../model/skill"),
        JctUserSkill = sequelize.import("../model/jctUserSkill");
        
    User.hasOne(Creds);
    Creds.belongsTo(User);
    
    User.belongsToMany(Skill, {
        foreignKey: "idUser",
        through: {
          model: JctUserSkill
        }
      });
    
      Skill.belongsToMany(User, {
        foreignKey: "idSkill",
        through: {
          model: JctUserSkill
        }
      });
        
    return {
        create: function (req, res) {
            User.findOne({
              where: { username: req.body.username }}).then(function(user) {
                if(user) {
                    return res.status(409).json({error: 'Conflict', message: 'invalid credentials'}); 
                }
                var newUser = {
                    nameLast: req.body.nameLast,
                    nameFirst: req.body.nameFirst,
                    username: req.body.username,
                    email: req.body.email,
                    cell: req.body.cell,
                    idTitle: req.body.idTitle
                };
                User.create(newUser).then(function(user) {
                    bcrypt.genSalt(10, function(err, salt) {
                        if(err) throw err;
                        bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                            if(err) throw err;
                            Creds.create({
                                idUser: user.id, 
                                hash: hash, 
                                salt: salt
                            }).then(function() {
                                res.send(user);
                            });
                        });
                    });
                });
                
            });
        },
        get: function (req, res) {
            User.findAll().then(function (users) {
                res.json(users);
            });
        },
        getOne: function (req, res) {
            User.findById(req.params.id).then(function (user) {
                res.json(user);
            });
        },
        update: function (req, res) {
            User.findById(req.params.id).then(function (user) {
                res.json(user);
            });
        },
        profile: function(req, res) {
            User.findOne({
              where: {
                id: req.params.id
              },
              attributes: ['nameFirst', 'nameLast', 'username', 'email', 'cell'],
              include: [{
                model: Skill,
                attributes: ['name']
              }]
            })
            .then(function(user) {
              res.json(user);
            });
        },
        current: function(req, res) {
            res.json(req.session.user || null);
        },
        deauth: function (req, res) {
            req.session.destroy();
            res.send({message: 'logout succeeded'});
        },
        auth: function(req, res) {
            User.findOne({
              where: { username: req.body.username }
            }).then(function(user) {
                if(!user) {
                    return res.status(401).json({error: 'Unauthorized', message: 'invalid credentials'}); 
                }
                Creds.findOne({
                    where: { idUser: user.id }, attributes: ['salt', 'hash'] }).then(function(creds) {
                        // does re-hash === creds.hash //
                        bcrypt.compare(req.body.password, creds.hash, function(err, isMatch) {
                            if(err) throw err;
                            if(!isMatch) return res.json({message: 'invalid credentials'});
                            req.session.user = user;
                            res.json(user);
                            // res.redirect('/dashboard');
                        });
                });
            });
        }
    };
};
