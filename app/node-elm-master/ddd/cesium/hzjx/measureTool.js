
/**
 * Created by ML-GIS on 2017/11/13.
 */
var hzjx=hzjx||{};

hzjx.measureTool=function(){
    this.measureDistanceHandler=null;
    this.measureAreaHandler=null;
    this.measureHeightHandler=null;
}

hzjx.measureTool.prototype.init=function(viewer){
    var self=this;
    this.measureDistanceHandler= new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Distance,0);
//注册测距功能事件
    this.measureDistanceHandler.measureEvt.addEventListener(function(result){
        var distance = result.distance > 1000 ? (result.distance/1000) + 'km' : result.distance + 'm';
        self.measureDistanceHandler.disLabel.text = '距离:' + distance;
        self.measureDistanceHandler.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
        self.measureDistanceHandler.disLabel.font='100 20px sans-serif';
        self.measureDistanceHandler.disLabel.outlineWidth=0.3;
    });
    this.measureDistanceHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('measureCur').addClass('measureCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('measureCur');
        }
    });

//初始化测量面积
    this.measureAreaHandler = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Area,0);
    this.measureAreaHandler.measureEvt.addEventListener(function(result){
        var area = result.area > 1000000 ? result.area/1000000 + 'km²' : result.area + '㎡'
        self.measureAreaHandler.areaLabel.text = '面积:' + area;
        self.measureAreaHandler.areaLabel.outlineColor = new Cesium.Color(0, 0, 1);
        self.measureAreaHandler.areaLabel.font='100 20px sans-serif';
        self.measureAreaHandler.areaLabel.outlineWidth=0.3;
    });
    this.measureAreaHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('measureCur').addClass('measureCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('measureCur');
        }
    });

//初始化测量高度
    this.measureHeightHandler = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.DVH);
    this.measureHeightHandler.measureEvt.addEventListener(function(result){
        var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
        var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight/1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
        var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance/1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
        self.measureHeightHandler.disLabel.text = '空间距离:' + distance;
        self.measureHeightHandler.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
        self.measureHeightHandler.disLabel.font='100 20px sans-serif';
        self.measureHeightHandler.disLabel.outlineWidth=0.3;
        self.measureHeightHandler.vLabel.text = '垂直高度:' + vHeight;
        self.measureHeightHandler.vLabel.outlineColor = new Cesium.Color(0, 0, 1);
        self.measureHeightHandler.vLabel.font='100 20px sans-serif';
        self.measureHeightHandler.vLabel.outlineWidth=0.3;
        self.measureHeightHandler.hLabel.text = '水平距离:' + hDistance;
        self.measureHeightHandler.hLabel.outlineColor = new Cesium.Color(0, 0, 1);
        self.measureHeightHandler.hLabel.font='100 20px sans-serif';
        self.measureHeightHandler.hLabel.outlineWidth=0.3;
    });
    this.measureHeightHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = '';
            $('body').removeClass('measureCur').addClass('measureCur');
        }
        else{
            viewer.enableCursorStyle = true;
            $('body').removeClass('measureCur');
        }
    });
}
hzjx.measureTool.prototype.active=function(code,clampMode){
    clampMode=isNaN(clampMode)>0?clampMode:0
    this.deactivate();
    switch(code){
        case Cesium.MeasureMode.Distance:
            this.measureDistanceHandler.clampMode=clampMode;
            this.measureDistanceHandler.activate();
            break;
        case Cesium.MeasureMode.Area:
            this.measureAreaHandler.clampMode=clampMode;
            this.measureAreaHandler.activate();
            break;
        case Cesium.MeasureMode.DVH:
            this.measureHeightHandler.activate();
            break;
        default:
            this.measureDistanceHandler.activate();
            break;
    }
}
hzjx.measureTool.prototype.deactivate=function(){
    this.measureDistanceHandler.deactivate();
    this.measureAreaHandler.deactivate();
    this.measureHeightHandler.deactivate();

}
hzjx.measureTool.prototype.clear=function(){
    this.measureDistanceHandler.clear();
    this.measureAreaHandler.clear();
    this.measureHeightHandler.clear();
}