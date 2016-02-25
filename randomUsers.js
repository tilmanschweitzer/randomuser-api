#!/usr/bin/env node

var request = require('request');

var numberOfUsers = 3000;

var apiHelper = {
    createBaseHandler: function (cb, config) {
        return function (error, response, body) {
            if ((response.statusCode + '')[0] !== '2' || error) {
                console.log('statusCode was ' + response.statusCode);
                console.log('error: ' + error);
                console.log('body: ' + JSON.stringify(body));
                console.log('requestConfig: ' + JSON.stringify(config));
                console.log('------------');
                return;
            }

            (cb || _.noop)(body, config);
        }
    }
};

var api = {
    get: function (numberOfUsers, callback) {
        request({
            url: 'http://api.randomuser.me',
            qs: {
                results: numberOfUsers
            }
        }, apiHelper.createBaseHandler(function (body) {
            var parsedBody = JSON.parse(body);

            (callback || _.noop)(parsedBody.results);
        }));
    },
    forEach: function (numberOfUsers, callback) {
        api.get(numberOfUsers, function (users) {
            users.forEach(callback);
        });
    }
};

var userHelper = {
    firstUpper: function (s) {
        if (s && s[0]) {
            return s[0].toUpperCase() + s.slice(1);
        } else {
            return ''
        }
    },
    buildName: function (randomUser) {
        return (userHelper.firstUpper(randomUser.name.first) + ' ' + userHelper.firstUpper(randomUser.name.last)).trim();
    },
    buildMentionName: function (randomUser) {
        return (randomUser.name.first[0] + randomUser.name.last).trim()
    }
};


module.exports = {
    api: api,
    apiHelper: apiHelper,
    userHelper: userHelper
};
