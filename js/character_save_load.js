// 保存角色
function save_character(){
    var SAVING = {};
    var temp_key = '';
    
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id) {
            temp_key = inputs[i].id;
            switch(inputs[i].type){
                case "text":
                    SAVING[temp_key] = inputs[i].value;
                    break;
                case "checkbox":
                    SAVING[temp_key] = inputs[i].checked;
                    break;
                case "number":
                    SAVING[temp_key] = inputs[i].value;
                    break;
                default:
                    console.error("未知type");
                    break;
            }
        }
    }

    var selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        SAVING[selects[i].id] = selects[i].selectedIndex;
    }

    var textareas  = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
        SAVING[textareas[i].id] = textareas[i].value;
    }

    var jsonStr = JSON.stringify(SAVING);

    jsonStr = jsonStr.replace(/\\n/g,"<换行>");
    // jsonStr = "load_string='" + jsonStr +"'";

    // console.log(jsonStr);

    var blob = new Blob([jsonStr], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "save.json");
}

// 角色读取
function load_character(){
  var load_name=getQueryVariable('name');
    if (!(load_name)) {
        var load_character_input=document.getElementById('load_character_input'); 
        load_name=load_character_input.value;
    }
    var load_url="archive/"+load_name+".json?v=time()";
    var request = new XMLHttpRequest();
    request.open("get", load_url);
    request.send(null);
    request.onload = function () {
        if(request.status == 200){
            character_json =  JSON.parse(request.responseText);
            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id) {
                    switch(inputs[i].type){
                        case "text":
                            inputs[i].value = character_json[inputs[i].id];
                            break;
                        case "checkbox":
                            inputs[i].checked = character_json[inputs[i].id];
                            break;
                        case "number":
                            inputs[i].value = character_json[inputs[i].id];
                            break;
                        default:
                            console.error("未知type");
                            break;
                    }
                }
            }

            var selects = document.getElementsByTagName("select");
            for (var i = 0; i < selects.length; i++) {
                selects[i].selectedIndex = character_json[selects[i].id];
            }

            var textareas  = document.getElementsByTagName("textarea");
            for (var i = 0; i < textareas.length; i++) {
                textareas[i].value = character_json[textareas[i].id];
                textareas[i].value = textareas[i].value.replace(/<换行>/g,"\n");
            }

            ability_modifier_calc();
            proficiency_bonus_got();
            skill_bounds_calc();
            saving_throws_bouns_calc();
            armor_class_calc();
            hit_point_calc();
            spellcasting_ability_calc();

            document.title = document.querySelector('#name').value; 
        }
    }
}