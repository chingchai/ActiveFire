/* Hotspot fire app
 * Mr Chingchai Humhong
 * Assoc Prof Dr Chada Narongrit
 * 16/01/2017
 * chada@nu.ac.th, chingchai.h@gmail.com, chingchaih@nu.ac.th
 * GISTNU @ Naresuan University
 * MIT@License
 * github : https://github.com/chingchai/ActiveFire
 */
Ext.namespace("Heron.options");
Ext.namespace("Heron.scratch");
Ext.namespace("Heron.examples");
OpenLayers.Util.onImageLoadErrorColor = "transparent";
//OpenLayers.ProxyHost = "resources/proxy.php?url=";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
Ext.BLANK_IMAGE_URL = 'http://cdnjs.cloudflare.com/ajax/libs/extjs/3.4.1-1/resources/images/default/s.gif';

Ext.namespace("Heron.options.map");

Heron.options.map.settings = {
  projection: 'EPSG:3857',
  displayProjection: new OpenLayers.Projection("EPSG:4326"),
	units: 'm',
	maxExtent: '-20037508.34, -20037508.34, 20037508.34, 20037508.34',
  center: '11141190.727,1458223.243',
  maxResolution: '156543.0339',//'0.17578125',
  xy_precision: 5,
  zoom: 6,
  theme: null,
  };

  Heron.options.map.statusbar = [
     // {type: "any", options:{xtype: 'tbtext', text: 'Baselayer'}},
     // {type: "baselayer"},
     // {type: "-"} ,
     // {type: "any", options:{xtype: 'tbtext', text: 'Scale'}},
     // {type: "scale"},
     // {type: "-"} ,
     // {type:"measurepanel"},
      {type: "->"} ,
      {type: "any", options:{xtype: 'tbtext', text: 'Mouse Position'}},
      {type: "xcoord"},
      {type: "ycoord"}
  ];

Ext.namespace("Heron.options.wfs");
Heron.options.wfs.downloadFormats = [
    {
        name: 'CSV',
        outputFormat: 'csv',
        fileExt: '.csv'
    }
];

Heron.scratch.urls = {
	OWS: 'http://www2.cgistln.nu.ac.th/geoserver-fire/ows?',
  OWS2: 'http://ows.gistda.or.th/geoserver/ows?',
};

Heron.scratch.layermap = {
  /*
   * ====================================================================
   *                               BASELAYERS
   * ====================================================================
   */

   // OSM Base Layers
   osm:  new OpenLayers.Layer.OSM("OpenStreetMap",null),

	// Google Base Layers
	gstr: new OpenLayers.Layer.Google(
			"Google Streets", // the default
			{type: google.maps.MapTypeId.ROADMAP, visibility: true},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),
	gsat: new OpenLayers.Layer.Google(
			"Google Satellite",
			{type: google.maps.MapTypeId.SATELLITE, visibility: false},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),
	ghyb: new OpenLayers.Layer.Google(
			"Google Hybrid",
			{type: google.maps.MapTypeId.HYBRID, visibility: false},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),
	gter: new OpenLayers.Layer.Google(
			"Google Terrain",
			{type: google.maps.MapTypeId.TERRAIN, visibility: false},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),
  none: new OpenLayers.Layer.Image(
        "None",
        Ext.BLANK_IMAGE_URL,
        OpenLayers.Bounds.fromString(Heron.options.map.settings.maxExtent),

    new OpenLayers.Size(10, 10),
        {resolutions: Heron.options.map.settings.resolutions, isBaseLayer: true, visibility: false, displayInLayerSwitcher: true, transitionEffect: 'resize'}
    ),

    /*
     * ====================================================================
     *                                OVERLAYS
     * ====================================================================
     */

	prov: new OpenLayers.Layer.WMS(
            "provice",
            Heron.scratch.urls.OWS2,
            {layers: "fgds54_beta:L05_AdminBoundary_GISTDA_Province_2011_50k", transparent: true, format: 'image/png'},
            {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: false, noLegend: false,
			featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
                wfs: {
                    protocol: 'fromWMSLayer',
                    featurePrefix: 'fgds54_beta',
                    downloadFormats: Heron.options.wfs.downloadFormats
                }
            }}
    ),
  amp: new OpenLayers.Layer.WMS(
              "amphoe",
              Heron.scratch.urls.OWS2,
              {layers: "fgds54_beta:L05_AdminBoundary_GISTDA_Amphoe_2011_50k", transparent: true, format: 'image/png'},
              {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: false, noLegend: false,
  			           featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
                  wfs: {
                      protocol: 'fromWMSLayer',
                      downloadFormats: Heron.options.wfs.downloadFormats
                  }
              }}
      ),
  tam: new OpenLayers.Layer.WMS(
                "tambon",
                Heron.scratch.urls.OWS2,
                {layers: "fgds54_beta:L05_AdminBoundary_GISTDA_Tambon_2011_50k", transparent: true, format: 'image/png'},
                {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: false, noLegend: false,
    			           featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
                    wfs: {
                        protocol: 'fromWMSLayer',
                        downloadFormats: Heron.options.wfs.downloadFormats
                    }
                }}
        ),
