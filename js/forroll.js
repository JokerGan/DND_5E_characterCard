// 为了掷骰

// 检查是否需要掷骰
var need_roll=getQueryVariable('roll');
if (need_roll=='yes') {
	var rolldiv=document.getElementById("rolldiv");
	rolldiv.style.display="inline";
	// div拖拽。后来改为fixed，没用上。
	rolldiv.ondragend=function(e){
		this.style.cssText='left:'+(e.clientX)+'px;top:'+(e.clientY)+'px;display:inline;'
	}

	// websocket
	var cname = document.querySelector('#name'),
	    rolltext = document.querySelector('#rolltext'),
	    rolling_button = document.querySelector('#rolling_button'),
	    roll_log = document.querySelector('#roll_log'),
	    websocket = new WebSocket("ws://127.0.0.1:6789/");
	// 发送事件
	rolling_button.onclick = function (event) {
	    websocket.send(JSON.stringify({name:cname.value,rolltext:rolltext.value}));
	}
	// 接收事件
	websocket.onmessage = function (event) {
	    data = JSON.parse(event.data);
	    switch (data.type) {
	        case 'users':
	            break;
	        case 'roll_log':
	            roll_log.innerHTML = data.text;
	            break;
	        default:
	            console.error(
	                "unsupported event", data);
	    }
	};

	// 掷骰文本拼接与ws发送
	function generate_rolltext(checkName, rollMod, special='normal') {
		if (rollMod=='0') {
			rollMod=''
		}
		let text
		switch(special){
			case 'weapon':
				text = "使用"+checkName+"造成："+rollMod+'伤害';
				break;
			case 'hit_point_dice':
				text = "使用"+checkName+"恢复："+rollMod+'点HP';
				break;
			default:
				text = "进行"+checkName+"检定：d20"+rollMod;
		}
		websocket.send(JSON.stringify({name:cname.value,rolltext:text}));
	}

	// 添加掷骰监听
	// 属性们
	var container =  document.querySelector('#ability_table');
	var targets = container.getElementsByTagName('tr');
	for(var i = 0; i < targets.length; i++) {
		var tempTarget = targets[i].getElementsByTagName('td')[0];
		tempTarget.onclick = function(){ generate_rolltext(this.innerHTML, this.parentNode.getElementsByTagName('td')[2].innerHTML) }
	}

	// 技能们（只有原生的可以计算）
	var container =  document.querySelector('#skills_table');
	var targets = container.getElementsByTagName('tr');
	for(var i = 0; i < 18; i++) {
		var tempTarget = targets[i].getElementsByTagName('td')[1];
		tempTarget.onclick = function(){ generate_rolltext(this.innerHTML.substring(0,2), this.parentNode.getElementsByTagName('td')[2].innerHTML) }
	}

	// 豁免们
	var container =  document.querySelector('#saving_throws_table');
	var targets = container.getElementsByTagName('tr');
	for(var i = 1; i < targets.length; i++) {
		var tempTarget = targets[i].getElementsByTagName('td')[1];
		tempTarget.onclick = function(){ generate_rolltext(this.innerHTML.substring(0,2)+'豁免', this.parentNode.getElementsByTagName('td')[2].innerHTML) }
	}

	// 先攻
	var tempTarget = document.querySelector('#initiative_bonus_div');
	tempTarget.onclick = function(){ generate_rolltext('先攻', this.childNodes[1].innerHTML) };

	// 生命骰
	var tempTarget = document.querySelector('#hit_point_dice_count');
	tempTarget.onclick = function(){ generate_rolltext('生命骰', hit_point_dice.value,'hit_point_dice'); this.value-=1;};

	// 攻击们
	var container =  document.querySelector('#attack_table');
	var targets = container.getElementsByTagName('tr');
	for(var i = 1; i < targets.length; i++) {
		var tempTarget = targets[i].firstChild.firstChild;
		tempTarget.onclick = function(){
			if (this.value) {
				generate_rolltext(this.value+'攻击', this.parentNode.parentNode.getElementsByTagName('td')[1].firstChild.value);
			}
		}
	}
	// 武器伤害们
	var container =  document.querySelector('#attack_table');
	var targets = container.getElementsByTagName('tr');
	for(var i = 1; i < targets.length; i++) {
		var tempTarget = targets[i].getElementsByTagName('td')[3].firstChild;
		tempTarget.onclick = function(){
			if (this.value) {
				generate_rolltext(this.parentNode.parentNode.firstChild.firstChild.value,this.value,'weapon');
			}
		}
	}
}