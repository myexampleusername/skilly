'use strict';

let 
    config = require('../config.json'),
    Promise = require('bluebird'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    
module.exports = function(passport, sequelize) {
    const
        User = sequelize.import("../model/user"),
        Google = sequelize.import("../model/google");
        
    User.hasOne(Google, {foreignKey: 'idUser'});
    Google.belongsTo(User, {foreignKey: 'idUser'});
        
    function findGoogleUser(idUser) {
        return new Promise(function(resolve, reject){
            User.findOne({
              where: {
                id: idUser
              },
              attributes: ['nameFirst', 'nameLast', 'username', 'email', 'cell'],
              include: [{
                model: Google,
                attributes: ['idGoogle', 'token', 'displayName', 'gmail']
              }]
            })
            .then(function(user) {
                resolve(user);
            })
            .catch(function(err) {
                reject(err);
            });
        });
    }
    
    function findGoogleUserByGoogleId(idGoogle) {
        return new Promise(function(resolve, reject){
            Google.findOne({
              where: { idGoogle: idGoogle }
            }).then(function(google) {
                if(google) {
                    findGoogleUser(google.idUser).then(function(user) {
                        resolve(user);
                    });
                } else {
                    reject();
                }
            });
        });
    }
        
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeUser ------------------------------');
        var converted = JSON.parse(JSON.stringify(user));
        console.dir(converted);
        done(null, converted.google.idGoogle);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser ------------------------------');
        console.dir(id);
        findGoogleUserByGoogleId(id).then(function(user) {
            if(user) return done(null, user);
            throw Error('No user found!');
        });
    });
    
    passport.use(new GoogleStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
    function(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            Google.findOne({
              where: { idGoogle: profile.id }
            }).then(function(google) {
                if(google) {
                    findGoogleUser(google.idUser).then(function(user) {
                        done(null, user);
                    });
                } else {
                    User.build({
                        username: profile.displayName,
                        email: profile.emails[0].value
                    })
                    .save()
                    .then(function(user) {
                        Google.build({
                            idUser: user.id,
                            idGoogle: profile.id,
                            token: token,
                            refreshToken: refreshToken,
                            displayName: profile.displayName,
                            gmail: profile.emails[0].value
                        })
                        .save()
                        .then(function(google) {
                            findGoogleUser(google.idUser).then(function(user) {
                                done(null, user);
                            });
                        }).catch(function(err) {
                            throw err;
                        });
                    });
                }
            });
        });
    }));
};