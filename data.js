'use strict';
const BUILD_BUDGET=39;
const TIER_VALUE={1:74,2:80,3:86,4:92,5:97};
const SKILLS={
 finish:{label:'篮下终结',desc:'突破后的上篮、对抗终结与近筐手感',tiers:{1:['Kyle Lowry','Mike Conley','Jrue Holiday'],2:['Tony Parker','Kemba Walker','DeMar DeRozan'],3:['Dwyane Wade','Shai Gilgeous-Alexander','Jimmy Butler'],4:['Kyrie Irving','LeBron James','Giannis Antetokounmpo'],5:['Michael Jordan','Shaquille O’Neal','Kareem Abdul-Jabbar']}},
 dunk:{label:'扣篮',desc:'空中终结、隔扣威胁与冲击篮筐的爆炸力',tiers:{1:['Steve Nash','Chris Paul','John Stockton'],2:['Paul George','Jayson Tatum','Scottie Pippen'],3:['Vince Carter','Zion Williamson','Ja Morant'],4:['LeBron James','Dominique Wilkins','Shawn Kemp'],5:['Blake Griffin','Michael Jordan','Anthony Edwards']}},
 mid:{label:'中距离',desc:'急停、后仰、肘区与中距离单打',tiers:{1:['Draymond Green','Rajon Rondo','Ben Wallace'],2:['Jrue Holiday','Paul Pierce','Grant Hill'],3:['DeMar DeRozan','Devin Booker','Carmelo Anthony'],4:['Kevin Durant','Dirk Nowitzki','Kawhi Leonard'],5:['Kobe Bryant','Michael Jordan','Chris Paul']}},
 three:{label:'三分',desc:'持球三分、接球投射和超远威胁',tiers:{1:['Shaquille O’Neal','Dwight Howard','Ben Wallace'],2:['Russell Westbrook','Dwyane Wade','Jimmy Butler'],3:['Kyrie Irving','Paul George','Damian Lillard'],4:['Klay Thompson','Kevin Durant','Ray Allen'],5:['Stephen Curry','Reggie Miller','Larry Bird']}},
 handle:{label:'控球',desc:'变向、护球、摆脱与创造投篮空间',tiers:{1:['Klay Thompson','Dwight Howard','Ben Wallace'],2:['Jayson Tatum','Paul George','Jimmy Butler'],3:['Chris Paul','Allen Iverson','Stephen Curry'],4:['Steve Nash','Ja Morant','Shai Gilgeous-Alexander'],5:['Kyrie Irving','Allen Iverson','Isiah Thomas']}},
 passing:{label:'组织',desc:'阅读防守、传球创造力与3v3延展能力',tiers:{1:['Jaylen Brown','Klay Thompson','Carmelo Anthony'],2:['Dwyane Wade','Paul George','Kobe Bryant'],3:['LeBron James','Chris Paul','Jason Kidd'],4:['Steve Nash','Nikola Jokic','Luka Doncic'],5:['Magic Johnson','John Stockton','Oscar Robertson']}},
 perimeter:{label:'外线防守',desc:'横移、干扰、抢断与单防持球手',tiers:{1:['Trae Young','Steve Nash','Damian Lillard'],2:['Stephen Curry','Luka Doncic','Carmelo Anthony'],3:['Jrue Holiday','Jimmy Butler','Paul George'],4:['Scottie Pippen','Gary Payton','Michael Jordan'],5:['Kawhi Leonard','Sidney Moncrief','Ron Artest']}},
 interior:{label:'内线防守',desc:'护筐、顶防、换防大个与近筐干扰',tiers:{1:['Trae Young','Steve Nash','Allen Iverson'],2:['Kobe Bryant','Paul George','LeBron James'],3:['Draymond Green','Kevin Garnett','Anthony Davis'],4:['Tim Duncan','Hakeem Olajuwon','Dwight Howard'],5:['Bill Russell','Ben Wallace','Dikembe Mutombo']}},
 rebound:{label:'篮板',desc:'卡位、二次进攻和终结回合',tiers:{1:['Trae Young','Chris Paul','Kyrie Irving'],2:['Kobe Bryant','Dwyane Wade','Paul George'],3:['LeBron James','Larry Bird','Charles Barkley'],4:['Kevin Garnett','Tim Duncan','Nikola Jokic'],5:['Dennis Rodman','Wilt Chamberlain','Moses Malone']}},
 strength:{label:'力量',desc:'背打、身体对抗、顶防与强行挤开空间',tiers:{1:['Trae Young','Allen Iverson','Steve Nash'],2:['Stephen Curry','Kyrie Irving','Ja Morant'],3:['Kobe Bryant','Jimmy Butler','Jayson Tatum'],4:['LeBron James','Zion Williamson','Karl Malone'],5:['Shaquille O’Neal','Charles Barkley','Wilt Chamberlain']}},
 speed:{label:'速度',desc:'第一步、追防、转换与错位摆脱',tiers:{1:['Nikola Jokic','Dirk Nowitzki','Marc Gasol'],2:['Klay Thompson','Paul Pierce','Carmelo Anthony'],3:['Kobe Bryant','Dwyane Wade','Stephen Curry'],4:['De’Aaron Fox','Ja Morant','Allen Iverson'],5:['Derrick Rose','John Wall','Russell Westbrook']}},
 clutch:{label:'关键球',desc:'高压回合的稳定度、胆量和最后一球表现',tiers:{1:['Ben Simmons','DeAndre Jordan','Rudy Gobert'],2:['Paul George','Chris Webber','Karl Malone'],3:['Jimmy Butler','Damian Lillard','Kyrie Irving'],4:['Stephen Curry','Kevin Durant','Larry Bird'],5:['Michael Jordan','Kobe Bryant','LeBron James']}}
};

