var resultNavigation_pages = {'pageStart':null, 'pageEnd':null, 'actPage':null, 'numPage':null, 'resPerPage':null, 'totCount':null};    // Counter inizio pagina, Counter fine pagina, Pagina attuale, Num Pagine, Risultati per pagina, Counter totale,

function launchSettings(){
    input_cap = document.getElementById('filter-input-cap');

    // chiudi full card precedente
    document.getElementsByClassName('btn-close')[0].click();

    cap = '';

// Setting cap value
    // Se sono nel formato sbagliato, quindi invalid, settali = valori di default
    if(input_cap.value == "")
        cap = 'cap != ""';
    else{
        cap = 'cap='+input_cap.value;
    }
    console.log('Cap: ' + cap);

    query += 'SELECT * FROM collettivo WHERE '+ cap;
    console.log('FULL QUERY: ' + query);

    queryajax(query, res_num);
} 

function queryajax(query, res_num) {
    var ajaxRequest1;  // The variable that makes Ajax possible
            
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

    // Now get the value from user and pass it to
    // server script.
    ajaxRequest1.open("GET", "queryajax.php?query=" + query, true);
    ajaxRequest1.send(null); 
    
    // Create a function that will receive data
    // sent from the server and will update
    // div section in the same page.
    ajaxRequest1.onreadystatechange = function() {
       if(ajaxRequest1.readyState == 4) {
            //console.log(ajaxRequest1.responseText);
            jsonAjaxcards = jQuery.parseJSON(ajaxRequest1.responseText);
            console.log(jsonAjaxcards);

            // Inizializzo l'utility per gestione pagine
            resultNavigation_pages['totCount'] = jsonAjaxcards != null? jsonAjaxcards.length : 0;
            resultNavigation_pages['numPage'] = Math.ceil(resultNavigation_pages['totCount']/res_num);
            resultNavigation_pages['resPerPage'] = res_num;
            resultNavigation_pages['pageStart'] = 0;
            resultNavigation_pages['pageEnd'] = res_num;
            resultNavigation_pages['actPage'] = 1;

            // Inizializzo la resultNavigation_DIV
            resultNavigation_li = document.querySelectorAll('.page-item');
            // Setto la prima pagina come selezionata
            for(var i = 0; i < resultNavigation_li.length; i++){
                if(i == 1)
                    resultNavigation_li[i].className = 'page-item active';
                else
                    resultNavigation_li[i].className = 'page-item';
            }
            position['actual'] = 1;
            // Controllo che << e >> siano o no da disabilitare
            resultNavigation_li[0].className = 'page-item disabled';
            
            if(resultNavigation_li[position['actual']].firstChild.innerHTML == resultNavigation_pages['numPage'])
                resultNavigation_li[4].className = 'page-item disabled';
            else
                resultNavigation_li[4].className = 'page-item';

            // Controllo che quadrati numerici siano o no da disabilitare
            for(var i = 1; i < resultNavigation_li.length - 1; i++){
                if(parseInt(resultNavigation_li[i].firstChild.innerHTML) > resultNavigation_pages['numPage'])
                    resultNavigation_li[i].className = 'page-item disabled';
                else if(resultNavigation_li[i].className != 'page-item active')
                    resultNavigation_li[i].className = 'page-item';
            }

            if(resultNavigation_pages['totCount'] == 0){
                resultNavigation_li[i].className = 'page-item disabled';
            }

            NormalPointersSource.clear();
            MagisterPointersSource.clear();

            addCards();
        }
    }
}

