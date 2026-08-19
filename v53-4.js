'use strict';
/* V5.3 small correctness fixes. */
const v53StrategyAdjustmentBase=v53StrategyShotAdjustment;
v53StrategyShotAdjustment=function(me,opp){if(opp?.id===me?.id&&career?.focus?.oppId&&career.currentTournament)opp=tp(career.currentTournament,career.focus.oppId)||opp;return v53StrategyAdjustmentBase(me,opp)};
const v53InsightApplyBase=v53ApplyInsight;
v53ApplyInsight=function(c,targetAge){const healthBefore=career?.health;v53InsightApplyBase(c,targetAge);if(c.risk<0&&Number.isFinite(healthBefore)){career.health=clamp(healthBefore+Math.abs(c.risk),25,100);saveCareer()}};
document.addEventListener('DOMContentLoaded',()=>{document.documentElement.dataset.skReady='53';});