const PERSONALITIES={
 kobe:{name:'Kobe Bryant｜偏执竞争者',tone:'几乎把每场球都当成私人挑战。',variance:.92,clutch:4,injury:.96,friend:-2,rival:4,lines:['别解释，赢球。','我只记得谁在最后还敢要球。','你想被记住，就别在这里退。']},
 curry:{name:'Stephen Curry｜轻松自信',tone:'笑着打球，但一旦找到手感会连续出手。',variance:1.06,clutch:2,injury:1.00,friend:3,rival:0,lines:['放松点，下一球可能从很远的地方来。','你要是敢放，我就敢投。','好球。再来一局我也不介意。']},
 duncan:{name:'Tim Duncan｜沉默稳定',tone:'情绪波动小，输赢都很克制。',variance:.82,clutch:2,injury:.92,friend:2,rival:-1,lines:['先把这一回合打好。','比分会说明问题。','不错。明年再见。']},
 draymond:{name:'Draymond Green｜嘴硬挑衅',tone:'喜欢把比赛变成嘴仗，输赢后都可能继续抬杠。',variance:1.12,clutch:1,injury:1.02,friend:-1,rival:5,lines:['你还没进这条街的时候，我就在这儿吵过冠军了。','别只看数据，先看看谁敢碰我。','赢一场就想让我闭嘴？想得美。']},
 butler:{name:'Jimmy Butler｜强硬试炼者',tone:'会主动寻找硬仗，也更尊重扛住压力的人。',variance:.95,clutch:3,injury:1.00,friend:1,rival:3,lines:['如果这场太容易，那就没意思。','我只想知道你第四节还硬不硬。','你扛住了，这我认。']},
 lebron:{name:'LeBron James｜掌控全局',tone:'更重视阅读局势和选择最优解。',variance:.88,clutch:3,injury:.86,friend:2,rival:1,lines:['先看清楚场上缺口，再出手。','你给我错位，我就会一直找它。','赢球不只是一种方式。']},
 iverson:{name:'Allen Iverson｜桀骜单挑',tone:'喜欢用突破和连续单挑回应质疑。',variance:1.16,clutch:3,injury:1.08,friend:0,rival:3,lines:['身高不是借口，过不了人才是。','别站太直，我第一步已经来了。','你今天赢了，但下次我还会找你。']},
 jordan:{name:'Michael Jordan｜绝不服输',tone:'输球后更容易把对手记成宿敌。',variance:.90,clutch:5,injury:.94,friend:-2,rival:6,lines:['你最好把今天记清楚，因为我会记得。','别给我第二次机会。','赢我一次不算结束。']},
 shaq:{name:'Shaquille O’Neal｜霸气玩笑型',tone:'喜欢夸张表达力量优势，气氛轻松但打法直接。',variance:1.05,clutch:0,injury:1.05,friend:2,rival:1,lines:['你最好多吃两顿，不然我一靠你就飞了。','篮下这么小，够我站就行。','不错，至少你没被我吓走。']},
 kawhi:{name:'Kawhi Leonard｜冷面观察者',tone:'话很少，但会根据对手弱点调整。',variance:.78,clutch:3,injury:1.10,friend:0,rival:0,lines:['嗯。开打吧。','你右手启动更快。看到了。','好球。']},
 kg:{name:'Kevin Garnett｜高压怒吼',tone:'把情绪和对抗拉满，容易制造宿敌线。',variance:1.09,clutch:2,injury:.98,friend:-1,rival:5,lines:['今天别想舒服接一次球。','我会从第一回合吵到最后一回合。','你值得我明年再来找一次。']},
 jokic:{name:'Nikola Jokic｜随性阅读型',tone:'看起来不着急，但会一直惩罚错误选择。',variance:.86,clutch:2,injury:.91,friend:3,rival:-1,lines:['如果你非要包夹，那我就传。','慢一点也能找到空位。','打完了吗？那挺好。']}
};

