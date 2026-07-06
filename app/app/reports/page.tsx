import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Reports</div>
        <div className="question">Your intelligence library.</div>
        <h1>Reports</h1>
        <p>Saved Analyse, Discover and Action Centre outputs will appear here as your report library grows.</p>
      </section>

      <section className="empty-state panel">
        <h2>No saved reports yet.</h2>
        <p>Create an Analyse report, Discover brief or Action Centre document to start building your intelligence library.</p>
        <div className="button-row">
          <Button href="/app/analyse" variant="secondary">Analyse conversations</Button>
          <Button href="/app/discover" variant="orange">Discover opportunities</Button>
          <Button href="/app/briefs" variant="secondary">Create Brief</Button>
        </div>
      </section>
    </>
  );
}
