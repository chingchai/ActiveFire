Ext.namespace("Heron.options");
Ext.namespace("Heron.scratch");
Ext.namespace("Heron.examples");

OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "resources/proxy.php?url=";
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

Ext.BLANK_IMAGE_URL = 'http://cdnjs.cloudflare.com/ajax/libs/extjs/3.4.1-1/resources/images/default/s.gif';

Ext.namespace("Heron.options.map");

Heron.options.map.settings = {
  projection: 'EPSG:3857',
  displayProjection: new OpenLayers.Projection("EPSG:4326"),
	units: 'm',
	maxExtent: '-20037508.34, -20037508.34, 20037508.34, 20037508.34',
  //displayProjection1: new OpenLayers.Projection("EPSG:32647"),
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
	OWS: 'http://www2.cgistln.nu.ac.th/geoserver/ows?',
  OWS2: 'http://ows.gistda.or.th/geoserver/ows?',
  OWS3: 'http://www.map.nu.ac.th/geoserver-hgis/ows?',
  GS2_OWS: 'http://kademo.nl/gs2/ows?',

  NASAOWS: 'https://firms.modaps.eosdis.nasa.gov/wmsc6/?',
};

Heron.scratch.layermap = {
  /*
   * ====================================================================
   *                               BASELAYERS
   * ====================================================================
   */

   // OSM Base Layers
   //osm:  new OpenLayers.Layer.OSM("OpenStreetMap",null),

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
/*
	// Bing Layers
	 bgr: new OpenLayers.Layer.Bing({
        name: "Bing Road",
        key: "Ai8NCnEOhBj22Uz9OIfrhCBxvjyDQJEDkBbTWzJCfuKdlyR_VyqFxMvQgbmgJ10z",
        type: "Road"
    }),
    bgh: new OpenLayers.Layer.Bing({
        name: "Bing Hybrid",
        key: "Ai8NCnEOhBj22Uz9OIfrhCBxvjyDQJEDkBbTWzJCfuKdlyR_VyqFxMvQgbmgJ10z",
        type: "AerialWithLabels"
    }),
    bgs: new OpenLayers.Layer.Bing({
        name: "Bing Aerial",
        key: "Ai8NCnEOhBj22Uz9OIfrhCBxvjyDQJEDkBbTWzJCfuKdlyR_VyqFxMvQgbmgJ10z",
        type: "Aerial"
    }),
*/
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
              {layers: "	fgds54_beta:L05_AdminBoundary_GISTDA_Amphoe_2011_50k", transparent: true, format: 'image/png'},
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
// Climate layers

MODIS_Hotspots: new OpenLayers.Layer.WMS(
        "fires24",
        Heron.scratch.urls.NASAOWS,
        {layers: "fires48", format: "image/png", transparent: true},
        {isBaseLayer: false, singleTile: true, visibility: false, alpha: true, opacity: 0.7,
          featureInfoFormat: "application/vnd.ogc.gml", transitionEffect: 'resize',
            metadata: {
                wfs: {
                    protocol: 'fromWMSLayer',
                    featurePrefix: 'heron',
                    featureNS: 'http://heron-mc.org',
                    downloadFormats: Heron.options.wfs.downloadFormats
                }
            }}
  ),



/*
 * Aardbevingen
 *  KNMI Aardbevingen: vanuit http://www.knmi.nl/seismologie/aardbevingen-nederland.html
 */
knmi: new OpenLayers.Layer.WMS(
        "KNMI Aardbevingen",
        Heron.scratch.urls.GS2_OWS,
        {layers: "heron:knmi_aardbevingen_4326", format: "image/png", transparent: true},
        {isBaseLayer: false, singleTile: true, visibility: false, alpha: true, opacity: 0.7,
          featureInfoFormat: "application/vnd.ogc.gml", transitionEffect: 'resize',
            metadata: {
                wfs: {
                    protocol: 'fromWMSLayer',
                    featurePrefix: 'heron',
                    featureNS: 'http://heron-mc.org',
                    downloadFormats: Heron.options.wfs.downloadFormats
                }
            }}
  ),

timslider_pnt: new OpenLayers.Layer.WMS(
          "v_all_dengue_timslider_pnt",
          Heron.scratch.urls.OWS3,
          {layers: "hgis:v_all_dengue_timslider_pnt", transparent: true, format: 'image/png'},
          {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false,
    featureInfoFormat: 'application/vnd.ogc.gml', transitionEffect: 'null', metadata: {
              wfs: {
                  protocol: 'fromWMSLayer',
                  downloadFormats: Heron.options.wfs.downloadFormats
              }
          }}
  ),
timslider: new OpenLayers.Layer.WMS(
          "v_all_dengue_timslider",
          Heron.scratch.urls.OWS3,
          {layers: "hgis:v_all_dengue_timslider", transparent: true, format: 'image/png'},
          {singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: false, noLegend: false,
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
  //add overlay1
  Heron.scratch.layermap.knmi,
  Heron.scratch.layermap.MODIS_Hotspots,

  //add overlay2
	Heron.scratch.layermap.prov,
  Heron.scratch.layermap.amp,
  Heron.scratch.layermap.tam,
  Heron.scratch.layermap.timslider_pnt,
  Heron.scratch.layermap.timslider,
	//BaseLayers
//  Heron.scratch.layermap.osm
	Heron.scratch.layermap.gstr,
	Heron.scratch.layermap.ghyb,
	Heron.scratch.layermap.gsat,
	Heron.scratch.layermap.gter,
  Heron.scratch.layermap.none
  /*	Heron.scratch.layermap.bgr,
	Heron.scratch.layermap.bgh,
	Heron.scratch.layermap.bgs */

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
              {nodeType: "gx_layer", layer: "amphoe", text: "ขอบเขตอำเเภอ", legend: true},
              {nodeType: "gx_layer", layer: "tambon", text: "ขอบเขตตำบล", legend: true},
						]
				},{
					text:'ชั้นข้อมูลภูมิอากาศ',
					expanded: true,
					children:
						[
              {nodeType: "gx_layer", layer: "fires24", text: "MODIS_Hotspots", legend: true},
              {nodeType: "gx_layer", layer: "v_all_dengue_timslider_pnt", text: "v_all_dengue", legend: true},
              {nodeType: "gx_layer", layer: "v_all_dengue_timslider", text: "v_all_dengue_timslider", legend: true},
              {nodeType: "gx_layer", layer: "KNMI Aardbevingen", text: "KNMI Aardbevingen", legend: true},

						]
				}
			]
	}
];
