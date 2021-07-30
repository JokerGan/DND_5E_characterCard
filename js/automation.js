var ABILITY_SCORES_INPUT = {
	"Strength":document.querySelector('#Strength'),
	"Dexterity":document.querySelector('#Dexterity'),
	"Constitution":document.querySelector('#Constitution'),
	"Intelligence":document.querySelector('#Intelligence'),
	"Wisdom":document.querySelector('#Wisdom'),
	"Charisma":document.querySelector('#Charisma')
};
for(var k in ABILITY_SCORES_INPUT){
	ABILITY_SCORES_INPUT[k].onchange=ability_modifier_calc;
}

// 属性调整值呈现td
var ABILITY_MODIFIER_TEXT = {
	"Strength":document.querySelector('#Strength_mod'),
	"Dexterity":document.querySelector('#Dexterity_mod'),
	"Constitution":document.querySelector('#Constitution_mod'),
	"Intelligence":document.querySelector('#Intelligence_mod'),
	"Wisdom":document.querySelector('#Wisdom_mod'),
	"Charisma":document.querySelector('#Charisma_mod')
};

// 属性调整值
var ABILITY_MODIFIER = {
	"Strength":0,
	"Dexterity":0,
	"Constitution":0,
	"Intelligence":0,
	"Wisdom":0,
	"Charisma":0
};

// 熟练加值
var PROFICIENCY_BONUS = 0;
var PROFICIENCY_BONUS_TEXT = document.querySelector('#proficiency_bonus');

// 技能数据，第一项关键属性,第二项页面呈现td，第三项熟练的checkbox，第四项专精的checkbox，
var SKILLS={
	'athletics':['Strength',document.querySelector('#athletics_bonus'),document.querySelector('#proficiency_athletics'),document.querySelector('#expertise_athletics')],
	'acrobatics':['Dexterity',document.querySelector('#acrobatics_bonus'),document.querySelector('#proficiency_acrobatics'),document.querySelector('#expertise_acrobatics')],
	'sleight_of_hand':['Dexterity',document.querySelector('#sleight_of_hand_bonus'),document.querySelector('#proficiency_sleight_of_hand'),document.querySelector('#expertise_sleight_of_hand')],
	'stealth':['Dexterity',document.querySelector('#stealth_bonus'),document.querySelector('#proficiency_stealth'),document.querySelector('#expertise_stealth')],
	'arcana':['Intelligence',document.querySelector('#arcana_bonus'),document.querySelector('#proficiency_arcana'),document.querySelector('#expertise_arcana')],
	'history':['Intelligence',document.querySelector('#history_bonus'),document.querySelector('#proficiency_history'),document.querySelector('#expertise_history')],
	'investigation':['Intelligence',document.querySelector('#investigation_bonus'),document.querySelector('#proficiency_investigation'),document.querySelector('#expertise_investigation')],
	'nature':['Intelligence',document.querySelector('#nature_bonus'),document.querySelector('#proficiency_nature'),document.querySelector('#expertise_nature')],
	'religion':['Intelligence',document.querySelector('#religion_bonus'),document.querySelector('#proficiency_religion'),document.querySelector('#expertise_religion')],
	'animahandling':['Wisdom',document.querySelector('#animahandling_bonus'),document.querySelector('#proficiency_animahandling'),document.querySelector('#expertise_animahandling')],
	'insight':['Wisdom',document.querySelector('#insight_bonus'),document.querySelector('#proficiency_insight'),document.querySelector('#expertise_insight')],
	'medicine':['Wisdom',document.querySelector('#medicine_bonus'),document.querySelector('#proficiency_medicine'),document.querySelector('#expertise_medicine')],
	'perception':['Wisdom',document.querySelector('#perception_bonus'),document.querySelector('#proficiency_perception'),document.querySelector('#expertise_perception')],
	'survival':['Wisdom',document.querySelector('#survival_bonus'),document.querySelector('#proficiency_survival'),document.querySelector('#expertise_survival')],
	'deception':['Charisma',document.querySelector('#deception_bonus'),document.querySelector('#proficiency_deception'),document.querySelector('#expertise_deception')],
	'intimidation':['Charisma',document.querySelector('#intimidation_bonus'),document.querySelector('#proficiency_intimidation'),document.querySelector('#expertise_intimidation')],
	'performance':['Charisma',document.querySelector('#performance_bonus'),document.querySelector('#proficiency_performance'),document.querySelector('#expertise_performance')],
	'persuasion':['Charisma',document.querySelector('#persuasion_bonus'),document.querySelector('#proficiency_persuasion'),document.querySelector('#expertise_persuasion')]
}
// 为技能熟练与专精勾选框批量添加触发事件
for(var k in SKILLS){
	SKILLS[k][2].onchange=skill_bounds_calc;
	SKILLS[k][3].onchange=skill_bounds_calc;
}
// 显示技能专精checkbox及特殊调整工具div
function show_expertise_and_special_deal(){
	for(var k in SKILLS){
		SKILLS[k][3].style.display="inline";
	}
	document.querySelector('#special_deal_div').style.display='inline'

}
// 隐藏技能专精checkbox及特殊调整工具div
function hide_expertise_and_special_deal(){
	for(var k in SKILLS){
		SKILLS[k][3].style.display="none";
	}
	document.querySelector('#special_deal_div').style.display='none'
}

