export const validatorPositive = (value) => {
  if (value >= 0) {
    return true;
  }
  return false;
};

export const validatorPassword = (password) => {
  /* eslint-disable no-useless-escape */
  const regExp = /(?=.*\d)(?=.*[a-z]){8,}/; // добавил А-Яа-я\-
  /* eslint-enable no-useless-escape */
  const validPassword = regExp.test(password);
  return validPassword;
};
// const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

export const validatorCreditCard = (creditnum) => {
  /* eslint-disable no-useless-escape */
  const cRegExp = /^7[0-9]{18}(?:[0-9]{3})?$/;
  /* eslint-enable no-useless-escape */
  const validCreditCard = cRegExp.test(creditnum);
  return validCreditCard;
};

export const validatorUrlValidator = (val) => {
  if (val === undefined || val === null || val.length === 0) {
    return true;
  }
  /* eslint-disable no-useless-escape */
  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  /* eslint-enable no-useless-escape */
  return re.test(val);
};
