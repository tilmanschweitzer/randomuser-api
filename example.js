#!/usr/bin/env node

var randomUsers = require('./randomUsers');

var numberOfUsers = 123;

randomUsers.api.get(numberOfUsers, function (users) {
    console.log(users.length);
});

randomUsers.api.forEach(numberOfUsers, function (randomUser) {
    var customUser = {
        name: randomUsers.userHelper.buildName(randomUser.user),
        mentionName: randomUsers.userHelper.buildMentionName(randomUser.user),
        email: randomUser.user.email
    };

    console.log(JSON.stringify(customUser));
});
