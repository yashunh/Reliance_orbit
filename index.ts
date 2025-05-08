import express, { ErrorRequestHandler } from "express"
import axios from "axios"
import cors from "cors"
import { calculatePriceSchema, createUser, distanceSchema, emailSchema, location, newSchema, quoteSchema } from "./zod"
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import calculatePrice from "./price";
import calculateDistance from "./distance";

dotenv.config({ path: __dirname + '../.env' });
const app = express()
app.use(express.json())
app.use(cors());
const prisma = new PrismaClient()

app.post("/price", async (req, res): Promise<any> => {
    const result = calculatePriceSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({
            msg: "invalid inputs",
            result
        })
    }
    const { pickupLocation, dropLocation, vanType, worker, itemsToAssemble, itemsToDismantle } = req.body
    const stoppage = req.body.stoppage || []

    const [distance, duration] = await calculateDistance(pickupLocation.location, dropLocation.location, stoppage)
    if (distance == -1 || duration == -1) {
        return res.status(400).send({
            msg: "invalid location",
        })
    }

    let price = calculatePrice(pickupLocation, dropLocation, vanType, worker, distance, itemsToAssemble, itemsToDismantle, stoppage)
    return res.send({ price })
})

app.post("/user/create", async (req, res): Promise<any> => {
    const result = createUser.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({ msg: "invalid inputs", result })
    }
    const user = await prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    })
    if (user) {
        return res.send({
            msg: "user already exist",
            user: user
        })
    }
    const newUser = await prisma.user.create({
        data: req.body
    })
    return res.send({
        msg: "new user created",
        user: newUser
    })
})

app.get("/login/email/:email", async (req, res): Promise<any> => {
    const result = emailSchema.safeParse(req.params.email)
    if (!result.success) {
        return res.status(400).send({ msg: "invalid inputs", result })
    }
    const user = await prisma.user.findFirst({
        where: {
            email: req.params.email
        }
    })
    if (!user) {
        const newUser = await prisma.user.create({
            data: {
                email: req.params.email
            }
        })
        return res.send({
            msg: "new user created",
            user: newUser
        })
    }
    return res.send({
        msg: "user found",
        user: user
    })
})

app.post("/autocomplete", async (req, res): Promise<any> => {
    const { place } = req.body
    if (!location.safeParse(place).success) {
        return res.status(400).send({ msg: "invalid inputs" })
    }
    const response = await axios.get(process.env.AUTOCOMPLETE_API || "", {
        params: {
            input: place,
        }
    })
    return res.send(response.data)
})

app.get("/postalcode/:place_id", async (req, res): Promise<any> => {
    const place_id = req.params.place_id
    if (!location.safeParse(place_id).success) {
        return res.status(400).send({ msg: "invalid inputs" })
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
    return res.send(postalCode)
})

app.post("/distance", async (req, res): Promise<any> => {
    const result = distanceSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({ msg: "invalid inputs", result })
    }
    const { origin, destination } = req.body
    const stoppage = req.body.stoppage || []

    const response = await calculateDistance(origin, destination, stoppage)
    if (response[0] == -1 || response[1] == -1) {
        return res.status(400).send({
            msg: "invalid location",
        })
    }

    return res.send({ response })
})

app.post("/new", async (req, res): Promise<any> => {
    const result = newSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({
            msg: "invalid inputs",
            result
        })
    }

    let data = req.body
    data.stoppage = data.stoppage?.filter((stop: string) => stop.trim() !== "")
    data.stoppage = [...new Set(data.stoppage)]

    const [distance, duration] = await calculateDistance(data.fromLocation.location, data.toLocation.location, data.stoppage)
    if (distance == -1 || duration == -1) {
        return res.status(400).send({
            msg: "invalid location",
            data
        })
    }

    if (data.distance != distance) {
        // return res.status(400).send({
        //     msg: "invalid distance, calculate again",
        //     data
        // })
        data.distance = distance
    }
    const price = calculatePrice(data.fromLocation, data.toLocation, data.vanType, data.worker, data.distance, data.itemsToAssemble, data.itemsToDismantle, data.stoppage)

    if (data.price != price) {
        // return res.status(400).send({
        //     msg: "invalid price, calculate again",
        //     data
        // })
        data.price = price
    }
    const newOrder = await prisma.booking.create({
        data: data
    })
    return res.send({
        msg: "order created",
        newOrder
    })
})

app.post("/quote", async (req, res): Promise<any> => {
    const result = quoteSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({
            msg: "invalid inputs",
            result
        })
    }

    const data = req.body
    if (data.distance || data.duration) {
        const stoppage = data.stoppage || []
        if (!data.fromLocation.location || !data.toLocation.location) {
            return res.status(400).send({
                msg: "invalid location for distance calculation, select again",
                data
            })
        }

        const [distance, duration] = await calculateDistance(data.fromLocation.location, data.toLocation.location, stoppage)
        if (distance == -1 || duration == -1) {
            return res.status(400).send({
                msg: "invalid location",
                data
            })
        }

        if (data.distance != distance) {
            // return res.status(400).send({
            //     msg: "invalid distance, calculate again",
            //     data
            // })
            data.distance = distance
        }
    } else if (data.price) {
        const stoppage = data.stoppage || []
        const price = calculatePrice(data.pickupLocation, data.dropLocation, data.vanType, data.worker, data.distance, data.itemsToAssemble, data.itemsToDismantle, stoppage)

        if (data.price != price) {
            // return res.status(400).send({
            //     msg: "invalid price, calculate again",
            //     data
            // })
            data.price = price
        }
    }

    const quote = await prisma.quotation.findFirst({
        where: {
            email: data.email
        }
    })
    let newQuote;
    if (quote) {
        newQuote = await prisma.quotation.update({
            where: {
                email: data.email
            },
            data: data
        })
    } else {
        newQuote = await prisma.quotation.create({
            data: data
        })
    }
    return res.send({
        msg: "quote created",
        newQuote
    })
})

app.get("/history/:email", async (req, res): Promise<any> => {
    const result = emailSchema.safeParse(req.params.email)
    if (!result.success) {
        return res.status(400).send({
            msg: "invalid inputs",
            result
        })
    }
    const history = await prisma.booking.findMany({
        where: {
            email: req.params.email
        }
    })
    if (!history) {
        return res.status(400).send({
            msg: "no history"
        })
    }
    return res.send({
        msg: "user found",
        history
    })
})

app.get("/history/all/:key", async (req, res): Promise<any> => {
    if (req.params.key !== "rishi") {
        return res.status(400).send("unauthorized")
    }
    const history = await prisma.booking.findMany()
    return res.send({
        history
    })
})

app.use(((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        msg: 'Something broke!',
        err
    });
}) as ErrorRequestHandler)

app.listen(3000, () => console.log('server at 3000'))