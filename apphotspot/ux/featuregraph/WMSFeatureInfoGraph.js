/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
// Example usage:
//
//    var config = Ext.apply({
//
//         tools: [{
//             ptype: "gxp_wmsfeatureinfograph",
//             // uncomment the line below if you want feature info in a grid
//             format: "grid",
//             actionTarget: "main.tbar",
//             outputConfig: {xtype: "panel", width: 400, height: 200,
//region :"east"},
//             outputTarget: "eastpanel"
//         }],

/**
 * @requires plugins/Tool.js
 */
/** api: (define)
 *  module = gxp.plugins
 *  class = WMSFeatureInfoGraph
 */
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");
// Ext.chart.Chart.CHART_URL = '../static/script/charts.swf';
/** api: constructor
 *  .. class:: WMSFeatureInfoGraph(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    FeatureInfoGraph request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */
gxp.plugins.WMSFeatureInfoGraph = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_wmsfeatureinfograph */
    ptype: "gxp_wmsfeatureinfograph",

    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Get Feature Info",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Feature Info",

    /** api: config[format]
     *  ``String`` Either "html" or "grid". If set to "grid", GML will be
     *  requested from the server and displayed in an Ext.PropertyGrid.
     *  Otherwise, the html output from the server will be displayed as-is.
     *  Default is "html".
     */
    format: "html",

    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */

    /** api: config[layerParams]
     *  ``Array`` List of param names that should be taken from the layer and
     *  added to the FeatureInfoGraph request (e.g. ["CQL_FILTER"]).
     */

    /** api: config[itemConfig]
     *  ``Object`` A configuration object overriding options for the items that
     *  get added to the popup for each server response or feature. By default,
     *  each item will be configured with the following options:
     *
     *  .. code-block:: javascript
     *
     *      xtype: "propertygrid", // only for "grid" format
     *      title: feature.fid ? feature.fid : title, // just title for "html" format
     *      source: feature.attributes, // only for "grid" format
     *      html: text, // responseText from server - only for "html" format
     */

    /** api: method[addActions]
     */
    addActions: function () {
        this.popupCache = {};

        var actions = gxp.plugins.WMSFeatureInfoGraph.superclass.addActions.call(this, [
            {
                tooltip: this.infoActionTip,
                iconCls: "gxp-icon-getfeatureinfo",
                toggleGroup: this.toggleGroup,
                enableToggle: false,
                allowDepress: true,
                pressed: true,
                toggleHandler: function (button, pressed) {
                    for (var i = 0, len = info.controls.length; i < len; i++) {
                        if (pressed) {
                            info.controls[i].activate();
                        } else {
                            info.controls[i].deactivate();
                        }
                    }
                }
            }
        ]);
        var infoButton = this.actions[0].items[0];

        var info = {
            controls: []
        };
        var updateInfo = function () {
            var queryableLayers = this.target.mapPanel.layers.queryBy(function (x) {
                return x.get("queryable");
            });

            var map = this.target.mapPanel.map;
            var control;
            for (var i = 0, len = info.controls.length; i < len; i++) {
                control = info.controls[i];
                control.deactivate(); // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }
            info.controls = [];
            queryableLayers.each(function (x) {
                var layer = x.getLayer();
                var vendorParams = Ext.apply({}, this.vendorParams),
                    param;
                if (this.layerParams) {
                    for (var i = this.layerParams.length - 1; i >= 0; --i) {
                        param = this.layerParams[i].toUpperCase();
                        vendorParams[param] = layer.params[param];
                    }
                }
                var infoFormat = x.get("infoFormat");
                if (infoFormat === undefined) {
                    // TODO: check if chosen format exists in infoFormats array
                    // TODO: this will not work for WMS 1.3 (text/xml instead for GML)
                    infoFormat = this.format == "html" ? "text/html" : "application/vnd.ogc.gml";
                }

                var control = new OpenLayers.Control.WMSGetFeatureInfo(Ext.applyIf({
                    id: "grafiek",
                    url: layer.url,
                    queryVisible: true,
                    layers: [layer],
                    infoFormat: infoFormat,
                    vendorParams: vendorParams,
                    eventListeners: {
                        getfeatureinfo: function (evt) {
                            var title = x.get("title") || x.get("name");
                            var zoom = map.zoom;
                            if (infoFormat == "text/html") {
                                var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && !match[1].match(/^\s*$/)) {
                                    this.displayGraph(evt, title, match[1], zoom);
                                }
                            } else if (infoFormat == "text/plain") {
                                this.displayGraph(evt, title, '<pre>' + evt.text + '</pre>', zoom);
                            } else {
                                this.displayGraph(evt, title, null, zoom);
                            }
                        },
                        scope: this
                    }
                }, this.controlOptions));
                map.addControl(control);
                info.controls.push(control);
                if (infoButton.pressed) {
                    control.activate();
                }
            }, this);

        };

        this.target.mapPanel.layers.on("update", updateInfo, this);
        this.target.mapPanel.layers.on("add", updateInfo, this);
        this.target.mapPanel.layers.on("remove", updateInfo, this);

        return actions;
    },


    displayPopup: function (evt, title, text) {
        var popup;
        var popupKey = evt.xy.x + "." + evt.xy.y;

        if (!(popupKey in this.popupCache)) {
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: "accordion",
                location: evt.xy,
                map: this.target.mapPanel,
                width: 250,
                height: 300,
                defaults: {
                    layout: "fit",
                    autoScroll: true,
                    autoWidth: true,
                    collapsible: true
                },
                listeners: {
                    close: (function (key) {
                        return function (panel) {
                            delete this.popupCache[key];
                        };
                    })(popupKey),
                    scope: this
                }
            });
            this.popupCache[popupKey] = popup;
        } else {
            popup = this.popupCache[popupKey];
        }

        var features = evt.features,
            config = [];
        if (!text && features) {
            var feature;
            for (var i = 0, ii = features.length; i < ii; ++i) {
                feature = features[i];
                config.push(Ext.apply({
                    xtype: "propertygrid",
                    title: feature.fid ? feature.fid : title,
                    source: feature.attributes
                }, this.itemConfig));
            }
        } else if (text) {
            config.push(Ext.apply({
                title: title,
                html: text
            }, this.itemConfig));
        }
        popup.add(config);
        popup.doLayout();
    },


    /** private: method[displayGraph]
     * :arg evt: the event object from a
     *     :class:`OpenLayers.Control.FeatureInfoGraph` control
     * :arg title: a String to use for the title of the results section
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     */
    displayGraph: function (evt, title, text, zoom) {
        if (typeof markers === "undefined") {
            markers = new OpenLayers.Layer.Vector("Marker", {
                styleMap: new OpenLayers.StyleMap({
                    externalGraphic: "/static/marker.png",
                    graphicOpacity: 1.0,
                    graphicWidth: 20,
                    graphicHeight: 20,
                    graphicYOffset: -10
                })
            });
            this.target.mapPanel.map.addLayer(markers);
            markers.setVisibility(true);
        }

        var features = evt.features;
        var config = [];
        var data_defo = [];
        var data_defoest = [];
        var data_table = [];
        var fields = [
            {
                name: 'date',
                type: 'date'
            },
            'deformation',
            {
                name: 'unit',
                type: 'text'
            }
        ]; // used to be: }, ];
        var fields_table = ['property', 'value'];

        if (features.length == 0) return;

        var min_graph_range = 50; // will be rounded up to 60

        var minrange = 0;
        var maxrange = 0;

        // split the deformation timeseries and other attributes
        var layername = features[0].gml.featureType;
        data_table.push(["from layer", layername]);

        var attrib = features[0].attributes;
        for (var k in attrib) {
            if (k.substr(0, 5) == 'defo_') {
                var val = attrib[k];
                val *= 1000; // in mm
                data_defo.push([k.substr(5, 8), val, 'mm']);
                minrange = Math.min(val, minrange);
                maxrange = Math.max(val, maxrange);
            }
            else if (k.substr(0, 2) == 'd_') {
                var val = attrib[k];
                val *= 1000; // in mm
                data_defo.push([k.substr(2, 8), val, 'mm']);
                minrange = Math.min(val, minrange);
                maxrange = Math.max(val, maxrange);
            }
            else if (k.substr(0, 3) == 'de_') {
                var val = attrib[k];
                val *= 1000; // in mm
                data_defoest.push([k.substr(3, 8), val, 'mm']);
                minrange = Math.min(val, minrange);
                maxrange = Math.max(val, maxrange);
            }
            else {
                if (!isNaN(parseFloat(attrib[k])) && isFinite(attrib[k])) {
                    data_table.push([k, (attrib[k] * 1).toFixed(9)]);
                }
                else {
                    data_table.push([k, attrib[k]]);
                }
            }
        }

        var r = maxrange - minrange;
        var m = (maxrange + minrange) / 2;
        //m = Math.round(m/10)*10;
        r = Math.max(r, min_graph_range);
        minrange = Math.floor((m - r / 2) / 10) * 10;
        maxrange = Math.ceil((m + r / 2) / 10) * 10;

        Ext.Ajax.request({
            url: "/metadata/format_point/",
            method: "POST",
            params: JSON.stringify(data_table),
            success: function (response) {
                Ext.getCmp("layermetapanel").update(response.responseText);
            },
            failure: function (response, opts) {
                Ext.getCmp("layermetapanel").update('Failed to retrieve point metadata');
            },
            headers: { 'Content-Type': 'application/json' }
        });

        var newWindow = false;
        if (typeof this.chartWindow === "undefined") {
            var chartPanel = new Ext.Panel({
                html: "<div id='chartdiv' style='width:500px; height:300px;'></div>"
            });

            this.chartWindow = new Ext.Window({
                modal: false,
                closeAction: 'hide',
                layout: "fit",
                autoWidth: true,
                autoHeight: true,
                resizable: false,
                constrainHeader: true,
                items: [chartPanel]
            });
            newWindow = true;
        }
        this.chartWindow.setTitle('Deformation at (' + features[0].geometry.x + ', ' + features[0].geometry.y + ') ' + layername);
        this.chartWindow.show();
        if (newWindow) {
            this.chartWindow.alignTo('mappanelcontainer', 'br-br');
        }

        var chartData = this.generateChartData(data_defo, data_defoest);
        this.createChart(chartData, minrange, maxrange, 'chartdiv');

        // prepare data for clipboard
        clipboardText = this.renderChartClipboardText(data_table, data_defo);

        // add "Copy" button
        var copyButton = document.createElement("img");
        copyButton.id = "clip_button";
        copyButton.src = "data:image/png;base64," +
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEUAAABHgsz4+PiMv/TO4PcEvSTP" +
            "AAAAAXRSTlMAQObYZgAAAD9JREFUCNd9ycENACAIQ1HYgCYuAE5g2H83ISUe7al5XxQw6WkEeHYuo3jH" +
            "llORwkjBSPpI+F8ASt0SnieoyQW1SwpC+Si7+wAAAABJRU5ErkJggg==";
        copyButton.title = "Copy";
        var chartDiv = document.getElementById('chartdiv');
        chartDiv.appendChild(copyButton);

        ZeroClipboard.config({ forceHandCursor: true });
        var cbCopy = new ZeroClipboard(copyButton);
        cbCopy.on('copy', function (e) {
            e.clipboardData.setData('text/plain', clipboardText);
        });

        // add click marker to "markers" layer
        var point = new OpenLayers.Geometry.Point(features[0].geometry.x, features[0].geometry.y);
        var proj = new OpenLayers.Projection("EPSG:4326");
        point.transform(proj, this.target.mapPanel.map.getProjectionObject());

        var iconFeature = new OpenLayers.Feature.Vector(point);
        iconFeature.id = "some ID";

        markers.removeAllFeatures();
        markers.addFeatures(iconFeature);
    },
    generateChartData: function (data, data2) {
        var chartData = [];
        for (var i = 0; i < data.length; i++) {
            var dateString = data[i][0].substring(0, 4) + '/' + data[i][0].substring(4, 6) + '/' + data[i][0].substring(6, 8);
            var date = new Date(dateString);
            if (data.length == data2.length) {
                chartData.push({
                    date: date,
                    deformation: data[i][1].toFixed(1),
                    defo_est: data2[i][1].toFixed(1),
                    unit: data[i][2]
                });
            } else {
                chartData.push({
                    date: date,
                    deformation: data[i][1].toFixed(1),
                    unit: data[i][2]
                });
            }
        }
        return chartData;
    },
    renderChartClipboardText: function (properties, data) {
        function get(props, name, mult, precision) {
            for (var i = 0; i < props.length; i++) {
                if (props[i][0] == name) {
                    var val = props[i][1];
                    if (!val)
                        return "?";
                    if (mult)
                        val *= mult;
                    return precision ? val.toFixed(precision) : val;
                }
            }
            return "?";
        }

        var clipboardText = "";
        clipboardText += "Point " + get(properties, "pnt_id") + " from layer " + get(properties, "from layer") + "\n";
        clipboardText += "Linear\t" + get(properties, "pnt_linear", 1000, 1) + "\tmm/yr\n";
        clipboardText += "Height\t" + get(properties, "pnt_height", 1, 1) + "\tm\n";
        clipboardText += "Quality\t" + get(properties, "pnt_quality", 1, 2) + "\n\n";

        clipboardText += "Date\tDeformation (mm)\n";
        for (var i = 0; i < data.length; i++) {
            var dateString = data[i][0].substring(0, 4) + '/' + data[i][0].substring(4, 6) + '/' + data[i][0].substring(6, 8);
            clipboardText += dateString + "\t" + data[i][1].toFixed(1) + "\n";
        }
        return clipboardText;
    },
    createChart: function (chartData, minrange, maxrange, targetContainerId) {
        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "../static/script/amcharts/images/";
        chart.panEventsEnabled = true;
        chart.zoomOutButton = {
            backgroundColor: "#000000",
            backgroundAlpha: 0.15
        };
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.marginTop = 15;
        chart.marginLeft = 5;
        chart.marginRight = 5;
        chart.marginBottom = 15;
        chart.plotAreaBorderColor = "#DADADA";
        chart.plotAreaBorderAlpha = 1;

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.dashLength = 2;
        categoryAxis.gridAlpha = 0.15;
        categoryAxis.axisColor = "#DADADA";

        // value axis (on the left)
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.axisThickness = 1;
        valueAxis.gridAlpha = 0.15;
        valueAxis.minimum = minrange;
        valueAxis.maximum = maxrange;
        valueAxis.title = "Deformation [mm]";
        chart.addValueAxis(valueAxis);

        // GRAPHS
        var pcol = "#143ECC";
        var palpha = 1;
        if ('defo_est' in chartData[0]) {
            var graph = new AmCharts.AmGraph();
            graph.valueAxis = valueAxis; // we have to indicate which value axis should be used
            graph.title = "defo estimate";
            graph.valueField = "defo_est";
            //graph.bullet = "round";
            graph.lineColor = pcol;
            pcol = "#222222";
            palpha = 0.4;
            graph.lineAlpha = 1;
            graph.lineThickness = 2;
            graph.balloonText = "[[defo_est]] [[unit]]";
            chart.addGraph(graph);
        }

        var graph = new AmCharts.AmGraph();
        graph.valueAxis = valueAxis; // we have to indicate which value axis should be used
        graph.title = "deformation";
        graph.valueField = "deformation";
        graph.bullet = "round";
        graph.bulletSize = 6;
        graph.bulletAlpha = palpha;
        graph.lineColor = pcol;
        graph.lineAlpha = 0;
        graph.balloonText = "[[deformation]] [[unit]]";
        chart.addGraph(graph);

        // GUIDE for reference
        var guide = new AmCharts.Guide();
        guide.value = 0;
        guide.lineColor = "#CC0000";
        //guide.dashLength = 4;
        guide.inside = true;
        guide.lineAlpha = 1;
        guide.lineThickness = 1;
        valueAxis.addGuide(guide);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        //var chartScrollbar = new AmCharts.ChartScrollbar();
        //chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        //var legend = new AmCharts.AmLegend();
        //legend.marginLeft = 110;
        //chart.addLegend(legend);

        document.getElementById(targetContainerId).innerHTML = '';
        chart.write(targetContainerId);
    }
});

