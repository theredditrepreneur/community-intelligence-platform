import type { Metadata } from 'next';
import { FreeScoreExperience } from '@/components/free-score/FreeScoreExperience';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function FreeScoreEmbedPage() { return <main className="free-score-page embed-page"><FreeScoreExperience embed /></main>; }
