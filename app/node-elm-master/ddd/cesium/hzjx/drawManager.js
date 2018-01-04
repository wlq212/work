/**
 * Created by ML-GIS on 2017/11/10.
 */
/**
 * Created by ML-GIS on 2017/11/9.
 */
var hzjx=hzjx||{};

hzjx.DrawManager=function(){
    this.viewer=null,
        this.DrawPointHander=null,
        this.DrawLineHandler=null,
        this.DrawPolygonHandler=null,
        this.DrawModelHandler=null,
        this.geometries=[],
        this.activateHandler=null,
        this.drawModel=1;
        this.globparam=Cesium.Ellipsoid.WGS84.clone();
        this.callbackFun=null;
}
hzjx.DrawManager.prototype.init=function(viewer){
    if(!viewer.scene.pickPositionSupported){
        alert('不支持深度拾取,无法进行鼠标交互绘制！');
        return;
    }
    this.viewer=viewer;
    var self=this;
    this.DrawPointHander=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Point);
    this.DrawLineHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
    this.DrawPolygonHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon);
    this.DrawModelHandler=new Cesium.DrawHandler(viewer,Cesium.DrawMode.Marker);
    this.DrawPointHander.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            self.viewer.enableCursorStyle = false;
            self.viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            self.viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawPointHander.movingEvt.addEventListener(function(windowPosition){
        // tooltip.showAt(windowPosition,'<p>点击绘制一个点</p>');
    });
    this.DrawPointHander.drawEvt.addEventListener(function(result){
        if(typeof self.callbackFun === "function") {
            var cartographic = Cesium.Cartographic.fromCartesian(result.object.position, Cesium.Ellipsoid.WGS84);// this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            var height=cartographic.height;
            self.callbackFun(longitudeString, latitudeString, self.cartesian2lonlat([result.object.position]), height);
            console.log(result.object.position);
        }
    });
    this.DrawLineHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            self.viewer.enableCursorStyle = false;
            self.viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            self.viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawLineHandler.movingEvt.addEventListener(function(windowPosition){
        if(self.DrawLineHandler.isDrawing){

            // tooltip.showAt(windowPosition,'<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>');
        }
        else{
            // tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
        }

    });
    this.DrawLineHandler.drawEvt.addEventListener(function(result){
        // tooltip.setVisible(false);
        if(typeof self.callbackFun === "function")
            self.callbackFun(0,0,self.cartesian2lonlat(result.object.positions),0);
    });
    this.DrawPolygonHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            self.viewer.enableCursorStyle = false;
            self.viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            self.viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawPolygonHandler.movingEvt.addEventListener(function(windowPosition){
        if(self.DrawPolygonHandler.isDrawing){

        }
        else{
            // tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
        }
    });
    this.DrawPolygonHandler.drawEvt.addEventListener(function(result){
        // tooltip.setVisible(false);
        if(typeof self.callbackFun === "function")
            self.callbackFun(0,0,self.cartesian2lonlat(result.object.positions),0);


    });

    this.DrawModelHandler.activeEvt.addEventListener(function(isActive){
        if(isActive == true){
            self.viewer.enableCursorStyle = false;
            self.viewer._element.style.cursor = '';
            $('body').removeClass('drawCur').addClass('drawCur');
        }
        else{
            self.viewer.enableCursorStyle = true;
            $('body').removeClass('drawCur');
        }
    });
    this.DrawModelHandler.movingEvt.addEventListener(function(windowPosition){

    });
    this.DrawModelHandler.drawEvt.addEventListener(function(result){
        if(typeof self.callbackFun === "function")
            this.callbackFun(0,0,result.object.positions,0);
    });

}

hzjx.DrawManager.prototype.activate=function(code,callback){
    if(!this.viewer.scene.pickPositionSupported){
        alert('不支持深度拾取,无法进行鼠标交互绘制！');
        return;
    }
    this.clear();
    this.deactivate();
    if(typeof callback === "function")
        this.callbackFun=callback;
    else{
        this.callbackFun=null;
        console.log("未设置回调函数！");
    }
    this.drawModel=code;
    switch (code){
        case "1":
            this.DrawPointHander.activate();
            break;
        case "2":
            this.DrawLineHandler.activate();
            break;
        case "3":
            this.DrawPolygonHandler.activate();
            break;
        case "4":
            this.DrawModelHandler.activate();
            break;
        default:
            this.DrawPointHander.activate();
            break;
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
hzjx.DrawManager.prototype.cartesian2lonlat=function(coords){
    var xys=[];
    var WKT="";
    for(var i=0;i<coords.length;i++) {
        var cartesian =coords[i];// this.viewer.camera.pickEllipsoid(coords[i], this.viewer.scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.globparam);// this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            var xyz="";
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            xyz=longitudeString+" "+latitudeString;
            if(this.drawModel=="1"){
                xyz+=" "+Cesium.Math.toDegrees(cartographic.height);
            }
            xys.push(xyz);
        }
    }
    if(this.drawModel=="1"){
        WKT="POINT("+xys.toString()+")";
    }else if(this.drawModel=="2"){
        WKT="LINESTRING("+xys.toString()+")";
    }else if(this.drawModel=="3"){
        WKT="POLYGON("+xys.toString()+")";
    }
    return WKT;// xys.toString();
}

/*屏幕坐标转经纬度
var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
if (cartesian) {
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

    entity.position = cartesian;
    entity.label.show = true;
    entity.label.text =
        'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
} else {
    entity.label.show = false;
}*/
