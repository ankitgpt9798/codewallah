const { z } = require("zod");

const signupSchema = z.object({
    firstName: z
        .string()
        .min(3, "First name must contain at least 3 characters"),

    emailId: z
        .string()
        .email("Invalid email"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
});

module.exports = {
    signupSchema
};