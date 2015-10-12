/**
 * This file creates fake players
 */

module.exports = {
    create: function () {
        return {
            "name": "Steve",
            "email": "fake@fakemail.com",
            "money": 5000,
            "num_fights": 0,
            "fame": 1000,
            "admin": false
        };
    }
};
