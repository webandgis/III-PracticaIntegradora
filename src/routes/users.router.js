// sessions.js
const express = require('express');
const router = express.Router();
const usuario = require('../models/User');
const { createHash, isValidatePassword } = require('../../utils');
const passport = require("passport")



router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/profile", async (req, res) => {
   

    try {
        if (!req.session.user) {
            return res.redirect("login")
        }
    
        const { first_name, last_name, email, age } = req.session.user
    
        res.render("profile", { first_name, last_name, age, email })
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).send('Error fetching product data.');
    }
});



router.post('/register', passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Faltan datos.');
        }

        const hashedPassword = createHash(password);

        const user = await usuario.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.send({ status: "success", payload: user });
        console.log('Usuario registrado con éxito.' + user);
        res.redirect('/login');
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get("/failregister", async (req, res) => {
    try {
        console.log("Falla en autenticacion")
        res.send({ error: "Falla" })
    } catch (error) {
        console.error('Error en la ruta "/failregister":', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/api/sessions/profile",
    failureRedirect: "/login", // Redirect to the login page on failure
    failureFlash: true, // Enable flash messages for failure
}));


// Ruta para cerrar sesión
router.post("/logout", async (req, res) => {
    try {
        // Eliminar la sesión del usuario
        req.session.destroy(err => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
            }
            // Redirigir al usuario a la página de inicio de sesión
            res.redirect("/login");
        });
    } catch (error) {
        console.error('Error en la ruta "/logout":', error);
        res.status(500).send('Error interno del servidor.');
    }
});

router.get("/faillogin", async (req, res) => {
    try {
        console.log("Falla en autenticacion");
        res.send({ error: "Falla" });
    } catch (error) {
        console.error('Error en la ruta "/faillogin":', error);
        res.status(500).send('Error interno del servidor.');
    }
});



module.exports = router;


