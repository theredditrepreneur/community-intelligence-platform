import { NextResponse } from 'next/server';
import { freeScoreServerConfig } from '@/lib/free-score/config';
import { recoverInterruptedJobs } from '@/lib/free-score/jobs';
export async function POST(request: Request) { if (!freeScoreServerConfig.workerEnabled) return NextResponse.json({ error:'Worker is disabled.' },{status:503}); if (!process.env.SUPABASE_WORKER_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.SUPABASE_WORKER_SECRET}`) return NextResponse.json({error:'Unauthorized'},{status:401}); const recovered = await recoverInterruptedJobs(); return NextResponse.json({ recovered: recovered.data?.length || 0 }); }
