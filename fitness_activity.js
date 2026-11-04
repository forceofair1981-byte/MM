// Activity rings only: each category counts a calendar day once, even with multiple sessions.
// Classify using the app's normalized arrays, never free-text names or vital signs.
export function summarizeActivityRings({logs=[],meals=[],days=[]}={}) {
 const eligible=new Set(days);
 const strength=new Set(),cardio=new Set(),food=new Set();
 for(const log of logs){
  if(!eligible.has(log?.date))continue;
  if(Array.isArray(log.exercises)&&log.exercises.length)strength.add(log.date);
  if(Array.isArray(log.cardio)&&log.cardio.length)cardio.add(log.date);
 }
 for(const meal of meals){
  if(eligible.has(meal?.date))food.add(meal.date);
 }
 return {strengthDays:strength.size,cardioDays:cardio.size,foodDays:food.size};
}
