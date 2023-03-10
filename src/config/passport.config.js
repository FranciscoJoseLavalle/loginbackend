import passport from 'passport';
import local from 'passport-local';
import userService from '../models/User.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                const { name } = req.body;
                if (!name || !email || !password) return done(null, false, { message: "Incomplete values" })
                // El usuario está en la DB?
                const exists = await userService.findOne({ email: email });
                if (exists) return done(null, false, { message: "User already exists" })
                // Insertar en la DB
                const newUser = {
                    name,
                    email,
                    password: createHash(password)
                }
                let result = await userService.create(newUser);
                // SI TODO SALIÓ BIEN EN LA ESTRATEGIA
                return done(null, result)
            } catch (error) {
                console.log(error);
            }
        }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        if (!email || !password) return done(null, false, { message: "Incomplete values" })
        // El usuario está en la DB?
        let user = await userService.findOne({ email: email });
        if (!user) return done(null, false, { message: "Incorrect credentials" })
        // Validar datos
        if (!isValidPassword(user, password)) return done(null, false, { message: "Incorrect password" })
        return done(null,user);
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let result = await userService.findOne({ _id: id })
        return done(null, result);
    })
}

export default initializePassport;