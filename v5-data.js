'use strict';
// V5 additions. Existing data.js supplies SKILLS / PERSONALITIES / NBA_POOL / A.
Object.assign(PERSONALITIES,{
  zaza:{name:'Zaza Pachulia｜强硬碰撞型',tone:'身体接触很多，比赛容易出现落脚点与卡位争议。',variance:1.08,clutch:0,injury:1.18,friend:-2,rival:4,temper:4,lines:['这不是投篮训练，街球有身体。','你要往里走，就得准备好碰撞。']},
  patbev:{name:'Patrick Beverley｜缠斗挑衅型',tone:'从第一回合就贴身纠缠，嘴上也不会停。',variance:1.13,clutch:1,injury:1.05,friend:-1,rival:5,temper:5,lines:['我不管你名气多大，今天先让你难受。','别想舒服运三下球。']},
  metta:{name:'Metta World Peace｜高强度对抗型',tone:'身体对抗与情绪都很高，容易把一场球推到失控边缘。',variance:1.16,clutch:1,injury:1.08,friend:-1,rival:5,temper:6,lines:['今天这场不会轻。','你想进禁区，先过我这一关。']},
  rodman:{name:'Dennis Rodman｜混乱制造者',tone:'篮板、地板球和心理战能把比赛节奏搅得完全不像正常篮球。',variance:1.22,clutch:0,injury:1.05,friend:0,rival:4,temper:4,lines:['你投你的，我抢我的。','球落地以后才是我的比赛。']},
  griffin:{name:'Blake Griffin｜爆炸表演型',tone:'只要有一步起跳空间，整个球场都可能突然安静一秒再炸开。',variance:1.08,clutch:1,injury:1.06,friend:1,rival:2,temper:2,lines:['别站篮下太久。','有空间我就起飞。']},
  edwards:{name:'Anthony Edwards｜年轻张扬型',tone:'自信、爱说大话，也真的愿意用最难的动作证明自己。',variance:1.12,clutch:3,injury:.98,friend:1,rival:3,temper:3,lines:['你最好真有点东西，我不想白跑一趟。','最后一球给我，我喜欢这种场面。']}
});
for(const [k,v] of Object.entries(PERSONALITIES)){if(v.temper==null)v.temper=Math.max(0,Math.min(6,Math.round((v.rival||0)+(v.variance||1)-1)))}

function addPlayer(p){if(!NBA_POOL.some(x=>x.id===p.id||x.name===p.name))NBA_POOL.push(p)}
addPlayer({id:'zaza',name:'Zaza Pachulia',pos:'C',h:211,w:122,p:'zaza',a:A('big',{finish:81,dunk:78,mid:65,three:61,handle:58,passing:69,perimeter:61,interior:84,rebound:86,strength:93,speed:58,clutch:68})});
addPlayer({id:'patbev',name:'Patrick Beverley',pos:'PG',h:188,w:82,p:'patbev',a:A('guard',{finish:78,dunk:73,mid:79,three:84,handle:84,passing:78,perimeter:93,interior:67,rebound:78,strength:81,speed:90,clutch:79})});
addPlayer({id:'metta',name:'Metta World Peace',pos:'SF',h:201,w:118,p:'metta',a:A('wing',{finish:85,dunk:83,mid:80,three:82,handle:76,passing:72,perimeter:97,interior:84,rebound:84,strength:96,speed:78,clutch:78})});
addPlayer({id:'rodman',name:'Dennis Rodman',pos:'PF',h:201,w:95,p:'rodman',a:A('wing',{finish:76,dunk:86,mid:56,three:48,handle:67,passing:68,perimeter:92,interior:95,rebound:99,strength:94,speed:88,clutch:69})});
addPlayer({id:'vince',name:'Vince Carter',pos:'SG',h:198,w:100,p:'curry',a:A('wing',{finish:92,dunk:99,mid:88,three:89,handle:88,passing:79,perimeter:82,interior:72,rebound:78,strength:86,speed:92,clutch:87})});
addPlayer({id:'dominique',name:'Dominique Wilkins',pos:'SF',h:203,w:104,p:'iverson',a:A('wing',{finish:95,dunk:99,mid:90,three:76,handle:86,passing:72,perimeter:82,interior:77,rebound:84,strength:91,speed:91,clutch:85})});
addPlayer({id:'rayallen',name:'Ray Allen',pos:'SG',h:196,w:93,p:'curry',a:A('wing',{finish:86,dunk:84,mid:91,three:97,handle:86,passing:78,perimeter:83,interior:69,rebound:73,strength:79,speed:87,clutch:94})});
addPlayer({id:'reggie',name:'Reggie Miller',pos:'SG',h:201,w:84,p:'curry',a:A('wing',{finish:82,dunk:72,mid:90,three:97,handle:83,passing:76,perimeter:77,interior:64,rebound:70,strength:69,speed:86,clutch:96})});