modis_hotspot: new OpenLayers.Layer.WMS(
          "v_modis_pnt",
          Heron.scratch.urls.OWS,
          {layers: "activefire:v_modis_pnt", transparent: true, format: 'image/png'},
          {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false,
            featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
              wfs: {
                  protocol: 'fromWMSLayer',
                  downloadFormats: Heron.options.wfs.downloadFormats
              }
          }}
  ),
modis_heatmap: new OpenLayers.Layer.WMS(
          "v_modis_heat",
          Heron.scratch.urls.OWS,
          {layers: "activefire:v_modis_heat", transparent: true, format: 'image/png'},
          {singleTile: true, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false,
            featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
              wfs: {
                  protocol: 'fromWMSLayer',
                  downloadFormats: Heron.options.wfs.downloadFormats
              }
          }}
  ),

  npp_hotspot: new OpenLayers.Layer.WMS(
            "v_npp_viirs_pnt",
            Heron.scratch.urls.OWS,
            {layers: "activefire:v_npp_viirs_pnt", transparent: true, format: 'image/png'},
            {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false,
              featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
                wfs: {
                    protocol: 'fromWMSLayer',
                    downloadFormats: Heron.options.wfs.downloadFormats
                }
            }}
    ),
  npp_heatmap: new OpenLayers.Layer.WMS(
            "v_npp_viirs_heat",
            Heron.scratch.urls.OWS,
            {layers: "activefire:v_npp_viirs_heat", transparent: true, format: 'image/png'},
            {singleTile: true, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false,
              featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
                wfs: {
                    protocol: 'fromWMSLayer',
                    downloadFormats: Heron.options.wfs.downloadFormats
                }
            }}
    ),
/*    dist: new OpenLayers.Layer.WMS(
          "_nddi",
         'http://129.174.131.10/cgi-bin/mapserv?',
        {map: '/media/gisiv01/mapfiles/drought/16days/2016/drought.2016.273.map',
          layers: 'drought.2016.273',
            srs: 'EPSG:900101',
            format: 'image/png',
            transparent: true,
            //singleTile: false,
            opacity: 0.9,
            visibility: false,
            isBaseLayer: false,
        }, {'reproject': true}
    ), */

};

/*
 * ====================================================================
 *                                Layers tree
 * ====================================================================
 */
Heron.options.map.layers = [
  //add overlays
	Heron.scratch.layermap.prov,
  Heron.scratch.layermap.amp,
  Heron.scratch.layermap.tam,
  Heron.scratch.layermap.modis_heatmap,
  Heron.scratch.layermap.modis_hotspot,
  Heron.scratch.layermap.npp_heatmap,
  Heron.scratch.layermap.npp_hotspot,
	//BaseLayers
  Heron.scratch.layermap.gter,
  Heron.scratch.layermap.osm,
	Heron.scratch.layermap.gstr,
	Heron.scratch.layermap.ghyb,
	Heron.scratch.layermap.gsat,
  Heron.scratch.layermap.none

];


var treeTheme = [
	{
		text:'Base Layers',
		expanded: true,
		children:
			[
				{
					text:'ชั้นข้อมูลขอบเขตการปกครอง',
					expanded: true,
					children:
						[
							{nodeType: "gx_layer", layer: "provice", text: "ขอบเขตจังหวัด", legend: true},
              {nodeType: "gx_layer", layer: "amphoe", text: "ขอบเขตอำเภอ", legend: true},
              {nodeType: "gx_layer", layer: "tambon", text: "ขอบเขตตำบล", legend: true}
						]
				},{
					text:'MODIS (MCD14DL)',
					expanded: true,
					children:
						[
              {nodeType: "gx_layer", layer: "v_modis_pnt", text: "MODIS Hotspot", legend: true},
              {nodeType: "gx_layer", layer: "v_modis_heat", text: "MODIS Heatmap", legend: true}

						]
				},{
					text:'VIIRS 375m (VNP14IMGTDL_NRT)',
					expanded: true,
					children:
						[
              {nodeType: "gx_layer", layer: "v_npp_viirs_pnt", text: "VIIRS Hotspot", legend: true},
              {nodeType: "gx_layer", layer: "v_npp_viirs_heat", text: "VIIRS Heatmap", legend: true}

						]
				}
			]
	}
];
