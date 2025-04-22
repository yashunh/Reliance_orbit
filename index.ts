import express from "express"
import axios from "axios"
import cors from "cors"
import { calculatePriceSchema, createUser, emailSchema, location, newSchema, phoneNumberSchema, worker } from "./zod"
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import calculatePrice from "./price";

dotenv.config({ path: __dirname + '../.env' });
const app = express()
app.use(express.json())
app.use(cors());
const prisma = new PrismaClient()

app.post("/price", async (req, res) => {
    const result = calculatePriceSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).send("invalid inputs")
    }
    const { pickupLocation, dropLocation, vanType, worker } = req.body
    const locationDetails = await axios.get(process.env.DISTANCE_API || "", {
        params: {
            origins: pickupLocation.location,
            destinations: dropLocation.location
        }
    })
    let price = calculatePrice(pickupLocation, dropLocation, vanType, worker, locationDetails)
    res.send({ price })
})

// app.post("/user/create", async(req,res)=>{
//     const result = createUser.safeParse(req.body)
//     if(!result.success){
//         res.status(400).send("invalid inputs")
//     }
//     const user = await prisma.user.findFirst({
//         where: {
//             OR: [
//                 { email: req.body.email },
//                 { phoneNumber: req.body.phoneNumber }
//             ]
//         }
//     })
//     if(user){
//         res.send({
//             msg: "user already exist",
//             user: user
//         }) 
//     }
//     const newUser = await prisma.user.create({
//         data: {
//             username: req.body.username,
//             email: req.body.emial,
//             phoneNumber: req.body.phoneNumber
//         }
//     })
//     res.send({
//         msg: "new user created",
//         user: newUser
//     }) 
// })

// app.get("/user/login/email/:email", async(req,res)=>{
//     const result = emailSchema.safeParse(req.params.email)
//     if(!result.success){
//         res.status(400).send("invalid inputs")
//     }
//     const user = await prisma.user.findFirst({
//         where: {
//             email: req.params.email
//         }
//     })
//     if(!user){
//         res.status(400).send({
//             msg: "inavlid user"
//         })    
//     }
//     res.send({
//         msg: "user found",
//         user: user
//     })
// })

// app.get("/user/login/number/:number", async(req,res)=>{
//     const result = phoneNumberSchema.safeParse(req.params.number)
//     if(!result.success){
//         res.status(400).send("invalid inputs")
//     }
//     const user = await prisma.user.findFirst({
//         where: {
//             phoneNumber: req.params.number
//         }
//     })
//     if(!user){
//         res.status(400).send({
//             msg: "inavlid user"
//         })    
//     }
//     res.send({
//         msg: "user found",
//         user: user
//     })
// })

// app.post("/order/create", async(req,res)=>{

// })

// app.get("/order/history/email/:email", async(req,res)=>{
//     const result = emailSchema.safeParse(req.params.email)
//     if(!result.success){
//         res.status(400).send("invalid inputs")
//     }
//     const user = await prisma.user.findFirst({
//         where: {
//             email: req.params.email
//         },
//         include: {
//             orders: true
//         }
//     })
//     if(!user){
//         res.status(400).send({
//             msg: "inavlid user"
//         })    
//     }
//     res.send({
//         msg: "user found",
//         user: user
//     })
// })

// app.get("/order/history/number/:number", async(req,res)=>{
//     const result = emailSchema.safeParse(req.params.number)
//     if(!result.success){
//         res.status(400).send("invalid inputs")
//     }
//     const user = await prisma.user.findFirst({
//         where: {
//             phoneNumber: req.params.number
//         },
//         include: {
//             orders: true
//         }
//     })
//     if(!user){
//         res.status(400).send({
//             msg: "inavlid user"
//         })    
//     }
//     res.send({
//         msg: "user found",
//         user: user
//     })
// })

app.post("/autocomplete", async (req, res) => {
    const { place } = req.body
    if (!location.safeParse(place).success) {
        res.status(400).send("invalid inputs")
    }
    const response = await axios.get(process.env.AUTOCOMPLETE_API || "", {
        params: {
            input: place,
        }
    })
    res.send(response.data)
})

app.get("/postalcode/:place_id", async (req, res) => {
    const place_id  = req.params.place_id
    if (!location.safeParse(place_id).success) {
        res.status(400).send("invalid inputs")
    }
    const data = await axios.get(process.env.PLACE_API || "", {
        params: {
            place_id: place_id
        }
    })
    const { lat, lng } = data.data.result.geometry.location;
    const latlng = lat + "," + lng
    const response = await axios.get(process.env.GEOCODE_API || "", {
        params: {
            latlng: latlng
        }
    })
    const postalCode = response.data.results[0].address_components.find((c: any) => c.types.includes("postal_code"));
    res.send(postalCode)
})

app.post("/distance", async (req, res) => {
    const { origin, destination } = req.body
    if (!location.safeParse(origin).success || !location.safeParse(destination).success) {
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

app.post("/new", async (req, res) => {
    const result = newSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).send({msg: "invalid inputs",
            result
        })
    }
    const newOrder = await prisma.booking.create({
        data: req.body
    })
    res.send({
        msg: "order created",
        newOrder
    })
})

app.get("/history/:email", async (req, res) => {
    const result = emailSchema.safeParse(req.params.email)
    if (!result.success) {
        res.status(400).send("invalid inputs")
    }
    const history = await prisma.booking.findMany({
        where: {
            email: req.params.email
        },
        take: 20
    })
    if (!history) {
        res.status(400).send({
            msg: "no history"
        })
    }
    res.send({
        msg: "user found",
        history
    })
})

app.get("/history/all/:key" ,async (req, res) => {
    if (req.params.key !== "rishi") {
        res.status(400).send("unauthorized")
    }
    const history = await prisma.booking.findMany()
    res.send({
        history
    })
})

app.listen(3000, () => console.log('server at 3000'))