const _griffin=NBA_POOL.find(x=>x.id==='griffin');if(_griffin)_griffin.p='griffin';const _edwards=NBA_POOL.find(x=>x.id==='edwards');if(_edwards)_edwards.p='edwards';
const VOICE={
 'Michael Jordan':{hook:'把名字和比分都记下来',focus:'最后五分',first:'我不在乎你是谁，先让我看看你值不值得记住。',respect:'你让我必须认真，这已经比很多人做得好。'},
 'Kobe Bryant':{hook:'把比赛变成私人训练',focus:'最后一球',first:'别跟我谈潜力。球给你，现在证明。',respect:'这场有几个回合我会回去重看。'},
 'Stephen Curry':{hook:'把防线往半场外拖',focus:'弧顶外两步',first:'你要是站得太里面，我可能会很开心。',respect:'你逼我把出手点往更远处搬了。'},
 'LeBron James':{hook:'反复找同一个错位',focus:'读防守',first:'先看你愿意放什么，再决定我拿什么。',respect:'你调整得够快，这场才有意思。'},
 'Kevin Durant':{hook:'用出手点越过防守',focus:'中距离错位',first:'你可以防得很对，但我还是可能投进。',respect:'你让我必须换到第二种解法。'},
 'Allen Iverson':{hook:'第一步把防守撕开',focus:'连续单挑',first:'别拿身高和名单说事。站我面前就够了。',respect:'你没有退，这点我记住了。'},
 'Shaquille O’Neal':{hook:'把比赛压进禁区',focus:'力量差',first:'先确认一下，你真的想站在我和篮筐中间？',respect:'至少你没被第一下撞出去。'},
 'Blake Griffin':{hook:'寻找起飞的那一步',focus:'篮筐上方',first:'别盯着球，最好也看看我离篮筐还有多远。',respect:'你没躲开对抗，这场够硬。'},
 'Anthony Edwards':{hook:'把高难度动作当普通球打',focus:'爆发力',first:'听说你是这届的新名字？那正好，我喜欢拆新招牌。',respect:'行，你真不是来拍照的。'},
 'Draymond Green':{hook:'把篮球变成辩论赛',focus:'防守和嘴仗',first:'你来之前我就在这种场子里赢过、吵过、再赢过了。',respect:'别误会，我只是承认你今天没软。'},
 'Kevin Garnett':{hook:'从开场就把音量拉满',focus:'身体和情绪',first:'今天你不会有一秒舒服。听清楚，是一秒都没有。',respect:'你扛到最后了。好，明年继续。'},
 'Kawhi Leonard':{hook:'安静地记住你的启动习惯',focus:'弱手侧',first:'开打吧。',respect:'不错。'},
 'Nikola Jokic':{hook:'把快比赛打慢',focus:'角度',first:'你如果一直冲，我就等你自己把空间让出来。',respect:'挺好。打完可以休息了。'},
 'Damian Lillard':{hook:'把最后几分当成自己的时间',focus:'超远关键球',first:'比分到最后再看我站哪儿。',respect:'你把这场拖进了真正的关键时间。'},
 'Chris Paul':{hook:'一点点拆你的站位',focus:'肘区',first:'第一回合我就会知道你最怕什么。',respect:'你改了几次防法，我都看见了。'},
 'Magic Johnson':{hook:'用身高把视野铺满半场',focus:'错位组织',first:'街球也不是只有单挑。你很快会明白。',respect:'你让这场球有了第二层。'},
 'Derrick Rose':{hook:'用第一步抢走反应时间',focus:'直线突破',first:'你眨一下眼，我可能已经到篮下。',respect:'你追上了几次，这不容易。'},
 'Russell Westbrook':{hook:'把每个回合都当转换进攻',focus:'速度和力量',first:'别慢慢来。跟上我。',respect:'你没被节奏甩掉。'},
 'Kyrie Irving':{hook:'把一步空间切成好几种可能',focus:'控球',first:'别猜我往哪边走，猜通常没用。',respect:'你有几次真的把路封死了。'},
 'James Harden':{hook:'不断试探你愿不愿意后退',focus:'后撤步',first:'你退半步，我投；你贴上来，我过。你选。',respect:'你没有给我同一种答案两次。'},
 'Dwyane Wade':{hook:'用身体把突破线撞开',focus:'篮下',first:'三分线外可以聊天，进了油漆区就不聊了。',respect:'你在篮下没让位置。'},
 'Devin Booker':{hook:'不断回到舒服的中距离点',focus:'肘区跳投',first:'你最好知道我最喜欢在哪儿停。',respect:'你逼我离开了几个甜点位。'},
 'Zaza Pachulia':{hook:'把回合拖进大量身体接触',focus:'卡位和落脚点',first:'这里不会有人给你干净跑道。',respect:'你经历了很多接触还站着。'},
 'Patrick Beverley':{hook:'从第一步就贴到你身上',focus:'烦扰持球',first:'名字再大，球也得从我面前运过去。',respect:'你今天没被我烦乱。'},
 'Metta World Peace':{hook:'把空间压成身体对抗',focus:'强硬防守',first:'今天的空间会很小。',respect:'你没躲，这点够了。'},
 'Dennis Rodman':{hook:'让每个篮板都变成第二场比赛',focus:'地板球',first:'你们都在看篮筐，我只看球最后掉哪儿。',respect:'你愿意跟我抢脏球，行。'},
 'Vince Carter':{hook:'让防守先抬头看篮筐',focus:'空中终结',first:'最好别让全场突然站起来。',respect:'你逼我不能只靠起跳。'},
 'Dominique Wilkins':{hook:'连续冲击篮筐上方',focus:'爆发扣篮',first:'如果你退一步，我就从那一步起飞。',respect:'你没有把禁区让出来。'},
 'Ray Allen':{hook:'用脚步把投篮提前准备好',focus:'接球投射',first:'你看到我停下来的时候，往往已经晚了。',respect:'你让我少了几个舒服的落脚点。'},
 'Reggie Miller':{hook:'一边跑一边让防守失去耐心',focus:'三分和心理战',first:'跟紧一点，不然我会提醒你刚才漏了谁。',respect:'你追了一整场，够执着。'}
};

