import { Router } from "express";
import userService from "../models/User.js";
import { isValidPassword } from '../utils.js'
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/registerfail' }), async (req, res) => {
    console.log(req.user)
    res.send({ status: "success", payload: req.user._id });
})
router.get('/registerfail', (req, res) => {
    console.log("Something is wrong");
    res.status(500).send({ status: "Error", error: "Server crashed" })
})
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/loginfail' }), async (req, res) => {
    req.session.user = {
        name: req.user.name,
        email: req.user.email,
        id: req.user._id
    }
    res.send({ status: 'success', payload: req.session.user })
})
router.get('/loginfail', (req, res) => {
    res.status(500).send({ status: "error", error: "error in login" })
})
export default router;