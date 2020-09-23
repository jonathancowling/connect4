module.exports.flushPromises = () => new Promise((resolve) => setImmediate(resolve));
