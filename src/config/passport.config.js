const passport = require("passport");
const local = require("passport-local");
const userService = require("../models/User");
const { createHash, isValidatePassword } = require("../../utils");

const localStrategy = local.Strategy;

// Initialize Passport with both "register" and "login" strategies using Sessions
const initializePassport = () => {
    // Register Strategy
    passport.use(
        "register",
        new localStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await userService.findOne({ email: username });
                    if (user) {
                        console.log("El usuario ya existe");
                        return done(null, false);
                    }

                    if (!first_name || !last_name || !email || !age || !password) {
                        console.log("Faltan campos obligatorios");
                        return done(null, false);
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password), 
                    };
                    let result = await userService.create(newUser);
                    return done(null, result[0].id);

                } catch (error) {
                    return done("Error al obtener el usuario " + error);
                }
            }
        )
    );

    // Login Strategy
    passport.use(
        "login",
        new localStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await userService.findOne({ email: username });
                    if (!user) {
                        console.log("Usuario no encontrado");
                        return done(null, false);
                    }

                    if (!isValidatePassword(user, password)) {
                        console.log("Error en la contraseña");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

module.exports = initializePassport;

