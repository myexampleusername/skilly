'use strict';

module.exports = function(sequelize) {
    const
        config = require('../config.json'),
        Twitter = require('twitter'),
        User = sequelize.import("../model/user");
     
    let twitter = new Twitter({
      consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      access_token_key: config.twitter.accessToken,
      access_token_secret: config.twitter.accessSecret,
    });

    return {
        get: function (req, res) {
            User.findById(req.params.id).then(function(user) {
                if(!user) {
                    return res.status(404).json({error: 'Not found', message: 'invalid user'}); 
                }
                let params = {
                    screen_name: user.twitterScreenName || 'OperationSpark'
                };
                twitter.get('https://api.twitter.com/1.1/statuses/user_timeline.json', params, function(err, tweets, response) {
                    if(err) throw err;
                    res.send(tweets);
                }); 
            });
        },
        create: function(req, res) {
            
        }
    };
};