Ext.preg(gxp.plugins.WMSFeatureInfoGraph.prototype.ptype, gxp.plugins.WMSFeatureInfoGraph);


// see http://stackoverflow.com/a/17528590
var clipboardText = "";

function bindEvent(el, eventName, eventHandler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, false);
    }
    else if (el.attachEvent) {
        el.attachEvent('on' + eventName, eventHandler);
    }
}

bindEvent(document, "keydown", function (e) {
    if (!clipboardText || !(e.ctrlKey || e.metaKey)) {
        return;
    }

    if ((e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") && e.target.style.display != "none") {
        return;
    }

    var _ref;
    if (typeof window.getSelection === "function" && (_ref = window.getSelection()) != null && _ref.toString()) {
        return;
    }

    if ((_ref = document.selection) != null && _ref.createRange().text) {
        return;
    }

    var cbContainer = document.getElementById("clipboard-container");
    cbContainer.innerHTML = "";
    cbContainer.style.display = "block";

    var clipboard = document.createElement("textarea");
    clipboard.id = "clipboard";
    clipboard.value = clipboardText;

    cbContainer.appendChild(clipboard);

    clipboard.focus();
    clipboard.select();
});

bindEvent(document, "keyup", function (e) {
    if (e.target.id == "clipboard") {
        var cbContainer = document.getElementById("clipboard-container");
        cbContainer.innerHTML = "";
        cbContainer.style.display = "none";
    }
});

var css = '#clipboard-container { position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 100; display: none; opacity: 0; } ' +
        '#clipboard { width: 1px; height: 1px; padding: 0px; } ' +
        '#chartdiv { position: relative; } ' +
        '#clip_button { position: absolute; top: 8px; left: 8px; width: 16px; height: 16px; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
}
else {
    style.appendChild(document.createTextNode(css));
}

head.appendChild(style);

bindEvent(window, "load", function () {
    var cbContainer = document.createElement("div");
    cbContainer.id = "clipboard-container";
    document.body.appendChild(cbContainer);
});
