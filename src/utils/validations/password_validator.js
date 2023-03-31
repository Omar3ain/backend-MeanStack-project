const passwordValidatorSchema = require("password-validator");

// Create a schema
var passwordValidationSchema = new passwordValidatorSchema();
const i18n = require("../config/i18n.config");
const { __ } = i18n;
const errMsgs = {
    MIN_ERR: "the minimum length of this field is 8 characters.",
    MAX_ERR: "the maximum length of this field is 20 characters.",
    UPPERCASE_ERR: "must have uppercase letters.",
    LOWERCASE_ERR: "must have lowercase letters.",
    DIGITS_ERR: "must have at least 2 digits.",
    SPACES_ERR: "should not have spaces.",
    PASSW0RD_ERR: "this password is invalid.",
};
// Add properties to it
const passwordValidator = (password, confirmPassword) => {
    if (password != confirmPassword)
        return {
            messages: {
                password: "two password fields must match",
            },
        };
    const result = passwordValidationSchema
        .is()
        .min(8, errMsgs.MIN_ERR) // Minimum length 8
        .is()
        .max(20, errMsgs.MAX_ERR) // Maximum length 20
        .has()
        .uppercase(1, errMsgs.MAX_ERR) // Must have uppercase letters
        .has()
        .lowercase(1, errMsgs.LOWERCASE_ERR) // Must have lowercase letters
        .has()
        .digits(2, errMsgs.DIGITS_ERR) // Must have at least 2 digits
        .has()
        .not()
        .spaces(0, errMsgs.SPACES_ERR) // Should not have spaces
        .is()
        .not()
        .oneOf(["Passw0rd", "Password123"])
        .validate(password, { details: true }); // Blacklist these values
    if (result) return result;
};
module.exports = passwordValidator;
