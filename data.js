const MAX_BUDGET=32;
const SKILLS={
  finish:{label:'篮下终结',pool:[['LeBron James',97,5],['Kyrie Irving',96,5],['Ja Morant',94,4],['Shai Gilgeous-Alexander',93,4],['Jrue Holiday',83,2]]},
  mid:{label:'中距离',pool:[['Kobe Bryant',99,5],['Kevin Durant',98,5],['DeMar DeRozan',95,4],['Devin Booker',93,4],['Jimmy Butler',86,3]]},
  three:{label:'三分',pool:[['Stephen Curry',99,5],['Klay Thompson',97,5],['Damian Lillard',95,4],['Kevin Durant',93,4],['Jimmy Butler',79,1]]},
  handle:{label:'控球',pool:[['Kyrie Irving',99,5],['Allen Iverson',98,5],['Stephen Curry',96,5],['James Harden',94,4],['Jrue Holiday',86,3]]},
  pass:{label:'组织',pool:[['Magic Johnson',99,5],['Steve Nash',98,5],['Chris Paul',97,5],['LeBron James',96,5],['Stephen Curry',90,3]]},
  defense:{label:'外线防守',pool:[['Kawhi Leonard',99,5],['Scottie Pippen',98,5],['Michael Jordan',97,5],['Jrue Holiday',96,4],['Stephen Curry',81,2]]},
  strength:{label:'力量',pool:[['Shaquille O’Neal',99,5],['LeBron James',98,5],['Giannis Antetokounmpo',97,5],['Zion Williamson',95,4],['Stephen Curry',74,1]]},
  speed:{label:'速度',pool:[['John Wall',99,5],['Derrick Rose',98,5],['De’Aaron Fox',97,5],['Ja Morant',96,4],['Luka Dončić',80,2]]},
  clutch:{label:'关键球',pool:[['Michael Jordan',99,5],['Kobe Bryant',98,5],['Damian Lillard',97,5],['LeBron James',96,5],['Jayson Tatum',92,4]]}
};
const DEFAULT_IDX={finish:2,mid:4,three:2,handle:3,pass:4,defense:3,strength:4,speed:3,clutch:4};
const OPP={
 'Ja Morant':o('Ja Morant','PG',94,96,83,93,86,80,82,96,88,'他把球夹在腰侧，笑着说：“第一次来？先看看你跟不跟得上。”','莫兰特收起笑容，冲你点了点头。','他从你身边掠过：“街头只认结果。”'),
 'De’Aaron Fox':o('De’Aaron Fox','PG',92,97,84,90,87,82,80,99,86,'福克斯没有多话，只把节奏推得越来越快。','最后一球落袋，他第一次停下来认真看你。','速度把比赛撕开，你始终慢了半拍。'),
 'Trae Young':o('Trae Young','PG',86,88,82,93,96,74,68,88,90,'他在中线附近就开始试投，逼你把防线拉到极限。','你逼他把最后一个超远三分投短了。','他的射程把你的防守彻底拖散。'),
 'Kyrie Irving':o('Kyrie Irving','PG',97,91,96,93,99,80,76,92,97,'欧文转着球：“别看脚步，看球——如果你看得到的话。”','终场后他笑着拍了拍球：“这场够漂亮。”','最后一次变向之后，你只看见篮网晃动。'),
 'Damian Lillard':o('Damian Lillard','PG',91,90,92,98,94,78,80,89,99,'利拉德指了指接近Logo的位置：“这里也算我的甜点位。”','你扛住了他的最后一记超远三分。','表停之前，他把球送进了网。'),
 'Russell Westbrook':o('Russell Westbrook','PG',96,96,87,82,92,84,94,98,92,'威少从第一回合就把对抗拉满，根本不给你试探时间。','你顶住了整场冲击，最后还站着。','他的冲击一次次把你推回篮下。'),
 'Derrick Rose':o('Derrick Rose','PG',97,98,90,86,96,83,86,98,94,'罗斯压低重心，第一步像把时间拉慢。','你守住了最后一次突破。','他在你落脚之前已经到了篮筐另一侧。'),
 'Allen Iverson':o('Allen Iverson','PG',96,98,97,89,99,82,78,97,98,'艾弗森盯着你：“身高没用，胆子才有用。”','你没有退，让他真正记住了你的名字。','他用最熟悉的交叉步结束了争论。'),
 'Chris Paul':o('Chris Paul','PG',90,84,96,90,97,96,82,84,96,'保罗不急着得分，他先把你的每一个防守习惯看了一遍。','你没有被他的节奏牵走。','他把比赛变成一道你答不完的题。'),
 'Steve Nash':o('Steve Nash','PG',86,83,98,94,96,78,74,85,94,'纳什不停换角度，逼你在每个回合都做选择。','你把他最舒服的节奏打乱了。','你以为他要传，但这里是1V1——球已经进了。'),
 'James Harden':o('James Harden','SG',93,87,94,96,96,82,91,86,95,'哈登后撤一步，空间突然被拉开。','你逼得他最后一次后撤步偏出。','你知道他要后撤，可你还是碰不到球。'),
 'Stephen Curry':o('Stephen Curry','PG',92,90,91,99,98,84,76,93,99,'库里从很远的位置开始热身。场边的人群已经提前往后退。','终场前，你让他的最后一次出手没有成为传奇。','球还在空中，场边已经开始欢呼。'),
 'Magic Johnson':o('Magic Johnson','PG',95,88,93,88,96,88,95,91,98,'魔术师的体型让这场比赛像跨位置错位。','你证明了街头没有绝对的尺寸答案。','他用身高、力量和技巧把你一点点压进禁区。'),
 'Anthony Edwards':o('Anthony Edwards','SG',95,95,89,90,91,88,92,95,93,'爱德华兹把球砸在地上：“来，看看谁先退。”','你让他的最后一次强攻停在了篮筐前。','他的爆发力把比赛变成了扣篮表演。'),
 'Devin Booker':o('Devin Booker','SG',91,86,96,94,92,82,84,87,94,'布克没有浪费动作，每一步都在找中距离甜点位。','你把他的节奏切断在最关键的一球。','他用一连串中投把比分磨到终点。'),
 'Dwyane Wade':o('Dwyane Wade','SG',97,95,92,82,94,94,92,95,97,'韦德第一次启动就直奔身体对抗。','你撑过了最凶狠的突破线。','他从缝隙里切进去，像闪电一样结束比赛。'),
 'Kobe Bryant':o('Kobe Bryant','SG',96,91,99,91,96,96,91,91,99,'科比把球放在脚边：“别告诉我你想赢。证明。”','最后一球落下，科比没有说话，只伸手和你击掌。','比赛结束后他只说了一句：“还不够。”'),
 'Michael Jordan':o('Michael Jordan','SG',99,96,99,91,98,99,96,97,100,'黑色训练服的人从场边走进来。没有抽签。乔丹只说：“下一场，我来。”','你从他手里拿走了这一晚最不可能的一场胜利。','乔丹拿走球：“以后别把传说当故事听。”'),
 'Jayson Tatum':o('Jayson Tatum','SF',93,89,95,93,91,90,91,88,94,'塔图姆一步步把你带进他的中距离区域。','你让他的最后一次后仰没能救场。','他用尺寸和投射把比赛拉得很长。'),
 'Paul George':o('Paul George','SF',93,90,94,93,92,95,89,90,92,'乔治的动作没有一丝多余，攻防都在同一个节奏里。','你终于撕开了他的长臂防守。','他让你每一次出手都比想象中难。'),
 'Carmelo Anthony':o('Carmelo Anthony','SF',95,86,98,90,91,82,92,84,96,'安东尼拍了拍肩：“这里没有包夹，你最好准备好单挑。”','你顶住了他最擅长的三威胁。','他的试探步让你始终猜错半拍。'),
 'Kawhi Leonard':o('Kawhi Leonard','SF',94,85,96,91,89,100,95,86,96,'伦纳德没有垃圾话，只伸手要球。','你从最沉默的防守者手里抢下胜利。','他的手掌像把你的进攻选项一个个关掉。'),
 'Kevin Durant':o('Kevin Durant','SF',97,90,99,97,94,90,88,89,98,'杜兰特在你面前起跳时，出手点像在另一个高度。','你逼他第一次真正改变了投篮选择。','你防到了位置，但他还是把球投进。'),
 'LeBron James':o('LeBron James','SF',99,94,96,91,95,95,99,95,99,'勒布朗看了一眼你的身材，然后直接从强侧压了过来。','你扛过了力量、速度和阅读的三重压力。','他把你的弱点找出来，然后连续攻击同一个地方。'),
 'Zion Williamson':o('Zion Williamson','PF',97,90,87,77,86,82,99,93,89,'锡安第一下对抗就让篮架都像在晃。','你没有在力量差距里失去节奏。','他把每一个回合都变成禁区肉搏。'),
 'Blake Griffin':o('Blake Griffin','PF',96,91,88,84,88,82,97,92,90,'格里芬盯着篮筐，明显没打算温柔结束任何一个回合。','你让他的冲框失去了起跳空间。','他用连续暴扣把气氛彻底点燃。'),
 'Kevin Garnett':o('Kevin Garnett','PF',94,88,94,82,87,99,96,90,97,'加内特从热身开始就在说话，比赛还没开始气氛已经拉满。','你在他的垃圾话和防守里活了下来。','他让每个回合都像季后赛最后一分钟。'),
 'Dirk Nowitzki':o('Dirk Nowitzki','PF',91,79,99,95,84,82,88,78,97,'诺维茨基抬起膝盖，那个熟悉的后仰空间出现了。','你逼他的招牌后仰第一次失去准星。','你知道球会从哪里出手，却碰不到那个高度。'),
 'Giannis Antetokounmpo':o('Giannis Antetokounmpo','PF',99,94,89,80,90,96,99,97,96,'字母哥只用一步就覆盖了你以为安全的空间。','你在他的覆盖面积里找到了一条缝。','他把半场缩成了你几乎无处可去的区域。'),
 'Tim Duncan':o('Tim Duncan','PF',96,82,98,78,88,99,98,82,99,'邓肯把球擦板放进，然后像什么都没发生。','你击败了最安静、也最稳定的答案。','他没有庆祝，只是一次次做对正确的动作。'),
 'Victor Wembanyama':o('Victor Wembanyama','C',95,91,93,87,86,96,91,89,92,'文班亚马站到你面前，篮筐像突然远了一米。','你逼他离开了最舒服的封锁范围。','他的臂展让你的常规出手路径全部消失。'),
 'Dwight Howard':o('Dwight Howard','C',98,88,79,65,76,96,99,92,88,'霍华德一上来就把对抗顶到最高。','你把空间拉开，让力量不再是唯一答案。','他把禁区变成了私人领地。'),
 'Joel Embiid':o('Joel Embiid','C',98,84,96,88,87,96,99,84,94,'恩比德面框、背打、假动作轮流出现。','你没让他的体型优势决定一切。','他用技术把力量优势放大了一倍。'),
 'Nikola Jokić':o('Nikola Jokić','C',96,76,99,92,92,86,98,75,98,'约基奇看起来不快，但你每次判断都像迟了一秒。','你让他的节奏第一次被迫提速。','他慢慢打，却总是先到答案。'),
 'Hakeem Olajuwon':o('Hakeem Olajuwon','C',98,92,99,83,91,100,96,91,99,'奥拉朱旺第一次梦幻脚步就让场边爆出声音。','你没有被连续假动作带走。','他用脚步把你留在了错误的方向。'),
 'Kareem Abdul-Jabbar':o('Kareem Abdul-Jabbar','C',99,84,99,72,84,96,97,80,99,'天勾出手的一刻，你才发现封盖窗口几乎不存在。','你终于让那记天勾偏出一次。','他用最不可阻挡的动作完成收尾。'),
 'Shaquille O’Neal':o('Shaquille O’Neal','C',100,90,90,40,74,96,100,88,98,'奥尼尔走进场时，围观的人自动往后让了一圈。','你把巨人的力量拖进了自己的节奏。','他让篮下每一次碰撞都像不公平。')
};
function o(name,pos,finish,speed,mid,three,handle,defense,strength,spd,clutch,intro,win,lose){return{name,pos,a:{finish,mid,three,handle,pass:Math.round((handle+clutch)/2),defense,strength,speed:spd,clutch},intro,win,lose}}
const ROAD={
 PG:[['Ja Morant','De’Aaron Fox','Trae Young','Kyrie Irving'],['Damian Lillard','Russell Westbrook','Derrick Rose','Allen Iverson'],['Chris Paul','Steve Nash','James Harden','Stephen Curry'],['Allen Iverson','James Harden','Magic Johnson','Stephen Curry']],
 SG:[['Anthony Edwards','Devin Booker','James Harden','Dwyane Wade'],['Devin Booker','Dwyane Wade','James Harden','Kobe Bryant'],['Dwyane Wade','James Harden','Kobe Bryant','Michael Jordan'],['James Harden','Kobe Bryant','Michael Jordan','Michael Jordan']],
 SF:[['Jayson Tatum','Paul George','Carmelo Anthony','Kawhi Leonard'],['Paul George','Carmelo Anthony','Kawhi Leonard','Kevin Durant'],['Carmelo Anthony','Kawhi Leonard','Kevin Durant','LeBron James'],['Kawhi Leonard','Kevin Durant','LeBron James','Michael Jordan']],
 PF:[['Zion Williamson','Blake Griffin','Kevin Garnett','Dirk Nowitzki'],['Blake Griffin','Kevin Garnett','Dirk Nowitzki','Giannis Antetokounmpo'],['Kevin Garnett','Dirk Nowitzki','Giannis Antetokounmpo','Tim Duncan'],['Dirk Nowitzki','Giannis Antetokounmpo','Tim Duncan','LeBron James']],
 C:[['Victor Wembanyama','Dwight Howard','Joel Embiid','Nikola Jokić'],['Dwight Howard','Joel Embiid','Nikola Jokić','Hakeem Olajuwon'],['Joel Embiid','Nikola Jokić','Hakeem Olajuwon','Kareem Abdul-Jabbar'],['Nikola Jokić','Hakeem Olajuwon','Kareem Abdul-Jabbar','Shaquille O’Neal']]
};
const ALLIES={
 G:[['Stephen Curry',97],['Magic Johnson',97],['Chris Paul',94],['Allen Iverson',95],['Damian Lillard',94],['Dwyane Wade',95],['Kobe Bryant',98],['Michael Jordan',99]],
 W:[['LeBron James',99],['Kevin Durant',98],['Kawhi Leonard',97],['Scottie Pippen',95],['Larry Bird',98],['Paul George',94],['Jayson Tatum',94],['Carmelo Anthony',95]],
 B:[['Shaquille O’Neal',99],['Hakeem Olajuwon',98],['Tim Duncan',98],['Kareem Abdul-Jabbar',99],['Nikola Jokić',98],['Giannis Antetokounmpo',98],['Kevin Garnett',96],['Joel Embiid',96]]
};