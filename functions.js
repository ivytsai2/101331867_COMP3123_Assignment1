function emptyBodyMsg(model) {
    const slice = model.slice(1);
    const capFisrtLetter = model[0].toUpperCase() + slice.toLowerCase();
    return {
        status: false,
        message: `${capFisrtLetter} content can not be empty`
    }
}
function invalidImputMsg(input) {
    return {
        status: false,
        message: `Invalid ${input}`
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function ifExistButEmpty(obj) {
    return obj !== undefined && obj === "";
}

module.exports = {emptyBodyMsg, invalidImputMsg, isEmpty, ifExistButEmpty};