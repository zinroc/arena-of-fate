/**
 * Return object with keys as cookies and values as values for those cookies.
 */
var getCookie = function (key) {
    var pairs = document.cookie.split("; ");
    var o = {}, k, v;
    for (var i = 0; i < pairs.length; i++) {
        k = pairs[i].split("=")[0];
        v = pairs[i].split("=")[1];
        o[k] = v;
    }
    return o[key];
};

/**
 * Call this function on google sign-in success
 */
function onSignIn (googleUser) {
    console.log("Called google sign-in callback");
    var profile = googleUser.getBasicProfile();
    var data = { name: profile.getName(), email: profile.getEmail() };
    // create a cookie
    document.cookie="name=" + data.name;
    document.cookie="email=" + data.email;
    // redirect to main game
    window.location.href = "/game";
}

$(function () {
    // if already logged in, then redirect to main game immediately
    if (getCookie ("email") && getCookie("email")) {
        console.log("Already logged in, redirecting to game");
        window.location.href = "/game";
    }
});
