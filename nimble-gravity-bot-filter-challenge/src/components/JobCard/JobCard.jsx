import { useState } from 'react';
import { applyToJob } from '../../api';
import './JobCard.css';

export default function JobCard({ job, candidate, onApplySuccess, onApplyError }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setSubmitting(true);
    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        repoUrl: repoUrl.trim(),
      });
      onApplySuccess?.();
    } catch (err) {
      onApplyError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="job-card">
      <h3 className="job-card__title">{job.title}</h3>
      <form className="job-card__form" onSubmit={handleSubmit}>
        <input
          type="url"
          className="job-card__input"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          className="job-card__submit"
          disabled={submitting || !repoUrl.trim()}
        >
          {submitting ? 'Enviando…' : 'Submit'}
        </button>
      </form>
    </article>
  );
}
