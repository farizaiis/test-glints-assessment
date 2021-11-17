const bcrypt = require('bcrypt');

function comparePass(rawPw, hashedPw) {
    return bcrypt.compareSync(rawPw, hashedPw);
}

module.exports = { comparePass };
