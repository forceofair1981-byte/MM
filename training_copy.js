// Format a saved calendar day's training as plain text, independent of UI filters.
// Always use normalized, edited exercise groups rather than the original free text.
export function trainingLogsForDate(logs, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) return [];
  return (Array.isArray(logs) ? logs : [])
    .filter(log => log?.date === date)
    .sort((a,b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.id || '').localeCompare(String(b.id || '')));
}

function quantity(value, suffix) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && value !== null && value !== undefined && value !== ''
    ? `${numeric.toLocaleString('ja-JP',{maximumFractionDigits:3})}${suffix}` : '';
}
function validNumber(value) {return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));}
function cardioLine(cardio) {
  const details = [];
  if (validNumber(cardio.minutes)) details.push(quantity(cardio.minutes,'分'));
  if (validNumber(cardio.distanceKm)) details.push(quantity(cardio.distanceKm,'km'));
  if (validNumber(cardio.speedKmh)) details.push(quantity(cardio.speedKmh,'km/h'));
  if (validNumber(cardio.grade)) details.push(`傾斜 ${quantity(cardio.grade,cardio.gradeUnit === 'degrees' ? '度' : '%')}`);
  return `・${cardio.name || '有酸素運動'}${details.length ? '：' + details.join(' / ') : ''}`;
}
export function formatTrainingDayText(logs, date, dailyTraining={}) {
  const sessions = trainingLogsForDate(logs, date);
  if (!sessions.length) return '';
  const out = [`【トレーニング記録】${date.replaceAll('-','/')}（${sessions.length}セッション）`, ''];
  const daily=dailyTraining?.[date];
  const totalMinutes=daily?daily.minutes:sessions.reduce((n,s)=>n+(validNumber(s.minutes)?Number(s.minutes):0),0);
  const anyMinutes=daily?validNumber(daily.minutes):sessions.some(s=>validNumber(s.minutes));
  const restMinutes=daily?daily.restMinutes:sessions.find(s=>validNumber(s.restMinutes))?.restMinutes;
  const dayMeta=[];
  if(anyMinutes)dayMeta.push(`筋トレ合計 ${quantity(totalMinutes,'分')}`);
  if(validNumber(restMinutes))dayMeta.push(`セット間休憩 ${quantity(restMinutes,'分/セット')}`);
  if(dayMeta.length)out.push(dayMeta.join(' / '),'');
  let exerciseCount = 0, setCount = 0, totalWeight = 0;
  sessions.forEach((session, idx) => {
    if (sessions.length > 1) out.push(`■ セッション${idx + 1}`);
    for (const exercise of (session.exercises || [])) {
      exerciseCount++;
      out.push(`・${exercise.displayName || exercise.name || '未登録種目'}`);
      for (const group of (exercise.groups || [])) {
        const weight = validNumber(group.weight) ? `${quantity(group.weight,'kg')} × ` : '';
        const reps=validNumber(group.reps)?quantity(group.reps,'回'):'回数未入力';
        const sets=validNumber(group.sets)?quantity(group.sets,'セット'):'セット数未入力';
        const rir=validNumber(group.rir)?`（RIR ${quantity(group.rir,'')}）`:'';
        out.push(`  ${weight}${reps} × ${sets}${rir}`);
        if (validNumber(group.sets)) setCount += Number(group.sets);
        if (validNumber(group.weight) && validNumber(group.reps) && validNumber(group.sets))
          totalWeight += Number(group.weight) * Number(group.reps) * Number(group.sets);
      }
    }
    for (const c of (session.cardio || [])) out.push(cardioLine(c));
    if (String(session.notes || '').trim()) out.push(`メモ：${String(session.notes).trim()}`);
    if (idx < sessions.length-1) out.push('');
  });
  out.push('',`合計：${exerciseCount}種目 / ${setCount}セット / 総挙上重量 ${quantity(totalWeight,'kg')}`);
  return out.join('\n');
}
