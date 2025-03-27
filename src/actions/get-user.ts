'use server'

import { cookies } from "next/headers";

export async function getUser() {
    const token = (await cookies()).get("token")?.value;
    return !!token;
}