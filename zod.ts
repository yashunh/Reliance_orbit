import { z } from "zod"

export const vanType = z.enum(["Small", "Medium", "Large", "Luton"])

export const extraWorker = z.number().min(0)

export const pickupFloor = z.number().min(0)

export const isLiftAvaialble = z.boolean()

export const location = z.string()

export const propertyType = z.string()

export const distance = z.number()

export const emailSchema = z.string().email()

export const phoneNumberSchema = z.string()

export const pickupLocation = z.object({
    location: location,
    floor: pickupFloor,
    lift: isLiftAvaialble,
    propertyType: propertyType.optional()
})

export const dropLocation = z.object({
    location: location,
    floor: pickupFloor
})

export const calculatePrice = z.object({
    pickupLocation: pickupLocation,
    dropLocation: dropLocation,
    vanType: vanType,
    extraWorker: extraWorker
})

export const createUser = z.object({
    username: z.string(),
    email: z.string().email(),
    phoneNumber: z.string()
})

const orderDetails = z.object({})

export const newSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    price: z.number(),
    distance: z.number(),
    route: z.string(),
    fromLocation: pickupLocation,
    toLocation: dropLocation,
    pickupdDate: z.string(),
    pickupdTime: z.string(),
    dropDate: z.string(),
    dropTime: z.string(),
    details: orderDetails
})