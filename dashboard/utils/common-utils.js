const formatTime = d => {
    const addZero = t => {
        return Number(t) < 10 ? `0${t}` : t;
    };

    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${addZero(d.getHours())}:${addZero(
        d.getMinutes()
    )}:${addZero(d.getSeconds())}`;
};

const formatPercentage = diffPercentage => {
    return diffPercentage;
};

module.exports = {
    formatTime,
    formatPercentage,
};
