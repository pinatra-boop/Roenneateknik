export default function AdminServicesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Services</h1>
        <p className="text-text-muted text-sm">Administrér dine serviceydelser</p>
      </div>
      <div className="glass-light rounded-2xl border border-border p-8 text-center text-text-muted">
        <p>Services CMS – kommer snart</p>
        <p className="text-sm mt-2">
          Du kan administrere services direkte i databasen eller via Prisma Studio.
        </p>
      </div>
    </div>
  );
}
