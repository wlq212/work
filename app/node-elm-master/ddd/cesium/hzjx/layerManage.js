function LayerManage() {
    var viewerW="";
    var LayerManagerObj={
        startPickUp:true,
        startManageB:true,
        loadCzml:"",
        loadCzmlTime:"",
        loadCzmlOneTime:"",
        loadCzmlBPc:"",
        loadCzmlFy:"",
        pickUp:"",
        request:"",
        init:"",
        loadPaichi:""
    }
    LayerManagerObj.init=function (data) {
        viewerW=data;
    }
    //相互排斥的导航加载
    LayerManagerObj.loadCzml=function (data,that){
    	if(data){
    		 switch (viewerW.dataSources._dataSources.length){
             case 0:
                 debugger;
                 $(that).attr("name",eval(data)[0].name);
                 var dataSource = Cesium.CzmlDataSource.load(eval(data));
                 viewerW.dataSources.add(dataSource);
                break;
            default:
                if($(that).attr("name")){
                    for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
                        if(viewerW.dataSources._dataSources[a].name==$(that).attr("name")){
                            viewerW.dataSources._dataSources[a].show=true;
                        }else{
                            if(viewerW.dataSources._dataSources[a].name!="gridLabels"){
                                viewerW.dataSources._dataSources[a].show=false;
                            }
                        }
                    }
                }else{
                    $(that).attr("name",eval(data)[0].name);
                    var dataSource = Cesium.CzmlDataSource.load(eval(data));
                    viewerW.dataSources.add(dataSource);
                    for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
                        if(viewerW.dataSources._dataSources[a].name==$(that).attr("name")){
                            viewerW.dataSources._dataSources[a].show=true;
                        }else{
                            if(viewerW.dataSources._dataSources[a].name!="gridLabels"){
                                viewerW.dataSources._dataSources[a].show=false;
                            }
                        }
                    }
              }
            break;
        }	
    	}
    }
    //分页加载czml
    LayerManagerObj.loadCzmlFy=function (data) {
    	if(data){
    		 if(viewerW.dataSources._dataSources.length>0){
    	            debugger;
    	            var arr=[]
    	            for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
    	                arr.push(viewerW.dataSources._dataSources[a].name)
    	            }
    	             if(arr.indexOf(eval(data)[0].name)!=-1){
    	                    viewerW.dataSources.remove( viewerW.dataSources._dataSources[arr.indexOf(eval(data)[0].name)]);
    	                    var dataSource = Cesium.CzmlDataSource.load(eval(data));
    	                    viewerW.dataSources.add(dataSource);
    	                    console.log( viewerW.dataSources)
    	                }else{
    	                    var dataSource = Cesium.CzmlDataSource.load(eval(data));
    	                    viewerW.dataSources.add(dataSource);
    	                }
    	        }else{
    	            var dataSource = Cesium.CzmlDataSource.load(eval(data));
    	            viewerW.dataSources.add(dataSource);
    	            console.log( viewerW.dataSources)
    	        }
    	}
    }
    //分页加载kml
    //控制同时显示与隐藏
    LayerManagerObj.loadCzmlTime=function (data) {
    	if(data){
   		 var dataSource=Cesium.CzmlDataSource.load(eval(data));
   	        viewerW.dataSources.add(dataSource);
   	        console.log( viewerW.dataSources)
   	    }
    }
    //不排斥
    LayerManagerObj.loadCzmlBPc=function (data,that) {
    	 $(that).attr("name",eval(data)[0].name);
    	 var arr=[]
         for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
             arr.push(viewerW.dataSources._dataSources[a].name)
         }
    	if($(that).hasClass("active")){
        	 if(arr.indexOf(eval(data)[0].name)!=-1){
        		 viewerW.dataSources._dataSources[arr.indexOf($(that).attr("name"))].show=true;
        	 }else{
        		var dataSource=Cesium.CzmlDataSource.load(eval(data));
     	        viewerW.dataSources.add(dataSource);
     	        console.log( viewerW.dataSources) 
        	 }
    	}else{
    		 viewerW.dataSources._dataSources[arr.indexOf($(that).attr("name"))].show=false;
    	}
    }
    //控制单次加载
    LayerManagerObj.loadCzmlOneTime=function (that) {
        var arr=[];
        for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
          arr.push(viewerW.dataSources._dataSources[a].name)
         }
        if($(that).hasClass("active")){
            for(var a=0;a<arr.length;a++){
                if(arr.indexOf($(that).attr("name"))!=-1){
                    viewerW.dataSources._dataSources[arr.indexOf($(that).attr("name"))].show=true;
                }
            }
        }else{
            if(arr.indexOf($(that).attr("name"))!=-1){
                viewerW.dataSources._dataSources[arr.indexOf($(that).attr("name"))].show=false;
            }
        }

    }
    //控制是否拾取
    LayerManagerObj.pickUp= function(data){
        var pickObj="";
        if(data){
            var handler = new Cesium.ScreenSpaceEventHandler(viewerW.scene.canvas);
            handler.setInputAction(function(movement) {
                var pick = viewerW.scene.pick(movement.endPosition);
                if(pick && pick.id){//选中某模型
                    console.log(pick)
                    pickObj=pick;

                }
                else{

                }

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        return pickObj;
    }

    LayerManagerObj.loadPaichi=function(){
    	debugger;
    	 var arr=[];
         for(var a=0;a<viewerW.dataSources._dataSources.length;a++){
           if(viewerW.dataSources._dataSources[a].name!="gridLabels"){
        	   viewerW.dataSources.remove(viewerW.dataSources._dataSources[a])
        	   
           }
          }
    }
    //控制
    return LayerManagerObj;
}