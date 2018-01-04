/**
 * Created by ML-GIS on 2017/11/13.
 */
var hzjx=hzjx||{};
hzjx.layerManager=function(){
    this.viewer=null;
    this.scene=null;
    this.HashLyr=new Object();
    this.SelectedLyr=null;
    this.SelectedEntities=null;
    this.HashDatasource=new Object();
    this.primitiveCollections=new Object();
    this.moveHandlers=new Object();
    this.stripeMaterial = new Cesium.StripeMaterialProperty({
        evenColor : Cesium.Color.WHITE.withAlpha(0.5),
        oddColor : Cesium.Color.BLUE.withAlpha(0.5),
        repeat : 5.0
    });
    this.reg=/(-?\d+)(\.\d+)?/g;
}
hzjx.layerManager.prototype.init=function (viewer) {
    this.viewer=viewer;
    this.scene=viewer.scene;
    this.HashLyr=new Object();
    this.SelectedLyr=null;
    this.SelectedEntities=null;
    this.HashDatasource=new Object();
    this.primitiveCollection=null;
    var self=this;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        var pick = viewer.scene.pick(movement.endPosition);
        if(pick && pick.id){//选中某模型
            for(key in self.moveHandlers){
                self.moveHandlers[key](pick.id);
            }
            pick.primitive._material.uniforms.color={blue:1,green:1,red:1}
        }
        else{

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}
hzjx.layerManager.prototype.loadCzml=function(name,url){
    if(this.HashLyr[name]){
        this.setLayerVisible(this.HashLyr[name],true);
    }else {
        var dataSource=Cesium.CzmlDataSource.loadUrl(url);
        this.viewer.dataSources.add(dataSource);
        this.viewer.flyTo(dataSource);
        this.HashLyr[name]=dataSource;
    }
    this.SelectLyr=this.HashLyr[name];
}
hzjx.layerManager.prototype.createPrimitives=function(){
    
}
hzjx.layerManager.prototype.createEntityDatasource=function(name,data){
    if(!this.HashDatasource[name]){
        this.HashDatasource[name]=new hzjx.jxDataSource(name);
        this.viewer.dataSources.add( this.HashDatasource[name]);
    }else{
        this.HashDatasource[name].entities.removeAll();
    }
    if(!data[0].xs){
        this.createPoints(this.HashDatasource[name],data);
    }else{
        if(data[0].xs.indexOf("POINTZ")>-1){
            this.createPoints(this.HashDatasource[name],data);
        }else if(data[0].xs.indexOf("LINE")>-1){
            this.createLines(this.HashDatasource[name],data);
        }else if(data[0].xs.indexOf("POLYGON")>-1){
            this.createPolygons(this.HashDatasource[name],data);
        }
    }
}
hzjx.layerManager.prototype.createPoints=function (lyr,data) {
    for(var i=0;i<data.length;i++) {
        if (data[i].xs) {
            lyr.entities.add(this.createPoint(data[i].xs));
        }else{
            lyr.entities.add(this.createPoint(data[i].x+","+data[i].y));
        }
    }
    
}
hzjx.layerManager.prototype.createPointByD3=function(x,y,z){
    var entity={
        position :new Cesium.Cartesian3(x,y,z),
        billboard : {
            image : '../img/21.gif'
        }
    }
    return entity;
}
hzjx.layerManager.prototype.createPoint=function (xx) {
    debugger;
    var xys=xx.match(this.reg);
    var doublexys=[];
    for(var i=0;i<xys.length;i++)
    {
        doublexys.push(parseFloat(xys[i]));
    }
    var entity={
        position : Cesium.Cartesian3.fromDegrees(doublexys[0],doublexys[1],30),
        billboard : {
            image : '../img/21.gif'
        }
    }
    return entity;
}
hzjx.layerManager.prototype.createPolygons=function (lyr,data) {

    for(var i=0;i<data.length;i++) {
        if (data[i].xs) {
            lyr.entities.add(this.createPolygon(data[i].xs));
        }
    }
}
hzjx.layerManager.prototype.createPolygon=function (xx){

    var xys=xx.match(this.reg);
    var doublexys=[];
    var carts=[],cart=new Object();
    for(var i=0;i<xys.length;i++)
    {
        doublexys.push(parseFloat(xys[i]));
        if((i+1)%3==1){
            cart["x"]=parseFloat(xys[i]);
        }else if((i+1)%3==2){
            cart["y"]=parseFloat(xys[i]);
        }else if((i+1)%3==0){
            cart["z"]=parseFloat(xys[i]);
            carts.push(cart);
            cart=new Object();
        }
    }
    var entity={
        polygon : {
            hierarchy :Cesium.Cartesian3.fromDegreesArray(doublexys),//new Cesium.PolygonHierarchy(carts),// new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromRadiansArrayHeights(doublexys,Cesium.Ellipsoid.WGS84)),//new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(doublexys)),
            outline : true,
            outlineColor : Cesium.Color.RED,
            outlineWidth : 40,
            material : this.stripeMaterial
        }
    }
    return entity;
}
hzjx.layerManager.prototype.createLines=function (lyr,data) {
    for(var i=0;i<data.length;i++) {
        if (data[i].xs) {
            lyr.entities.add(this.createLine(data[i].xs));
        }
    }
}
hzjx.layerManager.prototype.createLine=function(xx){
    var xys=xx.match(this.reg);
    var doublexys=[];
    for(var i=0;i<xys.length;i++)
    {
        doublexys.push(parseFloat(xys[i]));
    }
    var entity = {
        polyline: {
            positions: doublexys,
            width: 10.0,
            material: new Cesium.PolylineGlowMaterialProperty({
                color: Cesium.Color.DEEPSKYBLUE,
                glowPower: 0.25
            })
        }
    }
    return entity;
}
hzjx.layerManager.prototype.createModel=function (lyr,data) {
    
}
hzjx.layerManager.prototype.loadGeoJson=function (name,url) {
    
}
hzjx.layerManager.prototype.activateLayer=function(name){
    
}
hzjx.layerManager.prototype.deactivateLayer=function (name) {
    
}
hzjx.layerManager.prototype.attachListener=function (name,event,callback) {
    if(event=="move"){
        this.moveHandlers[name]=callback;
    }
}
hzjx.layerManager.prototype.unListener=function (name,event) {
    
}
hzjx.layerManager.prototype.setLayerVisible=function (lyr,isShow) {
    lyr.show=isShow;
}
hzjx.layerManager.prototype.removeLayer=function (name) {
    if(this.HashLyr[name])
    {
        this.viewer.dataSources.remove(this.HashLyr[name],true);
        delete this.Hash[name];
    }
}
hzjx.layerManager.prototype.removeAll=function(){
    this.viewer.dataSources.removeALl(true);
    this.HashLyr=new Object();
    this.SelectedLyr=null;
    this.SelectedEntities=null;
    this.HashDatasource=new Object();
}
hzjx.layerManager.prototype.destroy=function (lyr) {

}
hzjx.layerManager.prototype.resizeIndex=function (name,index){

}