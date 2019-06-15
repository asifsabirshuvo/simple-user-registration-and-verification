var val1 ;

setInterval(function(){

val1 = document.getElementById('len').innerHTML;
console.log(val1);

see();

},5000); 

function see(){
var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open('GET', 'http://localhost:3000/val');

    xhr.onload = function () {
    if (xhr.status === 200) {
        var x = xhr.response;
        console.log(xhr.response);
        var s =''
        for(i=0;i<x.length;i++){
        	s+="\n"+x[i]._id+x[i].first_name;
        }

        document.getElementById('ok').innerHTML=s; 
        document.getElementById('len').innerHTML=x.length; 
    	var valLatest = document.getElementById('len').innerHTML;
        console.log(valLatest);

	if(valLatest>val1){
       play();
	}
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();
}


function deleteall(){
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/deleteall');
xhr.onload = function() {
    if (xhr.status === 200) {
        document.getElementById('ok').innerHTML='<div class="alert alert-danger" style="width:50%;text-align:center; margin:auto;"> all deleted!!! </div>'; 
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();
}

function play(){
    document.getElementById("myAudio").play(); 
    console.log('function played  tone')	
}
