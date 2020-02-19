

/******************************************/
/*********Define Global variable***********/
/******************************************/

var siteurl = "https://api.paradisetechsoft.com/api/";
var authURL = "https://api.paradisetechsoft.com/auth/api/";
var biddername = 'Paradise team';
var upworkid = 'Test';
var heading = 'Null';
var discription = 'Null';
var jobTitle = 'Null';
var country = 'Null';
var skills = null;
var currentTab = 'Null';


chrome.tabs.onActivated.addListener(function(activeInfo) {
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
     console.log(tab);
  });
}); 

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {	 
		getCoverLetter();		
  }else{
  
  }
})



/***************************************************/
/*********On load event jquery**********************/
/***************************************************/

document.addEventListener('DOMContentLoaded', function() {
	auth();
 if (localStorage.accessToken) {

					biddername = localStorage.biddername;
					$('#biddername').html(biddername);
 					getCoverLetter();
 		//getFeed();
			  document.addEventListener('click',function(e){   
			  
			    if(e.target && e.target.id != 'cover'){//do something}
				
				   if(e.target.value)
				     {	
						coverClick(e.target.value)
					 }
				   }
			 });	
	}
	document.getElementById("deleteCookie").addEventListener("click", deleteAuth);	
 	
 	
});

function deleteAuth(){
	localStorage.removeItem("accessToken");
	location.reload();
}

function auth(){
if (typeof(Storage) !== "undefined") {

    if (localStorage.accessToken) {
  		console.log('success login');
    } else {
	      $( "#body_section" ).hide();
	      $( "#login_section" ).load( "login.html .container" );
    }
	  
  } else {
   alert("Sorry, your browser does not support web storage...");
  }
}


$(document).on('submit', function (event) {	
  event.preventDefault();
	getAccessToken();
	});

function getAccessToken(){
		var username = $('.username').val();
		var password = $('.password').val();  
	  	var url = authURL+'token/';
	    $.ajax({
	           type: "POST",
	           url: url,
			   contentType: "application/json",
	           data: JSON.stringify({username:username,password:password}), // serializes the form's elements.
	           success: function(data)
	           {
					
					localStorage.accessToken = data.access;
					localStorage.refreshToken = data.refresh;
					localStorage.biddername = username;
					biddername = username;
					$('#biddername').html(username);
					$( "#body_section" ).show();
					$( "#login_section" ).remove();
					getCoverLetter();
	           },
	           error: function (textStatus, errorThrown) {
		           	if(textStatus.status==401){ 
		           		$('.response').html('<p class="error">'+textStatus.responseJSON.detail+'</p>');		           		
		           	}	         
	           	}
		        
	         });
	
}

function getRefreshToken(){
	var url = authURL+'token/refresh/';
	$.ajax({
	           type: "POST",
	           url: url,
			   contentType: "application/json",
	           data: JSON.stringify({refresh:localStorage.refreshToken}), // serializes the form's elements.
	           success: function(data)
	           {
	           		localStorage.accessToken = data.access;						
					getCoverLetter();			
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 		          		
		          		localStorage.removeItem("accessToken");
		           		auth();	
		           	}
		           }
	         });
	
}

/******************************************************/
/*********Get Coverletter from paradise server*********/
/******************************************************/

function getCoverLetter() {


		$.ajax({
	           type: "GET",
	           url: siteurl+'proposals_v/?format=json',
			   contentType: "application/json",			   
	           beforeSend: function (xhr) {
				    xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.accessToken);
				},
	           success: function(data)
	           {
	           	//var data = JSON.parse(data);
					var output  ='';
					var Coverletter = data[0].description;
					coverAppend(Coverletter);
					biddername = localStorage.biddername;
					
					for (var i = 0; i < data.length; i++) {
						output += '<option value="'+data[i].id+'" data-details="'+data[i].description+'"> '+data[i].title+'</option>';
					}			

					$('#list').html(output);
					var CoverList = data;
					 biddername = localStorage.biddername;
					
					chrome.tabs.executeScript( {
						code: 'var CoverList = '+JSON.stringify(CoverList)+'; var skills = '+JSON.stringify(skills)+'; var biddername="'+biddername+'"'
					}, function() {
						chrome.tabs.executeScript({file: 'assets/js/script.js'});
						chrome.tabs.insertCSS({file: "assets/script.css"});
					});      				
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 
		           		getRefreshToken();	
		           	}
		           }
	         });
}


