import {getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
export const login =async (req,res)=>{
    try {
        //yhan token filega frontend se 
        const {token}=req.body
        //or upar hum usse access kr rhe hai 
        // aab hum niche usse verify kr rhe hai token ko jo hamri body se aaya hai 
        const decode =await getAuth(app).verifyIdToken(token)
        // data store ho rha hai decode mai 
        const user=await User.findOne({
            firebaseUid:decoded.uid
        })
        if(!user){
            user=await User.create({
                firebaseUid:decoded.uid,
                name:decoded.name,
                email:decoded.email,
                avatar:decoded.picture
            })
        }
        // agr user 7 din ke andar aata hai frr se web pr toh usse frr log in 
        //na krna pade issa liye hum ussa session ko cookies mai dalenge agr 
        // voh expire ho jati hai toh user frr se log in karega 
        //other wise not 
        const sessionId=crypto.randomUUID()
        //iske andar name dena hoga session /
        // or ye hamari kab expire hogi 
        res.cookie("session",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            // itne time baad cookie expire 7 din baad 
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}