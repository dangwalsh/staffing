var mongoose = require('mongoose');
var model = require('model.js');

var staffSchema = new mongoose.Schema({
    name: {
        type: String
    },
    project: String,
    role: String,
    previous: String,
    experience: Number,
    phase: String
});
var Staff = mongoose.model('Staff', staffSchema);
var db = mongoose.connection;
if (process.argv.length < 3) {
    console.error('please indicate how many employees you want to create.');
}
var count = process.argv[2];

mongoose.connect('mongodb://ac/testdb');
db.on('error', console.error);
db.once('open', function() {
    for (var i = 0; i < count; i++) {
        var person = new Staff({
            name: generateValue(model.firstNames) + ' ' +
                generateValue(model.lastNames),
            project: generateValue(model.projects),
            role: generateValue(model.roles),
            previous: generateValue(model.projects),
            experience: Math.round(25 * Math.random()),
            phase: generateValue(model.phases)
        });
        checkDuplicate(person);
    }
});

function generateIndex(length) {
    return checkBounds(Math.round(Math.random() * length), length);
}

function generateValue(obj) {
    return obj[generateIndex(obj.length)];
}

function checkBounds(num, length) {
    if (num == length) num--;
    return num;
}

function checkDuplicate(person) {
    Staff.find({
        name: person.name
    }, function(err, exist) {
        if (err) return console.error(err);
        return;
    });
    person.save(function(err, person) {
        if (err) return console.error(err);
        console.dir(person);
    });
}