const BASE_ARCH={
 guard:{finish:87,dunk:72,mid:86,three:88,handle:91,passing:88,perimeter:82,interior:68,rebound:70,strength:70,speed:91,clutch:87},
 wing:{finish:90,dunk:88,mid:88,three:84,handle:84,passing:80,perimeter:88,interior:78,rebound:80,strength:84,speed:85,clutch:88},
 big:{finish:94,dunk:93,mid:78,three:67,handle:70,passing:76,perimeter:72,interior:94,rebound:94,strength:95,speed:72,clutch:82}
};
function A(type,over={}){return Object.assign({},BASE_ARCH[type],over)}
const NBA_POOL=[
 {id:'morant',name:'Ja Morant',pos:'PG',h:188,w:79,p:'iverson',a:A('guard',{finish:94,dunk:96,three:80,speed:97,perimeter:74})},
 {id:'fox',name:'De’Aaron Fox',pos:'PG',h:191,w:84,p:'curry',a:A('guard',{speed:99,finish:92,three:82,mid:88})},
 {id:'rose',name:'Derrick Rose',pos:'PG',h:188,w:91,p:'iverson',a:A('guard',{speed:99,finish:95,dunk:93,three:78})},
 {id:'iverson',name:'Allen Iverson',pos:'PG',h:183,w:75,p:'iverson',a:A('guard',{handle:98,speed:98,finish:93,mid:91,strength:65})},
 {id:'curry',name:'Stephen Curry',pos:'PG',h:188,w:84,p:'curry',a:A('guard',{three:99,handle:96,clutch:95,finish:88,interior:63})},
 {id:'cp3',name:'Chris Paul',pos:'PG',h:183,w:79,p:'lebron',a:A('guard',{mid:96,passing:97,handle:95,perimeter:91,dunk:55})},
 {id:'nash',name:'Steve Nash',pos:'PG',h:191,w:81,p:'jokic',a:A('guard',{three:94,passing:98,handle:94,perimeter:68,dunk:50})},
 {id:'magic',name:'Magic Johnson',pos:'PG',h:206,w:100,p:'lebron',a:A('wing',{passing:99,handle:91,strength:91,three:73,speed:83})},
 {id:'westbrook',name:'Russell Westbrook',pos:'PG',h:191,w:91,p:'kg',a:A('guard',{speed:98,dunk:95,strength:88,finish:93,three:76})},
 {id:'lillard',name:'Damian Lillard',pos:'PG',h:188,w:88,p:'butler',a:A('guard',{three:96,clutch:97,handle:93,perimeter:72})},
 {id:'kyrie',name:'Kyrie Irving',pos:'PG',h:188,w:88,p:'curry',a:A('guard',{handle:99,finish:96,mid:94,three:92,perimeter:74})},
 {id:'luka',name:'Luka Doncic',pos:'PG',h:201,w:104,p:'jokic',a:A('wing',{handle:94,passing:97,strength:92,speed:75,perimeter:70})},
 {id:'edwards',name:'Anthony Edwards',pos:'SG',h:193,w:102,p:'jordan',a:A('wing',{dunk:99,speed:94,strength:91,three:87,clutch:90})},
 {id:'booker',name:'Devin Booker',pos:'SG',h:198,w:93,p:'curry',a:A('wing',{mid:96,three:92,handle:89,perimeter:78})},
 {id:'wade',name:'Dwyane Wade',pos:'SG',h:193,w:100,p:'butler',a:A('wing',{finish:96,dunk:94,speed:94,three:76,perimeter:91})},
 {id:'harden',name:'James Harden',pos:'SG',h:196,w:100,p:'lebron',a:A('guard',{three:94,handle:96,passing:94,strength:86,perimeter:72})},
 {id:'kobe',name:'Kobe Bryant',pos:'SG',h:198,w:96,p:'kobe',a:A('wing',{mid:99,clutch:98,handle:94,perimeter:94,three:88})},
 {id:'jordan',name:'Michael Jordan',pos:'SG',h:198,w:98,p:'jordan',a:A('wing',{finish:99,dunk:98,mid:99,perimeter:98,clutch:99,speed:96})},
 {id:'klay',name:'Klay Thompson',pos:'SG',h:198,w:98,p:'duncan',a:A('wing',{three:97,perimeter:95,handle:77,passing:74})},
 {id:'ray',name:'Ray Allen',pos:'SG',h:196,w:93,p:'duncan',a:A('wing',{three:97,mid:91,speed:88,perimeter:83})},
 {id:'vince',name:'Vince Carter',pos:'SG',h:198,w:100,p:'shaq',a:A('wing',{dunk:99,finish:94,three:88,speed:93})},
 {id:'tatum',name:'Jayson Tatum',pos:'SF',h:203,w:95,p:'duncan',a:A('wing',{mid:93,three:91,perimeter:90,finish:91})},
 {id:'pg',name:'Paul George',pos:'SF',h:203,w:100,p:'curry',a:A('wing',{three:92,perimeter:94,handle:88,dunk:90})},
 {id:'melo',name:'Carmelo Anthony',pos:'SF',h:201,w:108,p:'iverson',a:A('wing',{mid:97,three:90,strength:90,perimeter:72})},
 {id:'pippen',name:'Scottie Pippen',pos:'SF',h:203,w:103,p:'duncan',a:A('wing',{perimeter:97,passing:88,finish:91,three:80})},
 {id:'kawhi',name:'Kawhi Leonard',pos:'SF',h:201,w:102,p:'kawhi',a:A('wing',{perimeter:99,mid:96,strength:92,clutch:94})},
 {id:'durant',name:'Kevin Durant',pos:'SF',h:211,w:109,p:'curry',a:A('wing',{mid:98,three:96,finish:95,height:99,perimeter:87})},
 {id:'lebron',name:'LeBron James',pos:'SF',h:206,w:113,p:'lebron',a:A('wing',{finish:99,dunk:97,passing:96,strength:98,speed:93,clutch:96})},
 {id:'bird',name:'Larry Bird',pos:'SF',h:206,w:100,p:'jordan',a:A('wing',{three:96,mid:96,passing:94,rebound:90,clutch:98,speed:72})},
 {id:'butler',name:'Jimmy Butler',pos:'SF',h:201,w:104,p:'butler',a:A('wing',{finish:92,mid:92,perimeter:95,strength:92,three:82,clutch:95})},
 {id:'draymond',name:'Draymond Green',pos:'PF',h:198,w:104,p:'draymond',a:A('wing',{passing:91,perimeter:94,interior:93,strength:92,three:75,mid:70})},
 {id:'griffin',name:'Blake Griffin',pos:'PF',h:206,w:113,p:'shaq',special:'poster',a:A('big',{dunk:99,speed:87,passing:84,three:79,interior:79})},
 {id:'zion',name:'Zion Williamson',pos:'PF',h:198,w:128,p:'shaq',a:A('big',{finish:98,dunk:99,strength:99,speed:89,interior:78})},
 {id:'barkley',name:'Charles Barkley',pos:'PF',h:198,w:114,p:'kg',a:A('big',{speed:86,rebound:98,strength:98,finish:96,interior:84})},
 {id:'kg',name:'Kevin Garnett',pos:'PF',h:211,w:109,p:'kg',a:A('big',{mid:92,perimeter:91,interior:97,speed:86,strength:90})},
 {id:'dirk',name:'Dirk Nowitzki',pos:'PF',h:213,w:111,p:'duncan',a:A('big',{mid:98,three:94,clutch:95,interior:76,speed:67})},
 {id:'duncan',name:'Tim Duncan',pos:'PF',h:211,w:113,p:'duncan',a:A('big',{mid:91,interior:98,rebound:96,clutch:94,speed:72})},
 {id:'giannis',name:'Giannis Antetokounmpo',pos:'PF',h:211,w:110,p:'lebron',a:A('big',{finish:99,dunk:99,speed:92,perimeter:90,three:76})},
 {id:'malone',name:'Karl Malone',pos:'PF',h:206,w:113,p:'butler',a:A('big',{mid:90,strength:98,finish:96,rebound:93,speed:80})},
 {id:'wemby',name:'Victor Wembanyama',pos:'C',h:224,w:107,p:'kawhi',a:A('big',{three:87,handle:82,interior:99,dunk:96,strength:78,speed:82})},
 {id:'embiid',name:'Joel Embiid',pos:'C',h:213,w:127,p:'butler',a:A('big',{mid:93,three:86,interior:96,strength:97,clutch:88})},
 {id:'jokic',name:'Nikola Jokic',pos:'C',h:211,w:129,p:'jokic',a:A('big',{passing:99,mid:94,three:88,handle:84,strength:96,speed:63})},
 {id:'dwight',name:'Dwight Howard',pos:'C',h:208,w:120,p:'shaq',a:A('big',{dunk:98,interior:98,rebound:98,strength:98,three:50})},
 {id:'hakeem',name:'Hakeem Olajuwon',pos:'C',h:213,w:116,p:'duncan',a:A('big',{finish:97,mid:93,handle:84,interior:99,speed:84})},
 {id:'shaq',name:'Shaquille O’Neal',pos:'C',h:216,w:147,p:'shaq',a:A('big',{finish:99,dunk:99,strength:99,rebound:98,interior:97,speed:77,three:40})},
 {id:'kareem',name:'Kareem Abdul-Jabbar',pos:'C',h:218,w:102,p:'duncan',a:A('big',{finish:99,mid:97,interior:97,rebound:96,strength:90})},
 {id:'wilt',name:'Wilt Chamberlain',pos:'C',h:216,w:125,p:'jordan',a:A('big',{finish:99,dunk:99,rebound:99,strength:99,speed:91,three:45})},
 {id:'russell',name:'Bill Russell',pos:'C',h:208,w:98,p:'duncan',a:A('big',{interior:99,rebound:99,speed:86,passing:86,three:45})}
];

