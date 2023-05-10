function setFilter(event){
    type = event.target;
    document.getElementById('type').innerHTML = type.innerHTML;

    var liList = document.getElementById('type-menu').getElementsByTagName("li");
    for (var i = 0; i < liList.length; i++) {
        var a = liList[i].getElementsByTagName("A")[0];
        if(a.id == type.id){
            a.className = "dropdown-item disabled";
            a.setAttribute('aria-disabled', 'true');
        }
        else{
            a.className = "dropdown-item";
            a.setAttribute('aria-disabled', 'false');
        }
    }
}

function checkType(){
    type = document.getElementById('type').innerHTML;
    if(type != 'Seleziona Tipologia Segnalazione'){
        return checkExistence();
    }
    return false;
}

function checkExistence(){
    document.getElementById('launchModal').click();
    return false;
    /*
    var ajaxRequest1;  // The variable that makes Ajax possible
    address = document.getElementById('indirizzo').value;
    cap = document.getElementById('cap').value;
    type = document.getElementById('type').innerHTML;
            
    try {        
       // Opera 8.0+, Firefox, Safari
       ajaxRequest1 = new XMLHttpRequest();
    } catch (e) {
       // Internet Explorer Browsers
       try {
          ajaxRequest1 = new ActiveXObject("Msxml2.XMLHTTP");
       } catch (e) {
          try {
             ajaxRequest1 = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {
             // Something went wrong
             alert("Your browser broke!");
             return false;
          }
       }
    }

    ajaxRequest1.open("GET", "queryajax.php?query=SELECT * FROM segnalazione WHERE indirizzo="+indirizzo+" AND cap="+cap+" AND type="+type, true);
    ajaxRequest1.send(null); 
    
    ajaxRequest1.onreadystatechange = function() {
       if(ajaxRequest1.readyState == 4) {
            //console.log(ajaxRequest1.responseText);
            jsonAjaxsegn = jQuery.parseJSON(ajaxRequest1.responseText);
            console.log(jsonAjaxsegn);

            if(jsonAjaxsegn != null){
                document.getElementById('launchModal').click();
            }
        }
    }*/
}