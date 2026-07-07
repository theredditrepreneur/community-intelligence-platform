import { SavedReportsWorkspace } from '@/components/reports/SavedReportsWorkspace';

export default function ReportsPage() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Intelligence Library</div>
        <div className="question">Your intelligence library.</div>
        <h1>Saved Briefs</h1>
        <p>Action Centre briefs you save in this browser will appear here as your intelligence library grows.</p>
      </section>

      <SavedReportsWorkspace />
    </>
  );
}
