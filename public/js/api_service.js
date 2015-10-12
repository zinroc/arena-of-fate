var app = angular.module("ArenaApp");

app.factory("arenaService", function arenaService ($http) {

    this.getJSON = function (url, data) {
        data = data || {};
        return $http.get(url, { params: data });
    };
    this.postJSON = function (url, data) {
        data = data || {};
        return $http.post(url, data);
    };

    this.getArenaRecords = function (email){
        return this.getJSON("/api/arenas/getRecords", {email: email});
    };

    this.getRecordRewards = function (email){
        return this.getJSON("/api/arenas/getRecordRewards", {email: email});
    };

    this.acceptReward = function (email, reward_id){
        return this.postJSON("/api/arenas/acceptReward", {email: email, reward_id: reward_id});
    };

    this.getArenas = function (email){
        return this.getJSON("/api/arenas/getAll", { email: email });
    };

    this.getFighters = function (email) {
        return this.getJSON("/api/fighters", { email: email });
    };

    this.getFighter = function (email, id) {
        return this.getJSON("/api/v2/fighters/" + id, { email: email });
    };

    this.requestNewFighters = function (email) {
        return this.postJSON("/api/fighters/new", { email: email });
    };

    this.getMatches = function (email) {
        var data = { email: email, status: "accepted" };
        return this.getJSON("/api/v2/challenges", data);
    };

    this.getChallenges = function (email) {
        return this.getJSON("/api/challenges", { email: email });
    };

    this.getPlayer = function (email, name) {
        return this.getJSON("/api/player", { email: email, name: name });
    };

    this.getGameState = function () {
        return this.getJSON("/api/gameState");
    };

    this.getRankings = function () {
        return this.getJSON("/api/rankings");
    };

    this.getCrowd = function () {
        return this.getJSON("/api/crowd");
    };

    this.createCrowd = function () {
        return this.postJSON("/api/crowd/create");
    };

    this.advanceTimestep = function (currentTimestep) {
        return this.postJSON("/api/gameState/advanceTimestep", { timestep: currentTimestep });
    };

    this.requestNewChallenge = function (email) {
        return this.postJSON("/api/challenges/new", { email: email });
    };

    this.acceptChallenge = function (challengeID, email, fighterID) {
        var data = {
            email: email,
            fighter: fighterID
        };
        return this.postJSON("/api/challenges/" + challengeID + "/accept", data);
    };

    this.declineChallenge = function (challengeID, email) {
        return this.postJSON("/api/challenges/" + challengeID + "/decline", { email: email });
    };

    return this;
});
