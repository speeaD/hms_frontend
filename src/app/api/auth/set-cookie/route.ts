import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        // Delete the cookies
        (await cookies()).delete('auth-token');
        (await cookies()).delete('quizTaker');

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json(
            { success: false, message: `Failed to delete cookie: ${e}` },
            { status: 500 }
        );
    }
}