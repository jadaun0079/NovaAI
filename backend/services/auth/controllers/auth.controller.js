import crypto from "crypto";
import {getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from "../models/user.model.js"
import { createConnection } from "mongoose"
import redis from "../../../shared/redis.js";

export const login = async (req, res) => {
    try {
       

        const { token } = req.body;
        

        const decoded = await getAuth(app).verifyIdToken(token);
        

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });
       

        if (!user) {
            

            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            });

            
        }

        const sessionId = crypto.randomUUID();
        await redis.set(`session-${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user._name,
            email:user._email,
            avatar:user._avatar
        }),"EX",7 * 24 * 60 * 60)

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("8. Sending response");

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const logOut=async (req,res)=>{
    try {
        const sessionId= req.cookies?.session
        //remove session from redis
        await redis.del(`session-${sessionId}`)
        res.clearCookie("session")
        return res.status(200).json({message:"Logout succesfully"});
    } catch (error) {
         return res.status(500).json({
            message: error.message
        });
    }
}