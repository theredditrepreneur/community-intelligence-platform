import { SavedReportsWorkspace } from '@/components/reports/SavedReportsWorkspace';

export default function ReportsPage() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Reports</div>
        <div className="question">Your intelligence library.</div>
        <h1>Reports</h1>
        <p>Saved Analyse, Discover and Action Centre outputs will appear here as your report library grows.</p>
      </section>

      <SavedReportsWorkspace />
    </>
  );
}
