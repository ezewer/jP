// JavaScript Document
// window.selectedUsersToFromGroup
function selectMatchForChallenge(){
	document.getElementById("challenge-visible-dom").innerHTML='<div class="container title-box bg-color3"><div class="row vertical-align"><div class="col-xs-12"><h1>ELEGIR PARTIDO</h1></div></div></div><div class="container title-box bg-color1"><div class="row vertical-align"><div class="col-xs-9"><h1>Partidos Disponibles</h1></div><div class="col-xs-3 text-right"><a onClick="openMatchesFilterWindow();" class="btn-filter"><i class="fa fa-sliders fa-2x" aria-hidden="true" style="color: #fff;"></i></a></div></div></div><div class="matches-list" id="matches-challenges-container-show"><div class="loader"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>';
	// challengeGroupName
	window.matchesFilterArray=[];
	showAveliableMatchesToSelect();
}
function showAveliableMatchesToSelect(){
	var previousMatchesLoad=JSON.parse(getCookie("tablesToPlay-Jp"));
	var flag=0;
	if(document.getElementById("matches-challenges-container-show")!=null){ // Si no hay un elemento visible solo las guarda en memoria cookie tablesToPlay-Jp
		previousMatchesLoad.sort(compareTablesSort);
		//arregloDeMesasConComentarios=new Array();
		for (var i = 0; i < previousMatchesLoad.length; i++) {
			if(mesaDisponibleParaJugarHorario(previousMatchesLoad[i]['start_time'])==true && previousMatchesLoad[i]['private']==false){
			if(flag==0){removeLoaderFromCertainContainer(document.getElementById("matches-challenges-container-show"));flag=1;}// Marco asi no pasa cada vez
				loadMatchToShownMatches(previousMatchesLoad[i]);
			}
		}
	}
}
function loadMatchToShownMatches(shownTable){
	var createTable = document.createElement('div');
	createTable.className="match-list-item";
	createTable.setAttribute("data-tournament-type", shownTable.tournament_id);
	createTable.setAttribute("data-table-id", shownTable.id);
	//mesaACrear.style=premiumTable(coins, sms);
	createTable.innerHTML='<div class="container container-title bg-color2"><div class="col-xs-9 nopadding"><h3>'+shownTable.title+'</h3></div><div class="col-xs-3 nopadding text-right"><h3></h3></div></div><div class="container match-data"><div class="row vertical-align"><div class="col-xs-3 text-left match-time"><p>'+dateFormatViewNormal(shownTable.start_time)+'</p></div><div class="col-xs-2 text-center match-cup"><img src="img/tournament/flags/flag-'+shownTable.tournament_id+'.jpg"></div><div class="col-xs-2 text-center match-type"></div><div class="col-xs-2 text-center prize-type"></div><div class="col-xs-4 text-right match-button"><button type="button" class="btn btn-default btn-style2" onClick="selectMatchToPlayAsChallenge(\''+shownTable.id+'\');">ELEGIR</button></div></div></div>';
	// <button type="button" class="btn btn-default btn-style2" onClick="selectMatchToPlayAsChallenge(\''+shownTable.id+'\');">ELEGIR</button>'
	document.getElementById("matches-challenges-container-show").appendChild(createTable);
}
function selectMatchToPlayAsChallenge(tableId){
	startLoadingAnimation();
	if(checkConnection()){var xmlhttp;
		if (window.XMLHttpRequest)
	 	 {// code for IE7+, Firefox, Chrome, Opera, Safari
	  		xmlhttp=new XMLHttpRequest();
	  		}
		else
	  	{// code for IE6, IE5
	 	 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 	 }
		xmlhttp.onreadystatechange=function()
	  	{
			//alert("xmlhttp.readyState: "+xmlhttp.readyState+"xmlhttp.status: "+xmlhttp.status);
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422) ||  (xmlhttp.readyState==4 && xmlhttp.status==401))
	    {
			jsonStr=xmlhttp.responseText;
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				var doble=JSON.parse(jsonStr);
				createGroupToChallenge(doble);
			}else{
				//alert("jsonError");
				closeLoadingAnimation();
				selectMatchToPlayAsChallenge(tableId)
			}
			return true;
	    }else if(xmlhttp.status==503 || xmlhttp.status==404){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlay("ERROR DE CONEXIÓN","<p>Hubo un error de conexió intente nuevamente</p>");
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("GET","http://app.jugaplay.com/api/v1/tables/"+tableId+"/",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.withCredentials = "true";
		xmlhttp.send();	}
}
function createGroupToChallenge(matchDetails){
	if(window.groupAllreadyCreated==false){
		var json=JSON.stringify({ "group": {"name":window.nameForGroup, "user_ids": window.selectedUsersToFromGroup} });
		if(checkConnection()){var xmlhttp;
		if (window.XMLHttpRequest)
	 	 {// code for IE7+, Firefox, Chrome, Opera, Safari
	  		xmlhttp=new XMLHttpRequest();
	  		}
		else
	  	{// code for IE6, IE5
	 	 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 	 }
		xmlhttp.onreadystatechange=function()
	  	{
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422))
	    {
			jsonStr=xmlhttp.responseText;
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				var doble=JSON.parse(jsonStr);
				createMatchChallenge(doble.id, matchDetails);
			}else{
				//alert("jsonError");
				createGroupToChallenge(matchDetails);
			}
			return true;
	    }else if(xmlhttp.status==503 || xmlhttp.status==404){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlay("ERROR DE CONEXIÓN","<p>Hubo un error de conexió intente nuevamente</p>");
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST","http://app.jugaplay.com/api/v1/groups/",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.withCredentials = "true";
		xmlhttp.send(json);}
	}else{
		createMatchChallenge(window.groupAllreadyCreated, matchDetails);
		// window.groupAllreadyCreated id del grupo
	}
}
function createMatchChallenge(groupId,matchDetails){
	var uniqueTitle="-unchn"+getUserJugaplayId()+"u"+Math.floor((Math.random() * 1000) + 1);
	var title= matchDetails.title+uniqueTitle;
	var description= matchDetails.description;
	var matchId= matchDetails.matches[0].id;
	var json=JSON.stringify({"table": {"title":title, "description":description, "match_id":matchId, "group_id":groupId, "entry_coins_cost":parseInt(window.prizeForChallenge)}});
	if(checkConnection()){var xmlhttp;
		if (window.XMLHttpRequest)
	 	 {// code for IE7+, Firefox, Chrome, Opera, Safari
	  		xmlhttp=new XMLHttpRequest();
	  		}
		else
	  	{// code for IE6, IE5
	 	 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 	 }
		xmlhttp.onreadystatechange=function()
	  	{
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422))
	    {
			jsonStr=xmlhttp.responseText;
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				closeLoadingAnimation();
				closeAllOverLapseWindow();
				setTimeout(function(){endOfFormMatch();}, 1000);
			}else{
				//alert("jsonError");
				createMatchChallenge(groupId,matchDetails)
			}
			return true;
	    }else if(xmlhttp.status==503 || xmlhttp.status==404){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlay("ERROR DE CONEXIÓN","<p>Hubo un error de conexió intente nuevamente</p>");
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST","http://app.jugaplay.com/api/v1/tables",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.withCredentials = "true";
		xmlhttp.send(json);}
}
function endOfFormMatch(){
	window.lastTableCheck=new Date(1401507903635);// Esto va a hacer que se vuelvan a pedir todas las mesas
	avisoEmergenteJugaPlay("Desafío armado","<p>El desafío está  listo para ser jugado.</p><p>Encuentra el mismo en el sector desafíos.</p>");
}
// Filter Options
window.matchesFilterArray=[];
function openMatchesFilterWindow(){
	tableTitle='<H4>Filtrar Campeonatos</H4>';
	content=createShowMatchesFilter();
	openFilterWindow(tableTitle,content);
}
function createShowMatchesFilter(){
	simulateTablesFilter=[{"filterName":"dataTournament-type","dataFilter":"8","showName":"Torneo Argentino","openFunction":null},{"filterName":"dataTournament-type","dataFilter":"7","showName":"Torneo Chileno","openFunction":null},{"filterName":"dataTournament-type","dataFilter":"9","showName":"Champions League","openFunction":null}];
	content='<div class="list-style1">';
	for(individual in simulateTablesFilter){
		if(window.matchesFilterArray.indexOf(simulateTablesFilter[individual].dataFilter)!=-1){// Esta contenido en el Arreglo
				content+='<a data-tournament-type="'+simulateTablesFilter[individual].dataFilter+'" onClick="filterMatchOption(this)" class="selected">'+simulateTablesFilter[individual].showName+'</a>';
			}else{// No esta contenido en el Arreglo
			content+='<a data-tournament-type="'+simulateTablesFilter[individual].dataFilter+'" onClick="filterMatchOption(this)">'+simulateTablesFilter[individual].showName+'</a>';
			}
	}
	content+='</div>';
	return content;
}
function filterMatchOption(element){
	if(element.className=="selected"){
		element.className="";
		index=window.matchesFilterArray.indexOf(element.getAttribute('data-tournament-type'));
		if(index>-1)
		window.matchesFilterArray.splice(index, 1);
			}else{//.getAttribute('data-position-type')
		element.className="selected";
		window.matchesFilterArray.push(element.getAttribute('data-tournament-type'));
		}
	applyMatchFilter();
}
function applyMatchFilter(){
	tablesInContainer=document.getElementById("matches-challenges-container-show").getElementsByClassName("match-list-item");
	for(table in tablesInContainer){
		if(tablesInContainer[table].innerHTML !== undefined){
			actualAttribute=tablesInContainer[table].getAttribute('data-tournament-type');
			index=window.matchesFilterArray.indexOf(actualAttribute);
			if(index>-1 || window.matchesFilterArray.length==0)
				{tablesInContainer[table].style.display="block";}
			else
				{tablesInContainer[table].style.display="none";}
			
		}
	}
}