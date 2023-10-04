const passport = require("passport");
const local = require("passport-local");
const userService = require("../models/User");
const { createHash, isValidatePassword } = require("../../utils");



const localStrategy = local.Strategy;

//initializePassport using Sessions
const initializePassport = () => {
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

}

module.exports = initializePassport;