const PERSONA_ARCH={
 aggressive:{keys:['draymond','kg','jordan','patbev','metta','zaza'],playerOpen:['我不是来交朋友的。','先打，再谈尊重。','你想要情绪，我可以陪到底。'],playerWin:['比分已经说完第一部分，剩下的你慢慢消化。','你想记仇可以，我明年还在。'],playerLose:['这场你拿走，下一次别指望我还是这个样子。','我会记得这一场，尤其是最后那几个回合。']},
 calm:{keys:['duncan','kawhi','jokic','lebron'],playerOpen:['先把球打清楚。','不用说太多，回合会给答案。'],playerWin:['好球。下一次再算。','今天是我。就这么简单。'],playerLose:['你今天处理得更好。下次重来。','比分接受，细节回去改。']},
 showman:{keys:['curry','iverson','shaq','griffin','edwards'],playerOpen:['那就让场边的人有点东西看。','既然来了，就别打得太安静。'],playerWin:['今天的镜头可以多留几秒。','这场够热闹，结果也刚好。'],playerLose:['行，这场你的镜头更多。下次换我。','你赢了，但别急着剪集锦。']},
 obsessed:{keys:['kobe','butler'],playerOpen:['我只关心最后谁还站着。','别浪费回合。'],playerWin:['这一场结束，下一场从零开始。','赢了也没什么可庆祝，后面还有人。'],playerLose:['回去练。下一次别让同一个问题再发生。','我会把输掉的每个回合拆开。']}
};