function addCards(){
    // Svuoto results
    for(var i = 0; i < document.querySelectorAll('[class="card forced"]').length; i++){
        document.querySelectorAll('[class="card forced"]')[i].remove();
        i--;
    }
    for(var i = 0; i < document.querySelectorAll('[class="card"]').length; i++){
        document.querySelectorAll('[class="card"]')[i].remove();
        i--;
    }

    // la scheda di partenza dei risultati è pari alla pagina attuale, * res_num se > 1, +1
    resultNavigation_pages['pageStart'] =  (parseInt(resultNavigation_pages['actPage']) - 1) * parseInt(resultNavigation_pages['resPerPage']);

    // Iteratore, da scegliere tra: numero risultati rimasti e numero risultati per pagina
    resultNavigation_pages['pageEnd']  = ((parseInt(resultNavigation_pages['totCount']) - parseInt(resultNavigation_pages['pageStart'])) < parseInt(resultNavigation_pages['resPerPage']))? (parseInt(resultNavigation_pages['totCount'])) : (parseInt(resultNavigation_pages['pageStart']) + parseInt(resultNavigation_pages['resPerPage']));

    // Setto la voce di resume dei risultati
    let resultNavigation_resultSummary = document.getElementById('resultNavigation_resultSummary');
    if(parseInt(resultNavigation_pages['pageStart']) == parseInt(resultNavigation_pages['pageEnd']))
        resultNavigation_resultSummary.innerHTML = "Nessuna corrispondenza ai parametri di ricerca trovata"
    else
        resultNavigation_resultSummary.innerHTML = 'Risultati: ' + (parseInt(resultNavigation_pages['pageStart']) + 1) + '-' + parseInt(resultNavigation_pages['pageEnd']) + ' di ' + parseInt(resultNavigation_pages['totCount']);
    
    for(var i = resultNavigation_pages['pageStart']; i < resultNavigation_pages['pageEnd']; i++){
        let element = jsonAjaxcards[i];

        // AGGIUNGI RICERCA IMMAGINE
        console.log(element);
        let card = document.createElement('div');
        card.className = 'card';
        card.id = element.cap;
        first_image = './src/collettivo/'+element.codice+''+'_1.jpg';

        card.innerHTML = '<div class="card-img-top-container">'
        +       '<img src="'+first_image+'" class="card-img-top" alt="Foto Segnalazione">'
        +   '</div>'
        +   '<div class="card-body">'
        +       '<h4 class="card-title">'+element.title+'</h4>'
        +       '<h6 class="card-title">#'+element.codice+'</h6>'
        +       '<h6 class="card-title">'+element.indirizzo+', '+element.cap+'</h6>'
        +       '<button class="btn btn-primary" id="buttonFullCard#'+element.codice+'" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop" onmouseover = onCardHover(event) onmouseleave = onCardUnHover(event)>'
        +           'Visualizza Scheda Completa'
        +       '</button>'
        +   '</div>'
        + '</div>';
        document.getElementById("staticBackdrop").before(card.valueOf());

        resultNavigation_pages[0] += 1;
    }
}

async function onCardHover (event){
    let fullCard = document.getElementById('staticBackdrop').getElementsByClassName('card incanvas-card')[0];
    var card = event.target.parentElement.parentElement;
    for(var i = 0; i < jsonAjaxcards.length; i++){
        let element = jsonAjaxcards[i];
        //console.log(card.id + ' and ' + element.codice);
        if(element.cap == card.id){

            let carousel_items = await carouselLoad(element);

            fullCard.id = element.cap;

            first_image = './src/collettivo/'+element.codice+''+'_1.jpg';
            //COMPLETA FILL 

            fullCard.innerHTML = ''
            +   '<div class="card-img-top-container">'
            +       '<img src="'+first_image+'" class="card-img-top" alt="Foto Segnalazione">'
            +   '</div>'
            +   '<div class="card-body">'
            +       '<h3 class="card-title">'+element.nome+'</h3>';
            fullCard.innerHTML += '<ul>'
                +           '<li id="card-text-date-active">'
                +               '<b>Iscritti: </b>'+element.participating+' su '+element.required_participating
                +           '</li>'
                +           '<li id="card-text-where">'
                +               '<b>Indirizzo: </b>'+element.indirizzo+', '+element.cap
                +           '</li>'
                +           '<li id="card-text-type">'
                +               '<b>Tipologia: </b>'+type
                +           '</li>'
                +           '<li id="card-text-gravity">'
                +               '<b>Indice di Gravit&agrave;: </b>'+element.gravity
                +           '</li>'
                +        '</ul>';
            fullCard.innerHTML += ''
            +        '<p class="card-text" id="card-text-description">'
            +           '<b>Descrizione</b><br>'+element.description
            +        '</p>'
            +        '<p class="card-text" id="card-text-description">'
            +           '<b>Immagini</b>'
            +        '</p>'
            +        '<div id="carouselExampleRide" class="carousel slide" data-ride="carousel" data-bs-ride="true" id="card-images">'
            +         '<div class="carousel-inner">'
            +           carousel_items
            +         '</div>'
            +         '<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">'
            +           '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'
            +           '<span class="visually-hidden">Previous</span>'
            +         '</button>'
            +         '<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">'
            +           '<span class="carousel-control-next-icon" aria-hidden="true"></span>'
            +           '<span class="visually-hidden">Next</span>'
            +         '</button>'
            +       '</div>';
            // Bottoni di full card in base alla sessione. Dagli la stessa funzione con event come parametro e gestisci tutto li dentro. Dagli anche la stessa funzione di onfocusout
            if(visualizing_layer == 0){
                fullCard.innerHTML += ''
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_elimina" onclick=fullCard_actionManager(event)>Elimina Segnalazione</button>'
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_rinuncia" onclick=fullCard_actionManager(event)>Rinuncia all\'Incarico</button>'
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_conferma" onclick=fullCard_actionManager(event)>Conferma avvenuta Risoluzione</button>'
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_completata" onclick=fullCard_actionManager(event)>Segna come Completata</button>';
            }
            else{
                fullCard.innerHTML += '<ul>'
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_iscriviti" onclick=fullCard_actionManager()>Partecipa all\'Iniziativa</button>'
                +           '<button class="btn btn-outline-secondary fullCard" type="button" id="fullCard_disiscriviti" onclick=fullCard_actionManager()>Ritira Partecipazione all\'Iniziativa</button>';
            }
            +   '</div>'
            + '</div>';

            break;
        }
    }
}

