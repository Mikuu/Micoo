db.createUser({
    user: "micoo-user",
    pwd: "micoo-password",
    roles: [
        {
            role: "readWrite",
            db: "micoo",
        },
    ],
});