// 先攻div
var initiative_bonus_text = document.querySelector('#initiative_bonus');

// 被动感知 ( 察觉 )
var passive_wisdom_perception = document.querySelector('#passive_wisdom_perception');

// 豁免数据，第一项页面呈现td，第二项checkbox的input
var SAVING_THROWS = {
	'Strength':[document.querySelector('#saving_throws_strength_bouns'), document.querySelector('#proficiency_saving_throws_strength')],
	'Dexterity':[document.querySelector('#saving_throws_dexterity_bouns'), document.querySelector('#proficiency_saving_throws_dexterity')],
	'Constitution':[document.querySelector('#saving_throws_constitution_bouns'), document.querySelector('#proficiency_saving_throws_constitution')],
	'Intelligence':[document.querySelector('#saving_throws_intelligence_bouns'), document.querySelector('#proficiency_saving_throws_intelligence')],
	'Wisdom':[document.querySelector('#saving_throws_wisdom_bouns'), document.querySelector('#proficiency_saving_throws_wisdom')],
	'Charisma':[document.querySelector('#saving_throws_charisma_bouns'), document.querySelector('#proficiency_saving_throws_charisma')]
}
// 为属性豁免勾选框批量添加触发事件
for(var k in SAVING_THROWS){
	SAVING_THROWS[k][1].onchange=saving_throws_bouns_calc;
}

// AC呈现div
var armor_class=document.querySelector('#armor_class');

// 护甲数据，第一项：中文名称，第二项：基础ac，第三项最大ac值
var ARMOR_DATA = {
	'padded': ['布甲', 11, 99],
	'leather': ['皮甲', 11, 99],
	'studded_leather': ['镶钉皮甲', 12, 99],
	'hide': ['兽皮甲', 12, 2],
	'chain_shirt': ['链甲衫', 13, 2],
	'scale_mail': ['鳞甲', 14, 2],
	'breastplate': ['胸甲', 14, 2],
	'half_plate': ['半身板甲', 15, 2],
	'ring_mail': ['环甲', 14, 0],
	'chain_mail': ['链甲', 16, 0],
	'splint': ['板条甲', 17, 0],
	'plate': ['板甲', 18, 0]
}

// 穿甲的select
var with_armor = document.querySelector('#with_armor');
//  穿甲的select添加option
for(var k in ARMOR_DATA){
	with_armor.options.add(new Option(ARMOR_DATA[k][0], k));
}
// 持盾的checkbox
var with_shield = document.querySelector('#with_shield');

// HP相关元素
var maxHP=document.querySelector('#max-HP');
var hit_point_dice = document.querySelector('#hit_point_dice');

// 施法相关元素
var spellcasting_ability = document.querySelector('#spellcasting_ability');
var spell_save_dc = document.querySelector('#spell_save_dc');
var spell_attack_bonus = document.querySelector('#spell_attack_bonus');

// 特殊功能checkbox
var dwarvenToughness = document.querySelector('#dwarvenToughness');
var unarmoredDefense_monk = document.querySelector('#unarmoredDefense_monk');
var unarmoredDefense_barbarian = document.querySelector('#unarmoredDefense_barbarian');
var fightingStyle_defense = document.querySelector('#fightingStyle_defense');
var draconicResilience = document.querySelector('#draconicResilience');

//尝试通过get参数加载角色
load_character()

// 属性调整值自动计算（触发）
function ability_modifier_calc (){
	var mod;
	for(var k in ABILITY_SCORES_INPUT){
		mod=Math.floor((ABILITY_SCORES_INPUT[k].value-10)/2);
		ABILITY_MODIFIER[ABILITY_SCORES_INPUT[k].name]=mod;
		if (mod>0) {
			mod_text = "+" + mod;
		}else{
			mod_text = "" + mod;
		}
		ABILITY_MODIFIER_TEXT[ABILITY_SCORES_INPUT[k].name].innerHTML = mod_text;
		skill_bounds_calc();
		saving_throws_bouns_calc();
		armor_class_calc();
		hit_point_calc();
		spellcasting_ability_calc();
		switch(ABILITY_SCORES_INPUT[k].name){
			case "Dexterity":
				// 先攻呈现，未考虑专长
				initiative_bonus_text.innerHTML = mod_text;
				break;
			default:
				break;
		}
		
	}
}

