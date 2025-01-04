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

        const options = filenames
            .map(file => file.source_file)
            .sort((a, b) => {
                const matchA = a.match(/(\d{4}-\d{2}-\d{2})/);
                const matchB = b.match(/(\d{4}-\d{2}-\d{2})/);
                const dateA = new Date(matchA ? matchA[0] : '');
                const dateB = new Date(matchB ? matchB[0] : '');
            return dateA.getTime() - dateB.getTime();
            });
        return NextResponse.json(options);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
