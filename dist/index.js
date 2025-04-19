"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("./zod");
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '../.env' });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prisma = new client_1.PrismaClient();
const mile = 1609.344;
app.post("/price", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = zod_1.calculatePrice.safeParse(req.body);
    if (!result.success) {
        res.status(400).send("invalid inputs");
    }
    const { pickupLocation, dropLocation, vanType, extraWorker } = req.body;
    const getLocationDetails = yield axios_1.default.get(process.env.DISTANCE_API || "", {
        params: {
            origins: pickupLocation.location,
            destinations: dropLocation.location
        }
    });
    let price = 0;
    if (pickupLocation.lift) {
        price += 30;
    }
    else if (pickupLocation.floor <= 5 && pickupLocation.floor >= 0) {
        price += pickupLocation.floor * 10;
    }
    if (vanType === "Small") {
        price += 60;
    }
    else if (vanType === "Medium") {
        price += 70;
    }
    else if (vanType === "Large") {
        price += 80;
    }
    else if (vanType === "Luton") {
        price += 90;
    }
    if (extraWorker == 1) {
        price += 20;
    }
    else if (extraWorker == 2) {
        price += 40;
    }
    const distance = getLocationDetails.data.rows[0].elements[0].distance.value / mile;
    if (distance <= 30) {
        price += distance * 2;
    }
    else if (distance <= 60) {
        price += distance * 1.5;
    }
    else if (distance <= 90) {
        price += distance * 1.3;
    }
    else {
        price += distance;
    }
    res.send({ price });
}));
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
app.post("/autocomplete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { place } = req.body;
    if (!zod_1.location.safeParse(place).success) {
        res.status(400).send("invalid inputs");
    }
    const response = yield axios_1.default.get(process.env.AUTOCOMPLETE_API || "", {
        params: {
            input: place,
        }
    });
    res.send(response.data);
}));
app.post("/distance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origin, destination } = req.body;
    if (!zod_1.location.safeParse(origin).success || !zod_1.location.safeParse(destination).success) {
        res.status(400).send("invalid inputs");
    }
    const response = yield axios_1.default.get(process.env.DISTANCE_API || "", {
        params: {
            origins: origin,
            destinations: destination
        }
    });
    res.send(response.data);
}));
app.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = zod_1.newSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).send("invalid inputs");
    }
    const createdAt = new Date().toLocaleString();
    req.body.createdAt = createdAt;
    const newOrder = yield prisma.booking.create({
        data: req.body
    });
    res.send({
        msg: "order created",
        newOrder
    });
}));
app.get("/history/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = zod_1.emailSchema.safeParse(req.params.email);
    if (!result.success) {
        res.status(400).send("invalid inputs");
    }
    const history = yield prisma.booking.findMany({
        where: {
            email: req.params.email
        },
        take: 20
    });
    if (!history) {
        res.status(400).send({
            msg: "no history"
        });
    }
    res.send({
        msg: "user found",
        history
    });
}));
app.listen(3000, () => console.log('server at 3000'));
