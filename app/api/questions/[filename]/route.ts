import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const filename = (await params).filename;

    try {
        const questions = await prisma.tests.findMany({
            where: {
                source_file: Array.isArray(filename) ? filename[0] : filename,
            },
        });

        return NextResponse.json(questions);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