// 获取熟练加值(触发)
function proficiency_bonus_got(){
	PROFICIENCY_BONUS = parseInt(PROFICIENCY_BONUS_TEXT.value);
	skill_bounds_calc();
	saving_throws_bouns_calc();
}

// 技能加值自动计算expertise_persuasion
function skill_bounds_calc(){
	var bouns;
	for(var k in SKILLS){
		if (SKILLS[k][2].checked == true) {
			bouns = ABILITY_MODIFIER[SKILLS[k][0]]+PROFICIENCY_BONUS;
			if (SKILLS[k][3].checked == true) {
				bouns = bouns+PROFICIENCY_BONUS;
			}
		}else{
			bouns = ABILITY_MODIFIER[SKILLS[k][0]];
		}
		if (bouns>0) {
			bouns_text = "+" + bouns;
		}else{
			bouns_text = "" + bouns;
		}
		SKILLS[k][1].innerHTML=bouns_text;
		switch(k){
			case "perception":
				// 被动感知 ( 察觉 )，未考虑专长
				passive_wisdom_perception.innerHTML = 10 + bouns;
			default:
				break;
		}
	}
}

// 豁免加值自动计算
function saving_throws_bouns_calc(){
	var bouns;
	for(var k in SAVING_THROWS){
		if(SAVING_THROWS[k][1].checked == 1){
			bouns = ABILITY_MODIFIER[k] + PROFICIENCY_BONUS;
		}else{
			bouns = ABILITY_MODIFIER[k];
		}		
		if (bouns>0) {
			bouns_text = "+" + bouns;
		}else{
			bouns_text = "" + bouns;
		}
		SAVING_THROWS[k][0].innerHTML = bouns_text;
	}
}

// AC自动计算
function armor_class_calc(){
	var value;
	if(with_armor.value == ""){
		switch(true){
			case unarmoredDefense_monk.checked==true && with_armor.value=='' && with_shield.checked == false:
				value = 10 + ABILITY_MODIFIER['Dexterity'] +  ABILITY_MODIFIER['Wisdom'];
				break;
			case unarmoredDefense_barbarian.checked==true:
				value = 10 + ABILITY_MODIFIER['Dexterity'] +  ABILITY_MODIFIER['Constitution'];
				break;	
			case draconicResilience.checked == true:
				value = 13 + ABILITY_MODIFIER['Dexterity'];
				break;
			default:
				value = 10 + ABILITY_MODIFIER['Dexterity'];
				break;
		}
	}else{
		switch(true){
			case ARMOR_DATA[with_armor.value][2] >= ABILITY_MODIFIER['Dexterity']:
				value = ARMOR_DATA[with_armor.value][1] + ABILITY_MODIFIER['Dexterity'];
				break;
			case ARMOR_DATA[with_armor.value][2] < ABILITY_MODIFIER['Dexterity']:
				value = ARMOR_DATA[with_armor.value][1] + ARMOR_DATA[with_armor.value][2];
				break;
			default:
				break;
		}
		if(fightingStyle_defense.checked==true){
			value += 1;
		}
	}
	if (with_shield.checked == true) {
		value += 2;
	}	
	armor_class.innerHTML = value;
}

// 1级HP自动计算
function hit_point_calc(){
	if (hit_point_dice.value == '') {
		return;
	}else{
		var base_hp = parseInt(hit_point_dice.value.replace('1d',''));
		let class_level_text = class_level.value;	
		switch(true){
			// 矮人刚毅，包含人物升级计算
			case dwarvenToughness.checked == true: 
				let class_level_array=class_level_text.match(/\d{1,2}/g);
				let level_sum = 0;
				for (var i=class_level_array.length-1; i>=0; i--) {
					level_sum += parseInt(class_level_array[i]);
				}
				base_hp = base_hp+level_sum;  
				break;
			// 龙族体魄，包含人物升级计算
			case draconicResilience.checked == true:
				let sorcerer_level = parseInt(class_level_text.match(/术士\d{1,2}/g)[0].replace('术士',''));
				base_hp = base_hp+sorcerer_level;
				break;
			// 普通
			default:
				break;
		}
		maxHP.innerHTML = base_hp + ABILITY_MODIFIER['Constitution'];
	}
}

// 施法相关自动计算
function spellcasting_ability_calc(){
	if (spellcasting_ability.value) {
		spell_save_dc.innerHTML = 8 + PROFICIENCY_BONUS + ABILITY_MODIFIER[spellcasting_ability.value];
		spell_attack_bonus.innerHTML = "+" + (PROFICIENCY_BONUS + ABILITY_MODIFIER[spellcasting_ability.value]);
	}else{
		spell_save_dc.innerHTML = 0;
		spell_attack_bonus.innerHTML = 0;
	}
}