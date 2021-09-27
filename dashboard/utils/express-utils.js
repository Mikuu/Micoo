const envConfig = require("../config/env.config");

const rendering = (res, view, data) => {
    return res.render(view, {...data, contextPath: envConfig.dashboardContextPath});
};

const renderingWithStatus = (res, view, data, status) => {
    return res.status(status).render(view, {...data, contextPath: envConfig.dashboardContextPath});
};

const redirecting = (res, path) => {
    return res.redirect(envConfig.dashboardContextPath ? `${envConfig.dashboardContextPath}` + path : path);
};

const redirectingWithStatus = (res, path, status) => {
    return res.status(status).redirect(envConfig.dashboardContextPath ? `${envConfig.dashboardContextPath}` + path : path);
};

const clearCookieAndRedirect = (res, authKey, path) => {
    return res
        .clearCookie(authKey)
        .redirect(envConfig.dashboardContextPath ? `${envConfig.dashboardContextPath}` + path : path);
};

const pathWithContextPath = path => {
    return envConfig.dashboardContextPath ? `${envConfig.dashboardContextPath}` + path : path
};

module.exports = {
    rendering,
    redirecting,
    clearCookieAndRedirect,
    renderingWithStatus,
    pathWithContextPath,
    redirectingWithStatus,
};
