

这里是第二次修改

function addEvent(obj,Event,fn){
     if(obj.attachEvent){
	        obj.attachEvent('on'+Event,function(ev){
			      var ev=ev||window.event;//window.event是IE下的
				  var result=fn.call(obj);
				  if(result===false){
					   if(ev.stopProgagation){//ie8+和其他
					         ev.stopPropagation();
					   }else{
					         ev.cancelBubbe=true;//之前ie8-，先ie和标准浏览器
					   }
					   return false;
				  }
			});//在ie9一下this会出现问题指向window；就算绑定事件也是这样
			
	 }else{
	        obj.addEventListener(Event,function(ev){
			     if(fn.call(obj)===false){
				     ev.stopPropagation? ev.stopPropagation():ev.cancelBubble=true;
					 ev.preventDefault();
				 }
			},false);//return false 在火狐下的addeventListener失效；
	 }
}

function copyArr(srcArr,dstArr){
     //var arr=[];
	 for(var i=0; i<srcArr.length;i++){
	      dstArr.push(srcArr[i]);  
	 }
}

function getClass(oParent,sClass){
     var objs=oParent.getElementsByTagName('*');
	 var result=[];
	 for(var i=0; i<objs.length;i++){
	       if(objs[i].className==sClass){
		           result.push(objs[i]);
		   }
	 }
	 return result;
}

function getStyle(obj,attr){
     if(obj.currentStyle){
	        return obj.currentStyle[attr];
	 }else{
	        return getComputedStyle(obj,false)[attr];
	 }
}

function getIndex(obj){
      if(!obj) return -1;
      var oBorder=obj.parentNode.children;
	  for(var i=0; i<oBorder.length; i++){
	        if(obj==oBorder[i]){
			     return i;
			}
	  }
	  
}

function Mquery(mArg){
	this.element=[];
	switch(typeof mArg){
	     case 'function':
		 addEvent(window,'load',mArg);
		 break;
		 case 'string':
		 switch(mArg.substring(0,1)){
			 case '#':
			     var obj=document.getElementById(mArg.substring(1));
				 this.element.push(obj);
			 break;
			 case '.':
			      this.element=getClass(document,mArg.substring(1));
			 break;
			 default:
			      this.element=document.getElementsByTagName(mArg);
		 };
		 break;
		 case 'object':
		 this.element.push(mArg);
	}
}

Mquery.prototype.click=function(fn){
      for(var i=0; i<this.element.length;i++){
	         addEvent(this.element[i],'click',fn);
	  }
	  return this;
}

Mquery.prototype.show=function(){
     for(var i=0; i<this.element.length;i++){
	        this.element[i].style.display='block';
	 }
	 return this;
}

Mquery.prototype.hide=function(){
     for(var i=0; i<this.element.length;i++){
	        this.element[i].style.display='none';
	 }
	 return this;
}

Mquery.prototype.hover=function(overIn,overOut){
     for(var i=0; i<this.element.length;i++){
	        addEvent(this.element[i],'mouseover',overIn);
			addEvent(this.element[i],'mouseout',overOut);
	 }
	 return this;
}

Mquery.prototype.css=function(attr,style){
	if(typeof arguments[0]=='object'){
	    for(var i=0;i<this.element.length; i++){
		      for(var newAttr in arguments[0]){
		            this.element[i].style[newAttr]=arguments[0][newAttr]
		      }
		}
	}else{
		switch(arguments.length){
			  case 1:
			  return getStyle(this.element[0],attr);
			  break;
			  case arguments.callee.length:
			  for(var i=0; i<this.element.length;i++){
				   this.element[i].style[attr]=style;
			  }
			  break;
		}
    }
	return this;
}

Mquery.prototype.toggle=function(){
	   var _arguments=arguments;
       for(var i=0; i<this.element.length;i++){
	         addToggle(this.element[i]);
	   }
	   function addToggle(obj){
		     var count=0;
	         addEvent(obj,'click',function (){
					_arguments[count++%_arguments.length].call(obj);
			 })
	   }
	   return this;
}

Mquery.prototype.attr=function(proto,value){
     
	  if(arguments.length==1){
	         return this.element[0].getAttribute(proto);
	  }else if(arguments.length==2){
	         for(var i=0; i<this.element.length;i++){
			        this.element[i].setAttribute(proto,value);
			 }
	  }
	  //或者用下面这种方式
	  if(arguments.length==1){
	       return this.element[0][proto];
	  }else if(arguments.length==2){
	       for(var i=0; i<this.element.length;i++){
		         this.element[i][attr]=value;
		   }
	  }
	  return this;
}

Mquery.prototype.eq=function(num){

	 /*var arr=[];
	 for(var i=0; i<this.element.length;i++){
	       if(i<num){
		        arr.push(this.element[i]);
		   }
	 }
	 this.element=arr;
	 return this;
     
	 var arr=Array.prototype.slice.call(this.element);
	 arr.splice(num);
	 this.element=arr;
	 return this;*/
	 return $(this.element[num]);
	 
}

Mquery.prototype.find=function(str){
     var arr=[];
	 for(var i=0; i<this.element.length;i++){
	      switch(str.charAt(0)){
		        case '.':
				    var aRe= getClass(this.element[i],str.substring(1));
				    arr=arr.concat(aRe);
				break;
				case '#':
				    var aRe=document.getElementById(str.substring(1));
					arr=arr.concat(aRe);
				break;
				default:
				    var aRe=document.getElementsByTagName(str);
					//arr=arr.concat(aRe);//因为aRe不是数组，所以不能使用concat;
					copyArr(aRe,arr);
		  }
	 }
	 var newQuery=$();
	 newQuery.element=arr;
	 //alert(newQuery.element.length)
	 return newQuery;
}

Mquery.prototype.index=function(str){
	 var This=this;
	 if(arguments.length==1){
	       if(typeof str==='string'){
				switch(str.charAt(0)){
					case '.':
						for(var i=0; i<this.element.length; i++){
							  if(this.element[i].className==str.substring(1)){
								  return i;
							  }
						}
					break;
					case '#':
						var aRe=document.getElementById(str.substring(1));
						return checkEq(aRe);
					break;
			   }
		   }else if(typeof str=='object'){
				  return checkEq(str.element[0]); 
		   }
		   
		   function checkEq(obj){
		         for(var i=0 ;i<This.element.length; i++){
					 if(obj==This.element[i]){
						 return i;
					 }
				 }
		   }
	 }
     return  getIndex(this.element[0]); 
}

Mquery.prototype.bind=function(sEv,fn){
     for(var i=0; i<this.element.length; i++){
	      addEvent(this.element[i],sEv,fn);
	 }
}

Mquery.prototype.extend=function(name,fn){
     Mquery.prototype[name]=fn;
}

function $(mArg){
     return new Mquery(mArg);
}