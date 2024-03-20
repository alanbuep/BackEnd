import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
import dotenv from "dotenv";
import GitHubStrategy from "passport-github2";
import userService from "../dao/models/users.js";
import jwt, { ExtractJwt } from "passport-jwt";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const PRIVATE_KEY = process.env.CODERSECRET;

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializePassport = () => {

    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: PRIVATE_KEY,
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload.user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                const { first_name, last_name, email, birth } = req.body;
                try {
                    console.log(username);

                    const user = await UserModel.findOne({ email: username });
                    console.log("user", user);
                    if (user) {
                        return done(null, false, { message: "User already exists" });
                    }
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        birth,
                        password: createHash(password),
                        role: "user",
                    };
                    console.log(newUser);
                    let result = await UserModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    console.log(error);
                    return done("Error al obtener el usuario", error);
                }
            }
        )
    );

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: GITHUB_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "No email";
                    console.log(userEmail);
                    let user = await userService.findOne({ email: userEmail });
                    if (!user) {
                        let firstName = profile.displayName ? profile.displayName.split(" ")[0] : "No first name";
                        let lastName = profile.displayName ? profile.displayName.split(" ")[1] : "No last name";
                        const newUser = {
                            first_name: firstName,
                            last_name: lastName,
                            email: userEmail,
                            birth: new Date(),
                            password: Math.random().toString(36).substring(7),
                            role: "user",
                        };
                        let result = await userService.create(newUser);
                        done(null, result);
                    } else {
                        done(null, user);
                    }
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });

    passport.use(
        "login",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
                passwordField: "password",
            },
            async (req, username, password, done) => {
                try {
                    const user = await UserModel.findOne({ email: username });
                    if (!user) {
                        return done(null, false, { message: "User not found" });
                    }
                    console.log("user", user);
                    if (!isValidPassword(user.password, password)) {
                        return done(null, false, { message: "Wrong password" });
                    } else {
                        return done(null, user);
                    }
                } catch (error) {
                    console.log(error);
                    return done("Error al obtener el usuario", error);
                }
            }
        )
    );

    passport.use('current', new JWTStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findOne({ email: jwt_payload.email });
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err, false);
        }
    }));

};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        console.log(req.cookies);
        token = req.cookies["TG_CookieToken"];
    }
    return token;
};

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['TG_CookieToken']]),
    secretOrKey: process.env.CODERSECRET,
};

export default initializePassport;