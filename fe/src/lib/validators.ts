import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email khong hop le"),
    password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
    confirmPassword: z.string().min(6, "Vui long xac nhan mat khau"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mat khau xac nhan khong khop",
  });

export const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Ten nguoi nhan qua ngan"),
  shippingPhone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "So dien thoai khong hop le"),
  shippingAddress: z.string().min(10, "Dia chi qua ngan"),
  note: z.string().optional(),
  paymentMethod: z.enum(["COD", "VNPay"]),
});
