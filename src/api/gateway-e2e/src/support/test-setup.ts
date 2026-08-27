module.exports = async function () {
    // Configure axios for tests to use.
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ?? '3000';
    const res = await fetch(`http://${host}:${port}/api`);
    return res;
};
