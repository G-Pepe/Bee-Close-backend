const bcrypt = require("bcrypt");

exports.encrypt = (password) => {
  if (!password) return "";
  let hash = bcrypt.hashSync(password, 10);
  return hash;
};
