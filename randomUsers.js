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

request({
    url: 'http://api.randomuser.me/?results=' + numberOfUsers
}, apiHelper.createBaseHandler(function (body) {
    var parsedBody = JSON.parse(body);
    parsedBody.results.forEach(function (randomUser) {
        var customUser = {
            name: userHelper.buildName(randomUser.user),
            mentionName: userHelper.buildMentionName(randomUser.user),
            email: randomUser.user.email
        };
        console.log(JSON.stringify(customUser));
    });
}));
