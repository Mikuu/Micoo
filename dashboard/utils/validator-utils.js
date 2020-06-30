const path = require("path");
/**
 * Return True is validation passed, otherwise return error message.
 *
 **/
const projectImageValidator = projectImageFilename => {
    let message = null;
    const parsedFilename = path.parse(projectImageFilename);
    const errorMessage = failure => {
        return `project image filename "${projectImageFilename}" unacceptable: ${failure}`;
    };

    if (parsedFilename.ext !== ".webp") {
        message = errorMessage("not a webp image");
        console.error(message);
        return message;
    }

    const lengthLimit = 100;
    if (projectImageFilename.length > lengthLimit) {
        message = errorMessage(`longer than ${lengthLimit}`);
        console.error(message);
        return message;
    }

    const format = /^[a-zA-Z0-9\-_]+$/;
    if (!format.test(parsedFilename.name)) {
        message = errorMessage(`only support letters in [a-zA-Z0-9-_]`);
        console.error(message);
        return message;
    }

    return true;
};

module.exports = {
    projectImageValidator,
};
