$(document).ready(function() {
    request('GET', '/user/current', null, onCurrentUserSuccess)
});


function onCurrentUserSuccess(response) {
    console.log(response);
    
    if(response.id) {
        // todo : refactor //
        setTimeout(function() {
            $('#a-sign-in-sign-up').replaceWith('<a id="a-logout" href="">Logout</a>');
        $('#a-logout').one('click', deauth);    
        }, 300);
    }
}

function deauth(event) {
    if(event) event.preventDefault();
    request('POST', '/user/deauth', {}, onDeauthSuccess);
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