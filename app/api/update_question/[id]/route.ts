import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    try {
        let data = await req.json();
        console.log(data);
        let data_no_id = { ...data };
        delete data_no_id["id"];
        data_no_id["corrected"] = true;
        console.log(data_no_id);
        const updated = await prisma.tests.update({
            where: {
                id: id,
            },
            data: data_no_id,
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.log((err as Error).stack);
        return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    try {
        const deleted = await prisma.tests.delete({
            where: {
                id: id,
            },
        });
        return NextResponse.json(deleted);
    } catch (err) {
        console.log((err as Error).stack);
        return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}