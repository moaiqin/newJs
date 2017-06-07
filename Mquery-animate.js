$().extend('animate',function(json,time,fn){
    for(var i=0 ;i<this.element.length; i++){
	      moveAction(this.element[i],json,time,fn);
	}
	return this;
})

function moveAction(obj,json,time,fn){
      time=time||30;
	  clearInterval(obj.timer);
	  obj.timer=setInterval(function(){
	        var complete=true;
			for(var attr in json){
			     var iCur=parseInt(getStyle(obj,attr));
				 if(attr=='opacity'){
				      var iSpeed=(json[attr]-iCur*100)/7;
				 }else{
				      var iSpeed=(parseInt(json[attr])-iCur)/7;
				 }
				 oSpeed=iSpeed>0? Math.ceil(iSpeed):Math.floor(iSpeed);
				 if(parseInt(json[attr])!=iCur){
				     complete=false;
				 }
				 
				 if(complete){
				     clearInterval(obj.timer);
					 fn&&fn();
				 }else{
				     if(attr=='opacity'){
					      obj.style.opacity=(iCur+oSpeed)/100;
						  obj.style.filter='alpha(opacity='+(iCur+oSpeed)+')';
					 }else{
					      obj.style[attr]=iCur+oSpeed+'px';
					 }
				 }
			}
	  },time);
}