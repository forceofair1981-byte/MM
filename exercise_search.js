import {localizedExerciseAliases,exerciseLabel} from './i18n.js';
import {E,names} from './catalog.js';

export const EXERCISE_GROUPS=[
 {id:'all',label:'全種目'},
 {id:'chest',label:'胸'},
 {id:'shoulders',label:'肩・僧帽筋'},
 {id:'back',label:'背中'},
 {id:'legs',label:'脚・臀部'},
 {id:'arms',label:'腕・前腕'},
 {id:'core',label:'体幹'}
];
const groupMuscles={
 chest:new Set(['chest_up','chest','serratus']),
 shoulders:new Set(['delt_front','delt_side','delt_rear','traps_upper']),
 back:new Set(['lats','traps_mid','traps_lower','erectors']),
 legs:new Set(['quads','adductors','glute_med','glutes','hamstrings','hip_flexor','gastrocnemius','soleus','tibialis']),
 arms:new Set(['biceps','brachialis','triceps','forearm_front','forearm_back']),
 core:new Set(['abs_upper','abs_lower','obliques','hip_flexor'])
};
export const exerciseSearchNormalize=text=>String(text||'').normalize('NFKC').toLowerCase().replace(/[\s　]+/g,'').trim();
const index=E.map((exercise,i)=>({
 i,
 exercise,
 aliases:localizedExerciseAliases(exercise).map(exerciseSearchNormalize),
 haystack:exerciseSearchNormalize([...localizedExerciseAliases(exercise),...exercise.p.map(id=>names[id]),...exercise.s.map(id=>names[id])].join(' '))
}));
export function searchExerciseDictionary(query='',group='all'){
 const q=exerciseSearchNormalize(query);
 const allowed=groupMuscles[group];
 return index.filter(row=>(!q||row.haystack.includes(q))&&(!allowed||row.exercise.p.some(id=>allowed.has(id))))
  .sort((a,b)=>score(a,q)-score(b,q)||a.i-b.i);
}
function score(row,q){if(!q)return 0;if(row.aliases[0]===q)return 0;if(row.aliases.includes(q))return 1;if(row.aliases.some(a=>a.startsWith(q)))return 2;return 3;}
export const exerciseDictionaryCount=E.length;


/** Exercise dictionary -> the same review editor used by free-text parsing.
 * No fabricated weight or repetition count is inserted into the training log.
 */
export function createDictionaryExerciseDraft(exercise,displayName,id){
 if(!exercise||!exercise.n||!Array.isArray(exercise.p)||!Array.isArray(exercise.s))throw Error('種目リストのデータが不正です');
 return {id,name:exercise.n,displayName:displayName||exercise.n,primary:[...exercise.p],secondary:[...exercise.s],equipment:null,
  groups:[{weight:null,reps:null,sets:null,rir:null,impliedSet:false}],raw:''};
}
export function mergeDictionaryDrafts(parsed,drafts=[]){
 const merged={...parsed,exercises:[...parsed.exercises,...drafts]};
 if(merged.exercises.length)merged.warnings=parsed.warnings.filter(message=>message!=='認識できる記録がありません。');
 return merged;
}
export function trainingEntryIsValid(exercise){
 return !!exercise?.groups?.length&&exercise.groups.every(g=>Number.isInteger(g.reps)&&g.reps>=1&&g.reps<=200
  &&Number.isInteger(g.sets)&&g.sets>=1&&g.sets<=50
  &&(g.weight===null||Number.isFinite(g.weight)&&g.weight>=0&&g.weight<=2000)
  &&(g.rir===null||Number.isInteger(g.rir)&&g.rir>=0&&g.rir<=20));
}
/** Compare actual parsed content, not the input textarea (which may be empty for dictionary entries). */
export function sessionContentSignature(session){
 return JSON.stringify({
  exercises:(session?.exercises||[]).map(e=>[e.name,(e.groups||[]).map(g=>[g.weight,g.reps,g.sets,g.rir])]),
  cardio:(session?.cardio||[]).map(c=>[c.name,c.minutes,c.speedKmh,c.distanceKm,c.grade,c.gradeUnit])
 });
}
