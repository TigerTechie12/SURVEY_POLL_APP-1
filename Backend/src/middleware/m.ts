import {JWT_SECRET} from "../config/i"
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction  } from 'express';

export function Verify(req:Request, res:Response, next:NextFunction){
const authHeader=req.headers.authorization as string | undefined
if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).send("unauthorized")
}
const token=authHeader.split(" ")[1]
try{
    const decoded=jwt.verify(token,JWT_SECRET)
    if(!decoded){return res.status(403).send("Unable to verify")
        }   
    (req as any).user = decoded;
     next()
    
}
catch(e){res.send("Failed")}
}