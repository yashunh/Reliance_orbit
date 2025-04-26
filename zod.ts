import { z } from "zod"

export const vanType = z.enum(["Small", "Medium", "Large", "Luton"])

export const worker = z.number().min(0)

export const floorSchema = z.number().min(0)

export const isLiftAvaialble = z.boolean()

export const location = z.string()

export const propertyType = z.string()

export const distance = z.number()

export const emailSchema = z.string().email()

export const phoneNumberSchema = z.string()

export const itemsToDismantle = z.number().min(0).optional()

export const itemsToAssemble = z.number().min(0).optional()

export const pickupLocation = z.object({
    location: location,
    floor: floorSchema,
    lift: isLiftAvaialble,
    propertyType: propertyType.optional()
})

export const dropLocation = z.object({
    location: location,
    floor: floorSchema,
    lift: isLiftAvaialble,
    propertyType: propertyType.optional()
})

export const calculatePriceSchema = z.object({
    pickupLocation: pickupLocation,
    dropLocation: dropLocation,
    vanType: vanType,
    worker: worker,
    itemsToDismantle: itemsToDismantle,
    itemsToAssemble: itemsToAssemble
})

export const createUser = z.object({
    username: z.string().optional(),
    email: z.string().email(),
    phoneNumber: z.string().optional()
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
    duration: z.string(),
    quotationRef: z.string(),
    pickupAddress: z.object({}),
    dropAddress: z.object({}),
    vanType: vanType,
    worker: worker,
    itemsToDismantle: itemsToDismantle,
    itemsToAssemble: itemsToAssemble,
    details: orderDetails
})