const MENTORS=[
 {id:'kobe',name:'师从 Kobe Bryant',desc:'脚步与中距离训练，逐渐增加中投和关键球倾向。',delta:{mid:1.7,clutch:1.3,handle:.6},style:{mid:.16,three:-.04}},
 {id:'curry',name:'跟 Stephen Curry 练投射',desc:'提高三分、控球和无球后的快速出手倾向。',delta:{three:1.8,handle:.8,speed:.4},style:{three:.18,mid:-.03}},
 {id:'lebron',name:'跟 LeBron James 练阅读',desc:'强化终结、传球和力量，更愿意寻找错位。',delta:{finish:1.0,passing:1.3,strength:.8},style:{drive:.10,post:.07}},
 {id:'hakeem',name:'跟 Hakeem Olajuwon 练脚步',desc:'提高内线防守、终结和背身脚步。',delta:{interior:1.4,finish:.8,mid:.5},style:{post:.16,drive:-.03}},
 {id:'kawhi',name:'跟 Kawhi Leonard 练防守',desc:'外线防守与力量上升，进攻选择更稳。',delta:{perimeter:1.5,strength:.7,mid:.6},style:{mid:.06}},
 {id:'cp3',name:'跟 Chris Paul 练节奏',desc:'控球、组织、中距离提升，减少失误。',delta:{handle:1.1,passing:1.3,mid:.9},style:{mid:.09,three:.03}}
];
Object.assign(VOICE,{
 'Ja Morant':{hook:'用第一步把比赛变成空中战',focus:'爆发突破',first:'别站得太靠后，我会把那当成跑道。',respect:'你逼我换了几次起步角度。'},
 'De’Aaron Fox':{hook:'用速度把防守拖散',focus:'第一步',first:'如果你要想一秒，那一秒就够我过去了。',respect:'你跟上了几次，说明你真准备过。'},
 'Steve Nash':{hook:'用节奏而不是力量创造空间',focus:'连续变化',first:'快不一定是速度，也可以是决定。',respect:'你把几个阅读点藏得很好。'},
 'Luka Doncic':{hook:'用身材和停顿把小错位放大',focus:'节奏错位',first:'你可以比我快，但最好别先跳。',respect:'你没有被我的节奏带着走。'},
 'Jimmy Butler':{hook:'专门找最硬的几个回合',focus:'第四节对抗',first:'如果你想轻松打完，那你抽错人了。',respect:'你扛住了，这个我认。'},
 'Paul George':{hook:'把攻防两端都保持在舒服尺寸',focus:'完整性',first:'你最好别只准备一种防法。',respect:'你逼我两边都调整。'},
 'Jayson Tatum':{hook:'反复回到高点出手',focus:'侧翼单打',first:'身材差不多的时候，就看谁的脚步更干净。',respect:'你没给我舒服的节奏。'},
 'Carmelo Anthony':{hook:'把中距离变成私人区域',focus:'三威胁',first:'别碰我的甜点位。碰了我也会把它拿回来。',respect:'你把我赶离了几个最舒服的位置。'},
 'Larry Bird':{hook:'用判断和投篮让垃圾话变得有底气',focus:'提前读球',first:'我可以先告诉你我要去哪儿，然后看看你能不能拦住。',respect:'至少这次我不能提前把答案告诉你。'},
 'Scottie Pippen':{hook:'用长度把第一选择抹掉',focus:'外线压迫',first:'先把你最喜欢的那一招拿掉，再看你还剩什么。',respect:'你找到第二、第三种办法了。'},
 'Giannis Antetokounmpo':{hook:'用步幅和力量从外线直接压到篮下',focus:'纵向冲击',first:'给我两步空间，我会直接到篮筐。',respect:'你让我不得不多运一次球。'},
 'Dirk Nowitzki':{hook:'用身高把中距离拉成不可封盖的角度',focus:'高点后仰',first:'你可以贴得很近，但球还是会从更高的地方出去。',respect:'你把我的接球位置推远了。'},
 'Tim Duncan':{hook:'把每个回合处理得没有多余动作',focus:'低位基本功',first:'不用急。先把位置站好。',respect:'你很少犯同一个错误。'},
 'Kevin Garnett':{hook:'把防守和情绪一起压到满格',focus:'持续对抗',first:'从第一球开始你就别想休息。',respect:'你一直站着，那我就记住你。'},
 'Charles Barkley':{hook:'用力量和低重心把尺寸差吃干净',focus:'背身冲撞',first:'高不高不重要，谁先把谁挤开才重要。',respect:'你比看起来难顶得多。'},
 'Zion Williamson':{hook:'把爆发力直接砸进油漆区',focus:'第一下对抗',first:'最好别在篮下等我起跳。',respect:'你没有把对抗让掉。'},
 'Anthony Davis':{hook:'用臂展同时封住篮筐和中距离',focus:'护筐覆盖',first:'你往里走之前最好再想一次。',respect:'你找到几个我够不到的角度。'},
 'Hakeem Olajuwon':{hook:'用脚步让内线防守先失去重心',focus:'梦幻脚步',first:'先看你的脚站在哪里。答案通常已经在那里。',respect:'你没有被第一个假动作骗走。'},
 'Dwight Howard':{hook:'用力量和弹速封住篮筐',focus:'护筐',first:'今天篮筐附近不会太宽。',respect:'你还是敢往里面来。'},
 'Joel Embiid':{hook:'在力量和投射之间来回切换',focus:'大个错位',first:'你退我投，你顶我就往里走。',respect:'你让我几次选得不舒服。'},
 'Victor Wembanyama':{hook:'用异常出手点改变正常防守规则',focus:'臂展',first:'你可能防对了，只是还不够高。',respect:'你找到了不跟我比高度的办法。'},
 'Kareem Abdul-Jabbar':{hook:'把天勾变成几乎不受干扰的终结',focus:'禁区角度',first:'你会看到那个出手，但不一定碰得到。',respect:'你把我推离了最舒服的勾手点。'},
 'Wilt Chamberlain':{hook:'用纯身体数据压垮回合',focus:'力量与篮板',first:'你可以先决定，是想防我还是想抢篮板。',respect:'你让我第一次需要认真选位置。'},
 'Bill Russell':{hook:'把防守和篮板当成比赛真正的控制权',focus:'护筐判断',first:'你得先过我，才有资格谈篮筐。',respect:'你逼我连续做了几次第二反应。'},
 'Klay Thompson':{hook:'用极少运球完成极快出手',focus:'接球三分',first:'我不需要运很多次球，你只要慢半拍就够了。',respect:'你让我的接球点没那么干净。'},
 'Karl Malone':{hook:'用力量把每一次挡拆后的空间压实',focus:'身体终结',first:'你要守住位置，就先别被第一下对抗推走。',respect:'你在身体上没退太多。'}
});