function fullCard_actionManager(event){
    action = event.target.id;

    if(action == 'fullCard_elimina'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per eliminare la Segnalazione. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }
    else if(action == 'fullCard_rinuncia'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per rinunciare all\'incarico. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }
    else if(action == 'fullCard_conferma'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per offrirti volontario per l\'incarico. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }
    else if(action == 'fullCard_completata'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per confermare il corretto completamento dell\'incarico. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }
    else if(action == 'fullCard_iscriviti'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per confermare la partecipazione all\'iniziativa. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }
    else if(action == 'fullCard_disiscriviti'){
        document.getElementById('confirmModalBody').innerHTML = 'Stai per annullare la partecipazione all\'iniziativa. Confermi?';
        document.getElementById('modalConfirmButton').onclick = function (){
            document.getElementById('modalCloseButton').click();
            //reindirizzamento php corretto
        }
    }

    document.getElementById('launchModal').click();
}

async function carouselLoad(element){
    // Load Images and manage carousel
    let images_item_list = '';
    let images_iter = 1;
    let check = true;
    let images_url = '';

    if(visualizing_layer == 0)
        images_url = './src/segnalazione/';
    else
        images_url = './src/segnalazione_magistra/';

    while(check){
        if(images_iter == 1){
            images_item_list += ''
            +            '<div class="carousel-item active">'
            +              '<img src="'+images_url+''+element.codice+'_'+images_iter+'.jpg" class="d-block w-100" alt="...">'
            +            '</div>';
        }
        else{
            images_item_list += ''
            +            '<div class="carousel-item">'
            +              '<img src="'+images_url+''+element.codice+'_'+images_iter+'.jpg" class="d-block w-100" alt="...">'
            +            '</div>';
        }
        images_iter++;

        check = await checkIfImageExists(images_url+''+element.codice+'_'+images_iter+'.jpg');
    }
    return images_item_list;
}

async function checkIfImageExists(url) {
    let check = false;
    let get = await fetch(new Request(url, {method: 'HEAD', mode: 'no-cors', cache: "no-store"}))
    if(get.ok){
        check = true;
    }
    else {
        check = false;
    }
    return check;
}

// gestione resultnavigation_div
function managePage(event){
    // Se è disabled non ha accesso alla funzione
    if(event.target.className == 'page-item disabled')
        return;

    fire = event.target.parentElement;
    if(fire.className == 'page-link')
        fire = fire.parentElement;

    resultNavigation_li = document.querySelectorAll('.page-item');
    console.log(document.querySelectorAll('.page-item'));
    console.log(fire.className);

    for(var i = 0; i < resultNavigation_li.length; i++){
        //alert(resultNavigation_li[i].className);
        if(resultNavigation_li[i].className == 'page-item active')
            position['actual'] = i;
        if(resultNavigation_li[i].id == fire.id)
            position['selected'] = i;
        
        resultNavigation_li[i].className = 'page-item';
    }

    //alert(position['actual'] + ' pressed ' + position['selected']);

    if(position['selected'] == 0){                                                                                              // se hai premuto <<
        if(position['actual'] == 1){                                                                                                // se l'attuale premuto era il primo quadrato                                                                                                            //altrimenti    
            for(var i = 1; i < resultNavigation_li.length - 1; i++){                                                                    // setta di un numero in meno ogni quadrato
                resultNavigation_li[i].firstChild.innerHTML = parseInt(resultNavigation_li[i].firstChild.innerHTML) - 1;
            }
            position['selected'] = 1;
            resultNavigation_li[1].className = 'page-item active';                                                                      // seleziona il primo
            resultNavigation_pages['actPage'] = parseInt(resultNavigation_li[1].firstChild.innerHTML);                                       // la pagina attuale è data dal quadrato selezionato
        }
        else{                                                                                                                      // altrimenti
            position['selected'] = position['actual'] - 1;
            resultNavigation_li[position['actual'] - 1].className = 'page-item active';                                                   // il quadrato scelto viene selezionato
            resultNavigation_pages['actPage'] = parseInt(resultNavigation_li[position['actual'] - 1].firstChild.innerHTML);                    // la pagina attuale è quella selezionata
        }
    }
    else if(position['selected'] == 4){                                                                                          // se hai premuto >>
        if(position['actual'] == 3){                                                                                                // se l'attuale premuto era l'ultimo quadrato
            for(var i = 1; i < resultNavigation_li.length - 1; i++){                                                                    // setta di un numero in più ogni quadrato
                resultNavigation_li[i].firstChild.innerHTML = parseInt(resultNavigation_li[i].firstChild.innerHTML) + 1;
            }
            position['selected'] = 3;
            resultNavigation_li[3].className = 'page-item active';                                                                      // seleziona l'ultimo
            resultNavigation_pages['actPage'] = parseInt(resultNavigation_li[3].firstChild.innerHTML);                                       // la pagina attuale è data dal quadrato selezionato
        }
        else{    
            position['selected'] = position['actual'] + 1;                                                                                                                   // altrimenti
            resultNavigation_li[position['actual'] + 1].className = 'page-item active';                                                   // il quadrato scelto viene selezionato
            resultNavigation_pages['actPage'] = parseInt(resultNavigation_li[position['actual'] + 1].firstChild.innerHTML);                 // la pagina attuale è quella selezionata
        }
    }
    else{                                                                                                                           // altrimenti
        resultNavigation_li[position['selected']].className = 'page-item active';                                                   // il quadrato scelto viene selezionato
        resultNavigation_pages['actPage'] = parseInt(resultNavigation_li[position['selected']].firstChild.innerHTML);                    // la pagina attuale è quella selezionata
    }

    for(var i = 1; i < resultNavigation_li.length - 1; i++){
        if(parseInt(resultNavigation_li[i].firstChild.innerHTML) > resultNavigation_pages['numPage'])
            resultNavigation_li[i].className = 'page-item disabled';
        else if(resultNavigation_li[i].className != 'page-item active')
            resultNavigation_li[i].className = 'page-item';
    }

    // Disabilito o abilito pulsanti avanti e indietro
    if(resultNavigation_li[position['selected']].firstChild.innerHTML == 1)
        resultNavigation_li[0].className = 'page-item disabled';
    else
        resultNavigation_li[0].className = 'page-item';
    
    if(resultNavigation_li[position['selected']].firstChild.innerHTML == resultNavigation_pages['numPage'])
        resultNavigation_li[4].className = 'page-item disabled';
    else
        resultNavigation_li[4].className = 'page-item';

    document.getElementById('results').scrollTo({
        top: 0,
        behavior: "smooth"
    });

    addCards();                                                                                                                     // addCards, cioè la funzione per mostrare le carte
}