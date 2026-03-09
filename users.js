const users = {};

function getUser(phone){

if(!users[phone]){
users[phone] = {
state: "nuevo"
};
}

return users[phone];

}

function setState(phone,state){

if(!users[phone]){
users[phone] = {};
}

users[phone].state = state;

}

module.exports = {
getUser,
setState
};
