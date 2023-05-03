function alterInfo(event){
    console.log(document.getElementById("password").dataset.prev);
    action = event.target.id;
    if(action != "alter_save" & action != "alter_cancel"){
        document.getElementById("alter_save").disabled = false;
        document.getElementById("alter_cancel").disabled = false;
        action = action.split('_')[1];
        document.getElementById(action).disabled = false;
        if(action == "address")
            document.getElementById('cap').disabled = false;
    }
    else if(action == "alter_cancel"){
        //Rimodificare ogni elemento abled ai valori di sessione
        inputs = document.querySelectorAll('.inlineInfo input');
        for(var i = 0; i < inputs.length; i++){
            inputs[i].value = inputs[i].dataset.prev;
            inputs[i].disabled = true;
        }
        document.getElementById("alter_save").disabled = true;
        document.getElementById("alter_cancel").disabled = true;
    }
    else if(action == "alter_save"){
        //Iniziare richiesta php
    }
}
