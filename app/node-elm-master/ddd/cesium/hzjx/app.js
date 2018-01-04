/**
 * Created by ML-GIS on 2017/11/9.
 */
var hzjx=hzjx||{};

hzjx.DrawManager={
    DrawPointHander:null,
    DrawLineHandler:null,
    DrawPolygonHandler:null,
    DrawModelHandler:null,
    geometries:[],
    activateHandler:null,
    callbackFun:null
}
hzjx.DrawManager.prototype.init=function(viewer){
    if(!viewer.scene.pickPositionSupported){
        alert('不支持深度拾取,无法进行鼠标交互绘制！');
        return;
    }
    this.DrawPointHander=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Point);
    this.DrawLineHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
    this.DrawPolygonHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,clampMode);
    this.DrawModelHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Marker);
    this.DrawPointHander.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawPointHander.movingEvt.addEventListener(function(windowPosition){
        // tooltip.showAt(windowPosition,'<p>点击绘制一个点</p>');
    });
    this.DrawPointHander.drawEvt.addEventListener(function(result){
        // tooltip.setVisible(false);
        if(typeof callback === "function")
            this.callbackFun=callback;
        DrawObj.handlerPointArr.push(result.object.position);

    });
    this.DrawLineHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawLineHandler.movingEvt.addEventListener(function(windowPosition){
        if(this.DrawLineHandler.isDrawing){

            // tooltip.showAt(windowPosition,'<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>');
        }
        else{
            // tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
        }

    });
    this.DrawLineHandler.drawEvt.addEventListener(function(result){
        // tooltip.setVisible(false);
        if(typeof callback === "function")
            this.callbackFun=callback;
        DrawObj.handlerLineArr.push(result.object.positions);
    });

    this.DrawPolygonHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawPolygonHandler.movingEvt.addEventListener(function(windowPosition){
        if(this.DrawPolygonHandler.isDrawing){

        }
        else{
            // tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
        }
    });
    this.DrawPolygonHandler.drawEvt.addEventListener(function(result){
        // tooltip.setVisible(false);
        if(typeof callback === "function")
            this.callbackFun=callback;
        DrawObj.handlerPolygonArr.push(result.object.positions);

    });

    this.DrawModelHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawModelHandler.movingEvt.addEventListener(function(windowPosition){

    });
    this.DrawModelHandler.drawEvt.addEventListener(function(result){
        if(typeof callback === "function")
            this.callbackFun=callback;
    });

}

hzjx.DrawManager.prototype.activate=function(code,callback){
    if(!viewer.scene.pickPositionSupported){
        alert('不支持深度拾取,无法进行鼠标交互绘制！');
        return;
    }
    if(typeof callback === "function")
        this.callbackFun=callback;
    else{
        this.callbackFun=null;
        console.log("未设置回调函数！");
    }


}
hzjx.DrawManager.prototype.deactivate=function(){
    this.DrawPointHander.deactivate();
    this.DrawLineHandler.deactivate();
    this.DrawPolygonHandler.deactivate();
    this.DrawModelHandler.deactivate();
}
hzjx.DrawManager.prototype.clear=function(){
    this.DrawPointHander.clear();
    this.DrawLineHandler.clear();
    this.DrawPolygonHandler.clear();
    this.DrawModelHandler.clear();
}