const POSITION_INDEX={PG:1,SG:2,SF:3,PF:4,C:5};

const PLAYER_LORE={
 morant:'他的比赛总带着突然起飞的危险感，观众会本能地给突破路线让出一点空间。',
 rose:'他的名字总会让人想到极速突破、巅峰与伤病之后重新站回场上的故事。',
 iverson:'他从不需要尺寸优势来证明自己，越是被说太小，单挑越像在回应质疑。',
 curry:'当他连续投进远距离三分时，整块半场都会被迫拉长。',
 kobe:'他把单挑看成技术细节的考试，越到最后几球越愿意亲自解决。',
 jordan:'他很容易把一次输球记成下一次见面的燃料。',
 edwards:'年轻、爆炸、敢说敢打，比赛越热闹越容易进入状态。',
 lebron:'他会先观察你的弱点；一旦发现错位，往往会重复利用直到你改变防法。',
 draymond:'他最擅长把普通对抗变成情绪战，甚至在球还没开之前就先把火点起来。',
 griffin:'他的街头名片就是暴力起飞。只要篮下有人，他反而更想尝试把球扣进去。',
 shaq:'他的战术有时候简单到残酷：先把你推到篮下，再问你能不能顶住。',
 kawhi:'他的表情变化不多，但比赛里会悄悄记住你每一种启动习惯。',
 kg:'他会把每一回合都演成季后赛抢七，怒吼和身体对抗从热身就开始。',
 jokic:'节奏看起来很慢，但他总能在你重心移动之后找到最省力的解法。',
 wemby:'他的长度会改变普通出手角度，你以为已经摆脱，抬头时手臂还在视野里。',
 durant:'他最大的麻烦不是某一个动作，而是同样的出手点几乎对所有位置都足够高。',
 harden:'他喜欢让防守者先做选择，再用后撤或突破惩罚那个选择。',
 westbrook:'如果比赛进入纯速度和身体冲撞，他会主动把节奏推到你不舒服的位置。',
 bird:'他不需要最快的脚步，也能靠判断和投射把每个错误变成分数。',
 duncan:'他几乎不会被垃圾话带走注意力，越乱的比赛反而越显得稳定。'
};

const TRAIT_LABELS={finish:'终结',dunk:'扣篮',mid:'中投',three:'三分',handle:'控球',passing:'组织',perimeter:'外防',interior:'内防',rebound:'篮板',strength:'力量',speed:'速度',clutch:'关键球'};
