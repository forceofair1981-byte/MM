// Calendar-based history filters. No date-based purge is ever performed.
export function historyCutoff(period,today){
 if(period==='all'||!period||!/^\d{4}-\d{2}-\d{2}$/.test(today))return '';
 const [year,month,day]=today.split('-').map(Number);
 const anchor=new Date(year,month-1,day,12);
 if(period==='3y'){
  // Feb 29 of leap years becomes Feb 28 three calendar years earlier.
  const before=new Date(year-3,month-1,1,12);
  before.setDate(Math.min(day,new Date(year-3,month,0,12).getDate()));
  return [before.getFullYear(),String(before.getMonth()+1).padStart(2,'0'),String(before.getDate()).padStart(2,'0')].join('-');
 }
 const n=Number(period);
 if(!Number.isInteger(n)||n<1||n>36500)return '';
 anchor.setDate(anchor.getDate()-(n-1));
 return [anchor.getFullYear(),String(anchor.getMonth()+1).padStart(2,'0'),String(anchor.getDate()).padStart(2,'0')].join('-');
}
