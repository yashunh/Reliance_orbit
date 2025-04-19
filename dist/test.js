"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const num = zod_1.z.number();
console.log(num.safeParse(5.6));
