const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

export async function getCandidateByEmail(email) {
  const res = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`,
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}

export async function getJobs() {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);
  if (!res.ok) {
    const test = await res.text();
    throw new Error(test || `Error ${res.status}`);
  }
  return res.json();
}

export async function applyToJob({
  uuid,
  jobId,
  candidateId,
  applicationId,
  repoUrl,
}) {
  const body = { uuid, jobId, candidateId, applicationId, repoUrl };
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
if (!res.ok) {
  const text = await res.text();
  let message = text || `Error ${res.status}`;
  try {
    const json = JSON.parse(text);
    if (json.details?.fieldErrors) {
      const parts = Object.entries(json.details.fieldErrors).flatMap(
        ([field, msgs]) => msgs.map((m) => `${field}: ${m}`),
      );
      message = parts.length
        ? parts.join("; ")
        : json.message || json.error || message;
    } else if (json.message) message = json.message;
    else if (json.error) message = json.error;
  } catch (_) {}
  throw new Error(message);
}
  return res.json();
}