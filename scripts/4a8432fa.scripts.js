"use strict";function Gauge(a,b){this.element=a;var c=this;this.configure=function(a){this.config=a,this.config.size=.9*this.config.size,this.config.raduis=.97*this.config.size/2,this.config.cx=this.config.size/2,this.config.cy=this.config.size/2,this.config.min=void 0!=a.min?a.min:0,this.config.max=void 0!=a.max?a.max:100,this.config.range=this.config.max-this.config.min,this.config.majorTicks=a.majorTicks||5,this.config.minorTicks=a.minorTicks||2,this.config.greenColor=a.greenColor||"#109618",this.config.yellowColor=a.yellowColor||"#FF9900",this.config.redColor=a.redColor||"#DC3912",this.config.transitionDuration=a.transitionDuration||500},this.render=function(){this.body=d3.select(this.element).append("svg:svg").attr("class","gauge").attr("width",this.config.size).attr("height",this.config.size),this.body.append("svg:circle").attr("cx",this.config.cx).attr("cy",this.config.cy).attr("r",this.config.raduis).style("fill","#ccc").style("stroke","#000").style("stroke-width","0.5px"),this.body.append("svg:circle").attr("cx",this.config.cx).attr("cy",this.config.cy).attr("r",.9*this.config.raduis).style("fill","#fff").style("stroke","#e0e0e0").style("stroke-width","2px");for(var a in this.config.greenZones)this.drawBand(this.config.greenZones[a].from,this.config.greenZones[a].to,c.config.greenColor);for(var a in this.config.yellowZones)this.drawBand(this.config.yellowZones[a].from,this.config.yellowZones[a].to,c.config.yellowColor);for(var a in this.config.redZones)this.drawBand(this.config.redZones[a].from,this.config.redZones[a].to,c.config.redColor);if(void 0!=this.config.label){var b=Math.round(this.config.size/9);this.body.append("svg:text").attr("x",this.config.cx).attr("y",this.config.cy/2+b/2).attr("dy",b/2).attr("text-anchor","middle").text(this.config.label).style("font-size",b+"px").style("fill","#333").style("stroke-width","0px")}for(var b=Math.round(this.config.size/16),d=this.config.range/(this.config.majorTicks-1),e=this.config.min;e<=this.config.max;e+=d){for(var f=d/this.config.minorTicks,g=e+f;g<Math.min(e+d,this.config.max);g+=f){var h=this.valueToPoint(g,.75),i=this.valueToPoint(g,.85);this.body.append("svg:line").attr("x1",h.x).attr("y1",h.y).attr("x2",i.x).attr("y2",i.y).style("stroke","#666").style("stroke-width","1px")}var h=this.valueToPoint(e,.7),i=this.valueToPoint(e,.85);if(this.body.append("svg:line").attr("x1",h.x).attr("y1",h.y).attr("x2",i.x).attr("y2",i.y).style("stroke","#333").style("stroke-width","2px"),e==this.config.min||e==this.config.max){var j=this.valueToPoint(e,.63);this.body.append("svg:text").attr("x",j.x).attr("y",j.y).attr("dy",b/3).attr("text-anchor",e==this.config.min?"start":"end").text(e).style("font-size",b+"px").style("fill","#333").style("stroke-width","0px")}}var k=this.body.append("svg:g").attr("class","pointerContainer"),l=(this.config.min+this.config.max)/2,m=this.buildPointerPath(l),n=d3.svg.line().x(function(a){return a.x}).y(function(a){return a.y}).interpolate("basis");k.selectAll("path").data([m]).enter().append("svg:path").attr("d",n).style("fill","#dc3912").style("stroke","#c63310").style("fill-opacity",.7),k.append("svg:circle").attr("cx",this.config.cx).attr("cy",this.config.cy).attr("r",.12*this.config.raduis).style("fill","#4684EE").style("stroke","#666").style("opacity",1);var b=Math.round(this.config.size/10);k.selectAll("text").data([l]).enter().append("svg:text").attr("x",this.config.cx).attr("y",this.config.size-this.config.cy/4-b).attr("dy",b/2).attr("text-anchor","middle").style("font-size",b+"px").style("fill","#000").style("stroke-width","0px"),this.redraw(this.config.min,0)},this.buildPointerPath=function(a){function b(a,b){var d=c.valueToPoint(a,b);return d.x-=c.config.cx,d.y-=c.config.cy,d}var d=this.config.range/13,e=b(a,.85),f=b(a-d,.12),g=b(a+d,.12),h=a-this.config.range*(1/.75)/2,i=b(h,.28),j=b(h-d,.12),k=b(h+d,.12);return[e,f,k,i,j,g,e]},this.drawBand=function(a,b,d){0>=b-a||this.body.append("svg:path").style("fill",d).attr("d",d3.svg.arc().startAngle(this.valueToRadians(a)).endAngle(this.valueToRadians(b)).innerRadius(.65*this.config.raduis).outerRadius(.85*this.config.raduis)).attr("transform",function(){return"translate("+c.config.cx+", "+c.config.cy+") rotate(270)"})},this.redraw=function(a,b){var d=this.body.select(".pointerContainer");d.selectAll("text").text(Math.round(a));var e=d.selectAll("path");e.transition().duration(void 0!=b?b:this.config.transitionDuration).attrTween("transform",function(){var b=a;a>c.config.max?b=c.config.max+.02*c.config.range:a<c.config.min&&(b=c.config.min-.02*c.config.range);var d=c.valueToDegrees(b)-90,e=c._currentRotation||d;return c._currentRotation=d,function(a){var b=e+(d-e)*a;return"translate("+c.config.cx+", "+c.config.cy+") rotate("+b+")"}})},this.valueToDegrees=function(a){return a/this.config.range*270-(this.config.min/this.config.range*270+45)},this.valueToRadians=function(a){return this.valueToDegrees(a)*Math.PI/180},this.valueToPoint=function(a,b){return{x:this.config.cx-this.config.raduis*b*Math.cos(this.valueToRadians(a)),y:this.config.cy-this.config.raduis*b*Math.sin(this.valueToRadians(a))}},this.configure(b)}angular.module("ui.dashboard.widgets",["ngGrid"]),angular.module("app",["ngRoute","ngCookies","ngResource","ngSanitize","ui.dashboard","ui.dashboard.widgets"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("ui.dashboard.widgets").directive("time",["$interval",function(a){return{restrict:"A",replace:!0,templateUrl:"scripts/widgets/time/time.html",link:function(b){function c(){b.time=(new Date).toLocaleTimeString()}var d=a(c,500);b.$on("$destroy",function(){a.cancel(d)})}}}]),angular.module("ui.dashboard.widgets").directive("random",["$interval",function(a){return{restrict:"A",replace:!0,templateUrl:"scripts/widgets/random/random.html",link:function(b){function c(){b.number=Math.floor(100*Math.random())}var d=a(c,500);b.$on("$destroy",function(){a.cancel(d)})}}}]),angular.module("ui.dashboard.widgets").directive("scopeWatch",function(){return{restrict:"A",replace:!0,templateUrl:"scripts/widgets/scopeWatch/scopeWatch.html",scope:{scopeValue:"=value"}}}),angular.module("ui.dashboard.widgets").directive("topN",function(){return{restrict:"A",replace:!0,templateUrl:"scripts/widgets/topN/topN.html",scope:{data:"="},controller:["$scope",function(a){a.gridOptions={data:"items",enableRowSelection:!1,enableColumnResize:!1,columnDefs:[{field:"name",displayName:"Name"},{field:"value",displayName:"Value"}]}}],link:function(a){a.$watch("data",function(b){b&&(a.items=_.sortBy(b,function(a){return-a.value}))})}}}),angular.module("ui.dashboard.widgets").directive("gauge",function(){return{replace:!0,scope:{label:"@",min:"=",max:"=",value:"="},link:function(a,b,c){var d={size:200,label:c.label,min:void 0!==a.min?a.min:0,max:void 0!==a.max?a.max:100,minorTicks:5},e=d.max-d.min;d.yellowZones=[{from:d.min+.75*e,to:d.min+.9*e}],d.redZones=[{from:d.min+.9*e,to:d.max}],a.gauge=new Gauge(b[0],d),a.gauge.render(),a.gauge.redraw(a.value),a.$watch("value",function(){a.gauge&&a.gauge.redraw(a.value)})}}}),angular.module("ui.dashboard.widgets").directive("lineChart",function(){return{template:"<div></div>",scope:{chart:"="},replace:!0,link:function(a,b){function c(a){var b=a.data,c=new google.visualization.DataTable;c.addColumn("datetime"),c.addColumn("number"),c.addRows(b.length);for(var e=new google.visualization.DataView(c),f=0;f<b.length;f++){var g=b[f];c.setCell(f,0,new Date(g.timestamp));var h=parseFloat(g.value);c.setCell(f,1,h)}var i;if(b.length){var j=b[b.length-1];i=j.timestamp}else i=Date.now();var k=new Date(i),l=new Date(i-1e3*(a.max-1)),m={legend:"none",vAxis:{minValue:0,maxValue:100},hAxis:{viewWindow:{min:l,max:k}}};d.draw(e,m)}console.log("link");var d=new google.visualization.LineChart(b[0]);a.$watch("chart",function(a){a&&a.data&&a.max&&c(a)})}}}),angular.module("app").controller("MainCtrl",["$scope","$interval",function(a,b){function c(){return h+=40*Math.random()-20,h=0>h?0:h>100?100:h}var d=[{name:"time",style:{width:"33%"}},{name:"random",style:{width:"33%"}},{name:"scope-watch",attrs:{value:"randomValue"},style:{width:"34%"}},{name:"top-n",attrs:{data:"topTen"},style:{width:"40%"}},{name:"gauge",attrs:{value:"percentage"},style:{width:"250px"}},{name:"progressbar",attrs:{"class":"progress-striped",type:"success",value:"percentage"},style:{width:"30%"}},{name:"progressbar2",template:'<div progressbar class="progress-striped" type="info" value="percentage">{{percentage}}%</div>',style:{width:"30%"}},{name:"line-chart",attrs:{chart:"chart"},style:{width:"50%"}}],e=_.clone(d);a.dashboardOptions={widgetButtons:!0,widgetDefinitions:d,defaultWidgets:e},b(function(){a.randomValue=Math.random()},500),b(function(){var b=_.map(_.range(1,11),function(a){return{name:"item"+a,value:Math.floor(100*Math.random())}});a.topTen=b},1e3),a.percentage=5,b(function(){a.percentage=(a.percentage+10)%100},1e3);for(var f=30,g=[],h=50,i=Date.now(),j=f-1;j>=0;j--)g.push({timestamp:i-1e3*j,value:c()});a.chart={data:g,max:f},b(function(){g.shift(),g.push({timestamp:Date.now(),value:c()}),a.chart={data:g,max:f}},1e3),a.addWidget=function(b){a.dashboardOptions.addWidget({name:b})},a.addWidgetScopeWatch=function(){a.dashboardOptions.addWidget({name:"scope-watch",attrs:{value:"randomValue"}})}}]);