function coverClick(id) {
	
	$.ajax({
	           type: "GET",
	           url: siteurl+'proposals_v/'+id+'?format=json',
			   contentType: "application/json",			   
	           beforeSend: function (xhr) {
				    xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.accessToken);
				},
	           success: function(data)
	           {
	           		//var data = JSON.parse(data);	
					var Coverletter = data.description;
				   coverAppend(Coverletter);					
	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 
		           		getRefreshToken();	
		           	}
		           }
	         });

}	


/******************************************************/
/*********Get Feed from paradise server****************/
/******************************************************/

function getFeed() {

		$.ajax({
	           type: "GET",
	           url: siteurl+'rss_feed/?format=json',
	           data:'country=Singapore',
				contentType: "application/json",			   
	           beforeSend: function (xhr) {
				    xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.accessToken);
				},
	           success: function(data)
	           {


	           },	           
	           error: function (textStatus, errorThrown) {	           		
		          	if(textStatus.responseJSON.code == 'token_not_valid'){ 
		           		getRefreshToken();	
		           	}
		           }
	         });
}

/***************************************************/
/*********Copy Title on click button****************/
/***************************************************/

function copyTitle() {

  var copyText = document.getElementById("title");
  copyText.select();
  document.execCommand("Copy");  
}

                                                                                   

/************************************/
/*********Get tab URL****************/
/************************************/

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if(tabs){
	    var tab = tabs[0];
    	currentTab = tab.url; 
		// used in later calls to get tab info 	
		getFilename(currentTab); 
	}
   
});


/********************************************/
/*********Get Discription *******************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.getElementsByClassName('break')[0].innerText;"
}, function(selection) {
	if(selection){
	  discription = selection[0];  
	}
 });

/********************************************/
/*********Get Job Title *********************/
/********************************************/
/*
chrome.tabs.executeScript({
  file: "assets/js/jquery.min.js",
  allFrames: true
}); 

chrome.tabs.executeScript({
  file: "assets/js/script.js",
  allFrames: true
});
*/
chrome.tabs.executeScript( {
  code: "document.querySelectorAll('.m-md-bottom.ng-binding')[0].innerText;"
}, function(selection) {
	if(selection){
	  jobTitle = selection[0];  
	}
 
});

/********************************************/
/*********Get country Title *********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.querySelectorAll('.m-md-bottom.ng-binding')[0].innerText;"
}, function(selection) {
	if(selection){
	  country = selection[0];  
	}
});
/********************************************/
/*********Get Job skills *********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "var skillhtml = document.querySelectorAll('.o-tag-skill'),i; var skill = []; for (i = 0; i < skillhtml.length; ++i) {skill.push(skillhtml[i].innerText)};skill"
}, function(skill) {
	if(skill){
		skills = skill[0];
		var spans = '';
		for (var i = 0; i < skills.length; i++) {
			spans += '<span>'+skills[i]+'</span>';
		}
		document.getElementById("skillsList").innerHTML = spans;
	}

});




/********************************************/
/*********Get Upwork Id**********************/
/********************************************/

chrome.tabs.executeScript( {
  code: "document.getElementsByClassName('account-name')[0].innerText;"
}, function(selection) {
	if(selection){
		 upworkid = selection[0];
	}
 
});

/******************************************************/
/*********Execute script send data to paradise server**/
/******************************************************/

function coverAppend(Coverletter){
				chrome.tabs.executeScript( {
				  code: 'var letter = "'+Coverletter+'"; var textarea = document.getElementById("coverLetter"); if(textarea){ textarea.value =letter}'
				}, function() {

				});
}



/*************************************/
/*********Create URL by Title*********/
/*************************************/


function getFilename(contentURL) {
	var heading = contentURL;
    var links = contentURL.split('?')[0].split('#')[0];
    var name = contentURL.split('?')[0].split('#')[0];
    if (name) {
        name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        
    } else {
        name = '';
    }
	
     return  name;
}



