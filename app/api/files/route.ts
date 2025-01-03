import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import cleanName from '../../../utils/clean';

export async function GET(req: NextRequest) {
    const publicDir = path.join(process.cwd(), 'public/tests');
    try {
        const files = await fs.promises.readdir(publicDir);
        const cleaned_files = files.map((file) => file);
        return NextResponse.json(cleaned_files);
    } catch (err) {
        return NextResponse.json({ error: 'Unable to read files' }, { status: 500 });
    }
}
