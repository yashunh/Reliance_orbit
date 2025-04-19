import express from "express"
import axios from "axios"
import cors from  "cors"
import { calculatePrice, createUser, emailSchema, location, phoneNumberSchema } from "./zod"
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '../.env' });
const app = express()
app.use(express.json())
app.use(cors());
const prisma = new PrismaClient()
const mile = 1609.344

app.post("/price", async(req,res)=>{
    const result = calculatePrice.safeParse(req.body)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const {pickupLocation, dropLocation, vanType, extraWorker} = req.body
    const getLocationDetails = await axios.get(process.env.DISTANCE_API || "", {
        params: {
            origins: pickupLocation.location,
            destinations: dropLocation.location 
        }
    })
    let price = 0;
    if(pickupLocation.lift){
        price += 30
    } else if(pickupLocation.floor <= 5 && pickupLocation.floor >= 0){
        price += pickupLocation.floor * 10;
    }

    if(vanType === "Small"){
        price += 60
    } else if(vanType === "Medium"){
        price += 70
    } else if(vanType === "Large"){
        price += 80
    } else if(vanType === "Luton"){
        price += 90
    }
    
    if(extraWorker == 1){
        price += 20
    } else if(extraWorker == 2){
        price += 40
    }

    const distance = getLocationDetails.data.rows[0].elements[0].distance.value / mile
    if(distance <= 30){
        price += distance * 2
    } else if(distance <= 60){
        price += distance * 1.5
    } else if(distance <= 90){
        price += distance * 1.3
    } else{
        price += distance
    }

    res.send({price})
})

app.post("/user/create", async(req,res)=>{
    const result = createUser.safeParse(req.body)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: req.body.email },
                { phoneNumber: req.body.phoneNumber }
            ]
        }
    })
    if(user){
        res.send({
            msg: "user already exist",
            user: user
        }) 
    }
    const newUser = await prisma.user.create({
        data: {
            username: req.body.username,
            email: req.body.emial,
            phoneNumber: req.body.phoneNumber
        }
    })
    res.send({
        msg: "new user created",
        user: newUser
    }) 
})

app.get("/user/login/email/:email", async(req,res)=>{
    const result = emailSchema.safeParse(req.params.email)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where: {
            email: req.params.email
        }
    })
    if(!user){
        res.status(400).send({
            msg: "inavlid user"
        })    
    }
    res.send({
        msg: "user found",
        user: user
    })
})

app.get("/user/login/number/:number", async(req,res)=>{
    const result = phoneNumberSchema.safeParse(req.params.number)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where: {
            phoneNumber: req.params.number
        }
    })
    if(!user){
        res.status(400).send({
            msg: "inavlid user"
        })    
    }
    res.send({
        msg: "user found",
        user: user
    })
})

app.post("/order/create", async(req,res)=>{
     
})

app.get("/order/history/email/:email", async(req,res)=>{
    const result = emailSchema.safeParse(req.params.email)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where: {
            email: req.params.email
        },
        include: {
            orders: true
        }
    })
    if(!user){
        res.status(400).send({
            msg: "inavlid user"
        })    
    }
    res.send({
        msg: "user found",
        user: user
    })
})

app.get("/order/history/number/:number", async(req,res)=>{
    const result = emailSchema.safeParse(req.params.number)
    if(!result.success){
        res.status(400).send("invalid inputs")
    }
    const user = await prisma.user.findFirst({
        where: {
            phoneNumber: req.params.number
        },
        include: {
            orders: true
        }
    })
    if(!user){
        res.status(400).send({
            msg: "inavlid user"
        })    
    }
    res.send({
        msg: "user found",
        user: user
    })
})

app.post("/autocomplete" ,async(req,res)=>{
    const { place } = req.body
    if(!location.safeParse(place).success ){
        res.status(400).send("invalid inputs")
    }
    const response = await axios.get(process.env.AUTOCOMPLETE_API|| "", {
        params: {
            input: place,
        }
    })
    res.send(response.data)
})

app.post("/distance", async(req,res)=>{
    const {origin, destination}  = req.body
    if(!location.safeParse(origin).success || !location.safeParse(destination).success){
        res.status(400).send("invalid inputs")
    }
    const response = await axios.get(process.env.DISTANCE_API || "", {
        params: {
            origins: origin,
            destinations: destination 
        }
    })
    res.send(response.data)
})

app.listen(3000,()=>console.log('server at 3000'))