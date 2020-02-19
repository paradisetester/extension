"use strict";
var siteurl = "https://api.paradisetechsoft.com/api/";


function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }
  return '';
}
var upworkwindow = getMeta('savepage-title');



/***************submit proposal screen*******************/
if(upworkwindow == 'Submit a Proposal'){

var url = window.location.href;
var jobID = getJobID(url);
localStorage.jobID = jobID;
	  
function getJobID(contentURL){
	var urlArrray = contentURL.split("/");
	return urlArrray[6];
}

var dropdown = document.getElementById("mySelect"); if(dropdown){ dropdown.remove()} 
var myDiv = document.getElementsByClassName("up-disintermediation-container")[0];
var array = CoverList; 

var selectList = document.createElement("select");
selectList.setAttribute("id","mySelect"); 
if(myDiv){
	myDiv.prepend(selectList);	
}

for(var i = 0; i < array.length;	i++) {    
	var option = document.createElement("option"); 
	option.setAttribute("value", array[i].description);  
 	option.text = array[i].title;	
 	selectList.appendChild(option);
} 

selectList.onchange = function() {
  document.getElementById("coverLetter").value =this.value  
}


var btnSubmit = document.querySelectorAll("a.btn.btn-primary");
if(btnSubmit[0]){
	btnSubmit[0].addEventListener("click", proposalSubmit);
}else{
	var btnSubmit1 = document.getElementsByClassName("btn-primary");
	btnSubmit1[0].addEventListener("click", proposalSubmit);
}


function proposalSubmit() {
	var jobConnects ='';
	var freelancerConnect = '';
	var companyConnect = '';
	var jobConnectsHTML = document.querySelectorAll('div.m-md-top.ng-scope');
	
	if(jobConnectsHTML[1]){
		 jobConnects = jobConnectsHTML[1].querySelectorAll('span')[0].querySelectorAll('strong')[0].innerText;
	}else{
		jobConnects = jobConnectsHTML[0].querySelectorAll('.m-sm-bottom span')[0].querySelectorAll('strong')[0].innerText;
		companyConnect = jobConnectsHTML[0].querySelectorAll('div.ng-scope')[2].querySelectorAll('strong')[0].innerText;

		console.log(companyConnect);
	}

	var userConnects = document.querySelectorAll('span.text-muted.ng-binding.ng-scope');
	if(userConnects[0]){
		freelancerConnect = userConnects[0].innerText;
	}
	if(userConnects[1]){
		companyConnect = userConnects[1].innerText;
	}

	var companyName = '';
	var freelancerName ='';
	var type = ''
	var skillhtml = document.querySelectorAll('.o-tag-skill'),i; 
	var skills = []; 
	for (i = 0; i < skillhtml.length; ++i) {
			skills.push(skillhtml[i].innerText)
		};
			var username = biddername;
			var bidPrice = document.getElementById("chargedAmount").value;
			var account_name = document.getElementsByClassName("account-name")[0].innerHTML;
			
			var freelancer = document.querySelectorAll('.ng-binding.active');
			if(freelancer[0]){
				companyName = freelancer[0].innerHTML;
				freelancerName = freelancer[1].innerHTML;
				type = 'company';
			}else{
				type='freelancer';
				freelancerName = account_name;
			}

			var params = 'user_name='+username+'&job_id='+jobID+'&budget='+bidPrice+'&jobConnects='+jobConnects+'&freelancerConnect='+freelancerConnect+'&companyConnect='+companyConnect+'&upwork_user_id='+companyName+'&upwork_user_type='+type+'&freelancer_name='+freelancerName+'&skills='+skills+'&link='+url;
			var http = new XMLHttpRequest();
			var url = siteurl+'user_proposals';
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
			http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
					console.log('success');										
					}			
			}
			http.send(params); 
	}
}else{
	var succesJobElement = document.querySelectorAll("a.d-block.m-sm-top.ng-binding.ng-scope")[0];

	if(succesJobElement){
	var joburl = succesJobElement.getAttribute("href");;
	var jobID = joburl.replace('/freelancers/','');	
		if(localStorage.jobID == jobID){
			var param = 'job_id='+jobID+'&status=1';
			var http = new XMLHttpRequest();
			var url = siteurl+'proposals_status';
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
			http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
					console.log('success');	
					localStorage.jobID='';									
					}			
			}
			http.send(param); 
		}
	}
}