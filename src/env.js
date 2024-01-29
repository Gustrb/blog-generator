export const OPTIONS = {
    port: process.env.PORT || 3000,
    dev: process.env.NODE_ENV === 'development',
    cacheTTL: process.env.NODE_ENV === 'development' ? 0 : 60 * 60 * 24,
    timeBeforeIndex: process.env.NODE_ENV === 'development' ? 1000 * 60 * 1 : 1000 * 60 * 5,
};
