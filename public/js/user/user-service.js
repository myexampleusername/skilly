(function (window) {
    window.skilly = window.skilly || {};
    let userService = window.skilly.userService = {};
    
    userService.current = current;
    userService.create = create;
    userService.auth = auth;
    userService.deauth = deauth;
})(window);

function current() {
    
}

function auth(creds) {
    request('POST', '/user/auth', creds, onAuthSuccess);
}

function deauth(event) {
    if(event) event.preventDefault();
    request('POST', '/user/deauth', {}, onDeauthSuccess);
}

function create(user) {
    
}

function onAuthSuccess(response) {
    if(response.error) return console.log(response.message); 
    $('#a-sign-in-sign-up').replaceWith('<a id="a-logout" href="">Logout</a>');
    $('#a-logout').one('click', deauth);
    console.log('User auth succeeded');
    console.log(response);
}

function onDeauthSuccess(response) {
    if(response.error) return console.log(response.message); 
    $('#a-logout').replaceWith('<a id="a-sign-in-sign-up" href="#signup" data-toggle="modal" data-target=".bs-modal-sm">Sign In / Sign Up</a>');
    console.log('User deauth succeeded');
    console.log(response);
}

function request(method, path, data, onSuccess) {
    $.ajax({
        method: method,
        url: domain + path,
        data: data,
        dataType: "json",
        success: onSuccess,
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}
