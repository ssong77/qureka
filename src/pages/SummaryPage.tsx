import React, { useState } from 'react';
import { createSummary } from '../api/summary';

function SummaryPage() {
  const [file, setFile] = useState<File|null>(null);
  const [summaryText, setSummaryText] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;
    try {
      const res = await createSummary(file);
      setSummaryText(res.data.summary);
    } catch (err) {
      console.error(err);
      alert('요약 생성에 실패했습니다.');
    }
  };

  return (
    <div>
      <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} />
      <button onClick={handleUpload}>요약 생성</button>
      {summaryText && <pre>{summaryText}</pre>}
    </div>
  );
}

export default SummaryPage;
