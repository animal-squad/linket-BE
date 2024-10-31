export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    session: {
        secret: process.env.SESSION_SECRET,
    },
})
