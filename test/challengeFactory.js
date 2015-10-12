var maxInt = Math.pow(2, 31) - 1;

module.exports = {
    create: function () {
        return {
            "arena": 0,
            "status": "pending",
            "arena_fighter": null,
            "entry_fee": 0,
            "winner_prize": 0,
            "winner": null,
            "min_fame": null,
            "timestep_scheduled": 3,
            "random_seed": Math.round(Math.random() * maxInt),
        };
    }
};
