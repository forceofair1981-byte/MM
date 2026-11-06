import {localizedExerciseAliases,exerciseLabel} from './i18n.js';
import {E,names} from './catalog.js';

export const EXERCISE_GROUPS=[
 {id:'all',label:'全種目'},
 {id:'chest',label:'胸'},
 {id:'shoulders',label:'肩・僧帽筋'},
 {id:'back',label:'背中'},
 {id:'legs',label:'脚・臀部'},
 {id:'arms',label:'腕・前腕'},
 {id:'core',label:'腹筋・体幹'}
];
const groupMuscles={
 chest:new Set(['chest_up','chest','serratus']),
 shoulders:new Set(['delt_front','delt_side','delt_rear','traps_upper']),
 back:new Set(['lats','traps_mid','traps_lower','erectors']),
 legs:new Set(['quads','adductors','glute_med','glutes','hamstrings','hip_flexor','gastrocnemius','soleus','tibialis']),
 arms:new Set(['biceps','brachialis','triceps','forearm_front','forearm_back']),
 core:new Set(['abs_upper','abs_lower','obliques','hip_flexor'])
};
// Explicit exercise-to-equipment classification keyed by canonical names,
// so adding or reordering exercises does not silently change their category.
// Ambiguous generic names are kept under '器具指定なし'.
const EQUIPMENT_NAMES = {
 barbell: ['ベンチプレス','インクラインベンチプレス','デクラインベンチプレス','リバースグリップベンチプレス','ナローグリップベンチプレス','バーベルショルダープレス','アップライトロー','ハイプル','ベントオーバーロー','ペンドレイロー','Tバーロー','デッドリフト','ルーマニアンデッドリフト','スティッフレッグデッドリフト','スモウデッドリフト','グッドモーニング','スクワット','ハイバースクワット','ローバースクワット','フロントスクワット','ヒップスラスト','プリーチャーカール','リバースカール','フレンチプレス','スカルクラッシャー','クリーン','ハングクリーン','スナッチ','プッシュプレス','スラスター','バックプレス','ナローデッドリフト','EZバーカール','ドラッグカール','JMプレス'],
 dumbbell: ['インクラインダンベルプレス','ダンベルプレス','デクラインダンベルプレス','ダンベルフライ','プルオーバー','ダンベルショルダープレス','アーノルドプレス','サイドレイズ','ダンベルサイドレイズ','フロントレイズ','リアレイズ','ベントオーバーリアレイズ','Yレイズ','ワンハンドロー','チェストサポーテッドロー','ゴブレットスクワット','ブルガリアンスクワット','スプリットスクワット','ランジ','ウォーキングランジ','リバースランジ','ステップアップ','アームカール','ダンベルカール','ハンマーカール','インクラインカール','コンセントレーションカール','リストカール','リバースリストカール','オーバーヘッドトライセプスエクステンション','サイドベント','シーテッドリアレイズ','インクラインリアレイズ','片手ショルダープレス','リーンアウェイサイドレイズ','ダンベルスクイーズプレス','インクラインダンベルフライ','デクラインダンベルフライ','スモウスクワット','シングルレッグルーマニアンデッドリフト','スパイダーカール','ゾットマンカール','クロスボディハンマーカール','ダンベルオーバーヘッドエクステンション'],
 bodyweight: ['ディップス','腕立て伏せ','インクラインプッシュアップ','デクラインプッシュアップ','プルアップ','懸垂','バックエクステンション','シシースクワット','ノルディックカール','グルートハムレイズ','グルートブリッジ','ドンキーキック','カーフレイズ','スタンディングカーフレイズ','ドンキーカーフレイズ','ティビアリスレイズ','ベンチディップス','クランチ','シットアップ','プランク','サイドプランク','レッグレイズ','ハンギングレッグレイズ','ロシアンツイスト','デッドバグ','バードドッグ','インバーテッドロー','アンダーグリップチンニング','ニュートラルグリップ懸垂','ワイドプッシュアップ','サイドランジ','カーテシーランジ','フロッグポンプ','サイドライイングヒップアブダクション','コペンハーゲンプランク','リバースクランチ','バイシクルクランチ','ハンギングニーレイズ','ドラゴンフラッグ','ヒールタッチ','トゥズトゥバー'],
 machine: ['スミスマシンベンチプレス','チェストプレス','インクラインチェストプレス','ペックフライ','マシンショルダープレス','リバースペックデック','マシンロー','ローイングマシン（筋トレ）','ラットプルダウン','ワイドグリップラットプルダウン','リバースグリップラットプルダウン','アシストプルアップ','リバースハイパー','スミススクワット','ハックスクワット','Vスクワット','レッグプレス','ワイドレッグプレス','レッグエクステンション','レッグカール','シーテッドレッグカール','ライイングレッグカール','ヒップアブダクション','アダクション','シーテッドカーフレイズ','レッグプレスカーフレイズ','インナーサイ','アウターサイ','レッグアダクター','レッグアブダクター','リアデルトマシン','スミスマシンシュラッグ','マシンシュラッグ','マシンサイドレイズ','ハイロー','ローイング（プレートロード）','パラレルグリップラットプルダウン','ナローグリップラットプルダウン','Vバープルダウン','スミスインクラインベンチプレス','スミスデクラインベンチプレス','マシンディップス','ベルトスクワット','シングルレッグプレス','リバースハックスクワット','シーテッドアブダクター','シーテッドアダクター','アブドミナルクランチマシン','アブドミナルツイストマシン'],
 cable: ['ケーブルフライ','ケーブルクロスオーバー','ローケーブルフライ','ハイケーブルフライ','ケーブルサイドレイズ','ケーブルフロントレイズ','フェイスプル','シーテッドロー','ストレートアームプルダウン','ケーブルキックバック','ケーブルカール','トライセプスプッシュダウン','ケーブルキックバック（腕）','ケーブルクランチ','ウッドチョッパー','パロフプレス','ケーブルリアレイズ','クロスケーブルリアレイズ','ワンハンドケーブルリアレイズ','リバースケーブルフライ','ケーブルシュラッグ','ケーブルアップライトロー','ワンハンドケーブルロー','ケーブルプルスルー','ケーブルヒップアブダクション','ケーブルヒップアダクション','ローププレスダウン','リバースグリッププッシュダウン','シングルアームプッシュダウン'],
 band: ['バンドプルアパート','モンスターウォーク','サイドウォーク','クラムシェル'],
 kettlebell: ['ケトルベルスイング'],
 other: ['プレートプレス','スヴェンドプレス','アブホイール','トラップバーシュラッグ','ランドマインショルダープレス','ランドマインロー','メドウズロー','ランドマインスクワット'],
 unspecified: ['ショルダープレス','シーテッドショルダープレス','シュラッグ','トライセップス','リアデルトロウ'],
};
const equipmentByName=new Map(Object.entries(EQUIPMENT_NAMES).flatMap(([category,values])=>values.map(name=>[name,category])));
export const equipmentForExercise=exercise=>equipmentByName.get(exercise?.n)||'unspecified';
export const EXERCISE_EQUIPMENT=[
 {id:'all',label:'すべて'},
 {id:'dumbbell',label:'ダンベル'},
 {id:'barbell',label:'バーベル'},
 {id:'bodyweight',label:'自重'},
 {id:'machine',label:'マシン'},
 {id:'cable',label:'ケーブル'},
 {id:'band',label:'バンド'},
 {id:'kettlebell',label:'ケトルベル'},
 {id:'other',label:'その他の器具'},
 {id:'unspecified',label:'器具指定なし'}
];
export function exerciseEquipmentCounts(query='',group='all'){
 const found=searchExerciseDictionary(query,group);
 const counts=Object.fromEntries(EXERCISE_EQUIPMENT.map(row=>[row.id,0]));
 counts.all=found.length;
 for(const row of found)counts[row.equipment]++;
 return counts;
}
export const exerciseSearchNormalize=text=>String(text||'').normalize('NFKC').toLowerCase().replace(/[\s　]+/g,'').trim();
const index=E.map((exercise,i)=>({
 i,
 exercise,
 equipment:equipmentForExercise(exercise),
 aliases:localizedExerciseAliases(exercise).map(exerciseSearchNormalize),
 haystack:exerciseSearchNormalize([...localizedExerciseAliases(exercise),...exercise.p.map(id=>names[id]),...exercise.s.map(id=>names[id])].join(' '))
}));
export function searchExerciseDictionary(query='',group='all',equipment='all'){
 const q=exerciseSearchNormalize(query);
 const allowed=groupMuscles[group];
 return index.filter(row=>(!q||row.haystack.includes(q))&&(!allowed||row.exercise.p.some(id=>allowed.has(id)))&&(equipment==='all'||row.equipment===equipment))
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
