var socket = io();

// validasi waktu mau masuk room.
function inputCheck() {
    var username = document.getElementById("inputUsername").value;
    var room = document.getElementById("inputRoom").value;
    if (typeof username === "string" && typeof room === "string" && username.trim().length > 0 && room.trim().length >0 ) {
        // event 1. emit Join - waktu player masuk room
        socket.emit('playerLogin', room, function(err){
            if(err){
                alert(err);
                window.location.href = '/';
                return false;
            }
            return true;
        });
        return true;
    }
    alert('username and password must be filled');
    return false;
}

