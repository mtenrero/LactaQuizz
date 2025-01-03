import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const filenames = await prisma.tests.findMany({
            distinct: 'source_file',
            select: { source_file: true }
        });

        const options = filenames.map(file => file.source_file);
        return NextResponse.json(options);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
