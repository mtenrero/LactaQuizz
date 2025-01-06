// route.ts
import { PrismaClient, Tests } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js'


const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
  try {
    // parse query param
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Missing query param' }, { status: 400 });
    }
    const cachedItems = await prisma.tests.findMany();

    const options = {
        includeScore: true,
        // Search in `author` and in `tags` array
        keys: ['question']
      }

    const fuse = new Fuse(cachedItems, options);
    const result = fuse.search(query)

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
