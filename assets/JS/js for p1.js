// fadeout of username block
$(document).ready(function(){
    $("#butt").click(function(){
      $("#first").fadeOut(1000);
      $("#bgtext").fadeOut(1000);
      $("#tools").css("display","block");
      $("#start").css("display","block");
      $(".exit").css("display","block");
    });
  });

// div menu of settings
var clicksettings = document.getElementById("seet")
clicksettings.addEventListener("click",divappear)
function divappear(){
  var divname= document.getElementById("settmenu")
  divname.style.display='block';
}

//  change sound pic with click
var clickpictochange = document.getElementById("soundpicmenu")
var mutepic = false;
clickpictochange.addEventListener("click",changepicsound)
function changepicsound(){
  clickpictochange.style.background =  "url('assets/images/mute.png')"
  if(mutepic)
  {
    clickpictochange.style.background =  "url('assets/images/sound.png')"
    mutepic = false;
      clickpictochange.setAttribute("name","ok");

  }
  else{
    clickpictochange.style.background =  "url('assets/images/mute.png')"
    mutepic = true;
      clickpictochange.setAttribute("name","muted");

  }
}

// open how to play
var howdiv=document.getElementById("how")
howdiv.addEventListener('click',showhow)
function showhow(){
  var gethow = document.getElementById("howPlay")
  gethow.style.display='block';
}


// close button of div how
var closebutt = document.getElementById("closebtn")
closebutt.addEventListener("click",closedisappear)
function closedisappear(){
  var howclose = document.getElementById("howPlay")
  howclose.style.display="none";
}

/*var subokdisappear = document.getElementById("subok")
subokdisappear.addEventListener("click",disbutt)
function disbutt(){
    var settingsdiv = documnt.getElementById("setting");
    settingsdiv.style.display= 'none';
}
*/
