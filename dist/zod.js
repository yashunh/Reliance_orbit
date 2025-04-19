"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSchema = exports.createUser = exports.calculatePrice = exports.dropLocation = exports.pickupLocation = exports.phoneNumberSchema = exports.emailSchema = exports.distance = exports.propertyType = exports.location = exports.isLiftAvaialble = exports.pickupFloor = exports.extraWorker = exports.vanType = void 0;
const zod_1 = require("zod");
exports.vanType = zod_1.z.enum(["Small", "Medium", "Large", "Luton"]);
exports.extraWorker = zod_1.z.number().min(0);
exports.pickupFloor = zod_1.z.number().min(0);
exports.isLiftAvaialble = zod_1.z.boolean();
exports.location = zod_1.z.string();
exports.propertyType = zod_1.z.string();
exports.distance = zod_1.z.number();
exports.emailSchema = zod_1.z.string().email();
exports.phoneNumberSchema = zod_1.z.string();
exports.pickupLocation = zod_1.z.object({
    location: exports.location,
    floor: exports.pickupFloor,
    lift: exports.isLiftAvaialble,
    propertyType: exports.propertyType.optional()
});
exports.dropLocation = zod_1.z.object({
    location: exports.location,
    floor: exports.pickupFloor
});
exports.calculatePrice = zod_1.z.object({
    pickupLocation: exports.pickupLocation,
    dropLocation: exports.dropLocation,
    vanType: exports.vanType,
    extraWorker: exports.extraWorker
});
exports.createUser = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string()
});
const orderDetails = zod_1.z.object({});
exports.newSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string(),
    price: zod_1.z.number(),
    distance: zod_1.z.number(),
    route: zod_1.z.string(),
    fromLocation: exports.pickupLocation,
    toLocation: exports.dropLocation,
    pickupdDate: zod_1.z.string(),
    pickupdTime: zod_1.z.string(),
    dropDate: zod_1.z.string(),
    dropTime: zod_1.z.string(),
    details: orderDetails
});
