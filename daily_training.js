// One calendar day owns its strength minutes and normal between-set rest.
// Stored sessions remain separate for exercises, cardio and intensity.
export function validDailyNumber(value,max) {
  if(value===null||value===undefined||value==='')return null;
  const n=Number(value);
  return Number.isFinite(n)&&n>=0&&n<=max?n:null;
}
export function normalizeDailyTraining(raw, sessions=[]) {
  const days={};
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)) {
    for(const [date,item] of Object.entries(raw)) {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!item||typeof item!=='object')continue;
      days[date]={minutes:validDailyNumber(item.minutes,600),restMinutes:validDailyNumber(item.restMinutes,30),legacyRestConflict:Boolean(item.legacyRestConflict),legacyDurationReview:Boolean(item.legacyDurationReview)};
    }
  }
  const grouped=new Map();
  for(const s of sessions||[]){
    if(!s?.date)continue;
    if(!grouped.has(s.date))grouped.set(s.date,[]);
    grouped.get(s.date).push(s);
  }
  for(const [date,items] of grouped) {
    if(Object.hasOwn(days,date))continue;
    // Migration: old builds stored training duration per session; SUM, don't overwrite.
    const durations=items.map(x=>validDailyNumber(x.minutes,600)).filter(v=>v!==null);
    const rest=items.map(x=>validDailyNumber(x.restMinutes,30)).filter(v=>v!==null);
    const distinct=new Set(rest);
    const total=durations.reduce((a,b)=>a+b,0);
    const duplicateLong=durations.length>1 && durations.some((v,i)=>v>=30&&durations.indexOf(v)!==i);
    days[date]={minutes:durations.length&&total<=600?total:null,
      restMinutes:rest.length?rest[0]:null,legacyRestConflict:distinct.size>1,
      legacyDurationReview:total>600||duplicateLong};
  }
  return days;
}
export function allocateDailyTraining(logs,days) {
  const grouped=new Map();
  for(const log of logs){if(!grouped.has(log.date))grouped.set(log.date,[]);grouped.get(log.date).push(log);}
  for(const [date,sessions] of grouped){
    const day=days[date];if(!day)continue;
    const strength=sessions.filter(s=>Array.isArray(s.exercises)&&s.exercises.length);
    const weights=strength.map(s=>Math.max(1,s.exercises.reduce((total,e)=>total+(e.groups||[]).reduce((v,g)=>v+(Number(g.sets)||0),0),0)));
    const sum=weights.reduce((a,b)=>a+b,0);
    // Only distribute known strength time among strength sessions; avoid double-counting.
    let assigned=0;
    for(const [i,s] of strength.entries()){
      if(day.minutes===null)s.minutes=null;
      else if(i===strength.length-1)s.minutes=Math.max(0,Math.round((day.minutes-assigned)*100000)/100000);
      else {s.minutes=Math.round(day.minutes*weights[i]/sum*100000)/100000;assigned+=s.minutes;}
    }
    for(const s of sessions){
      if(!strength.includes(s))s.minutes=null;
      s.restMinutes=day.restMinutes;
    }
  }
  return logs;
}
export function dailyTrainingForDate(days,date) {
  return days?.[date]||{minutes:null,restMinutes:null,legacyRestConflict:false};
}
