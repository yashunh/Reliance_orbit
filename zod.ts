import { z } from "zod"

export const vanType = z.enum(["Small","Medium","Large","Luton"])

export const extraWorker = z.number().min(0)

export const pickupFloor = z.number().min(0)

export const isLiftAvaialble = z.boolean()

export const location = z.string()

export const propertyType = z.string()

export const distance = z.number()

export const pickupLocation = z.object({
    location: location,
    floor: pickupFloor,
    lift: isLiftAvaialble
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

export const loginWithEmail = z.object({
    email: z.string().email(),
})

export const loginWithNumber = z.object({
    phoneNumber: z.string()
})