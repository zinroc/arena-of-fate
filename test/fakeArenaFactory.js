module.exports = fakeArenaFactory = {
    randomArenaName: function () {
        var name = [];
        for (var i = 0; i < 10; i++) {
            name[i] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }
        return name.join("");
    },
    create: function () {
        var arena = {
            name: fakeArenaFactory.randomArenaName(),
            capacity: Math.floor(Math.random() * 2000) + 100,
            ticket_price: Math.random() * 5
        };
        return arena;
    }
};
