import { useState, useEffect } from "react";
import { getJobs } from "../../api";
import JobCard from "../../components/JobCard/JobCard";
import "./JobList.css";

export default function JobList({ candidate, onMessage }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getJobs()
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="job-list__loading">Cargando posiciones…</p>;
  if (error) return <p className="job-list__error">Error: {error}</p>;
  if (jobs.length === 0) return <p className="job-list__empty">No hay posiciones disponibles.</p>;

  return (
    <section>
      <h2 className="job-list__title">Posiciones disponibles</h2>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          candidate={candidate}
          onApplySuccess={() =>
            onMessage?.("Postulación enviada correctamente.", "success")
          }
          onApplyError={(msg) => onMessage?.(msg, "error")}
        />
      ))}
    </section>
  );
}
