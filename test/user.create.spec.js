'use strict';

process.env.NODE_ENV = 'test';

const
    expect = require('chai').expect,
    sinon = require('sinon'),
    Sequelize = require("sequelize"),
    sequelize = new Sequelize('skilly', process.env.C9_USER.slice(0, 16), '', {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      define: {
        timestamps: false,
      }
    });

let 
    userService,
    userInfoService,
    User = sequelize.import("./../../model/user"),
    UserInfo = sequelize.import("./../../model/userInfo"),
    Creds = sequelize.import("./../../model/creds");

describe("#db", function () {
    let user = {nameLast: "Gary", nameFirst: "Tremblay", username: "gtremblay"};
    
    before(function(done) {
            //sequelize.sync({force: true}).then(function () { 
                userService = require("./../../service/user")(sequelize);
                userInfoService = require("./../../service/userInfo")(sequelize);
                sequelize.sync().then(function (res) {
                    done();
                })
                .catch(function(e) {
                    console.log('Error in sequelize.sync(): ' + e);
                    done();
                });
            //});
        });
        
        beforeEach(function(done){
           UserInfo.destroy({ where: {id: {$ne: null}}});
           User.destroy({ where: {id: {$ne: null}}});
           done();
        });
        
        // UserInfo.destroy({ where: {id: {$ne: null}}})
        //      .then(function() { jctBlogPost.destroy({ where: {idBlog: {$ne: null}}} })
        //       .then(function() { Post.destroy({ where: {id: {$ne: null}}} })
        //          .then(function() { Blog.destroy({ where: {id: {$ne: null}}}) })
        //             .then(function() { User.destroy({ where: {id: {$ne: null}}} })
        //               .then(function() { done() }))
        //       ));
    
    describe("#user-service", function () {
        var mockResponse = function (callback) { return {send: callback, json: callback}; };
        var req = {body: user};
        
        it("should create new users", function (done) {
            userService.create(req, mockResponse(function (statusCode) {
                expect(statusCode).to.equal(200);
                done();
            }));
        });
     
        it("should find created users", function (done) {
            User.create(user).then(function () {
                userService.get({}, mockResponse(function (data) {
                    expect(data[0].username).to.eql(user.username);
                    done();
                }));
            });
        });
    });
    
    describe("#post-service", function () {
        var mockResponse = function (callback) { return {send: callback, json: callback}; };
        var post = {title: 'I love SQL', subtitle: 'It is super cool!', body: 'This is the shit, sql is the shiiiiit!'};
        var req = {body: post};
        
        it("should create new posts", function (done) {
            postService.create(req, mockResponse(function (statusCode) {
                expect(statusCode).to.equal(200);
                done();
            }));
        });
     
        it("should find created users", function (done) {
            Post.create(post).then(function () {
                postService.get({}, mockResponse(function (data) {
                    expect(data[0].title).to.eql(post.title);
                    done();
                }));
            });
        });
    });
    
    
});

