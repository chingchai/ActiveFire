/* Hotspot fire app
 * Mr Chingchai Humhong
 * Assoc Prof Dr Chada Narongrit
 * 16/01/2017
 * chada@nu.ac.th, chingchai.h@gmail.com, chingchaih@nu.ac.th
 * GISTNU @ Naresuan University
 * MIT@License
 * github : https://github.com/chingchai/ActiveFire
 */
Heron.examples.searchPanelConfig = {
    xtype: 'hr_multisearchcenterpanel',
    height: 600,
    hropts: [
        {
            searchPanel: {
                xtype: 'hr_searchbydrawpanel',
                name: __('ค้นหาโดยใช้เมาส์วาด'),
                header: false
            },
            resultPanel: {
                xtype: 'hr_featuregridpanel',
                id: 'hr-featuregridpanel',
                header: false,
                autoConfig: true,
                autoConfigMaxSniff: 100,
                exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
                gridCellRenderers: Heron.options.gridCellRenderers,
                hropts: {
                    zoomOnRowDoubleClick: true,
                    zoomOnFeatureSelect: false,
                    zoomLevelPointSelect: 12,
                    zoomToDataExtent: false
                }
            }
        },{
            searchPanel: {
                xtype: 'hr_searchbyfeaturepanel',
                name: __('ค้นหาโดยใช้ขอบเขตชั้นข้อมูล'),
                description: 'Select feature-geometries from one layer and use these to perform a spatial search in another layer.',
                header: false,
                border: false,
                bodyStyle: 'padding: 6px',
                style: {
                    fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
                    fontSize: '12px'
                }
            },
            resultPanel: {
                xtype: 'hr_featuregridpanel',
                id: 'hr-featuregridpanel',
                header: false,
                border: false,
                autoConfig: true,
                exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
                gridCellRenderers: Heron.options.gridCellRenderers,
                hropts: {
                    zoomOnRowDoubleClick: true,
                    zoomOnFeatureSelect: false,
                    zoomLevelPointSelect: 12,
                    zoomToDataExtent: false
                }
            }
        },{
            searchPanel: {
                xtype: 'hr_gxpquerypanel',
                name: __('ค้นหาโดยกำหนดเงื่อนไข'),
                description: 'This search uses both search within Map extent and/or your own attribute criteria',
                header: false,
                border: false,
                caseInsensitiveMatch: true,
                autoWildCardAttach: true
            },
            resultPanel: {
                xtype: 'hr_featuregridpanel',
                id: 'hr-featuregridpanel',
                header: false,
                border: false,
                autoConfig: true,
                exportFormats: ['XLS', 'GMLv2', 'GeoJSON', 'WellKnownText', 'Shapefile'],
                gridCellRenderers: Heron.options.gridCellRenderers,
                hropts: {
                    zoomOnRowDoubleClick: true,
                    zoomOnFeatureSelect: false,
                    zoomLevelPointSelect: 12,
                    zoomToDataExtent: true
                }
            }
        }
    ]
};

Heron.options.map.toolbar = [
    {type: "baselayer", options: {width: 150, listWidth: 160}},
    {type: "scale"},
	{type: "-"} ,
    {type: "featureinfo", options: {
        popupWindow: {
            width: 400,
            height: 340,
            featureInfoPanel: {
                showTopToolbar: true,

                // Should column-names be capitalized? Default true.
                columnCapitalize: true,

                // Export to download file. Option values are 'CSV', 'XLS', or a Formatter object (see FeatureGridPanel) , default is no export (results in no export menu).
                exportFormats: ['CSV', 'XLS', 'GMLv2', 'Shapefile',
                    {
                        name: 'Esri Shapefile (WGS84)',
                        formatter: 'OpenLayersFormatter',
                        format: 'OpenLayers.Format.GeoJSON',
                        targetFormat: 'ESRI Shapefile',
                        targetSrs: 'EPSG:4326',
                        fileExt: '.zip',
                        mimeType: 'application/zip'
                    },{
                        // Try this with PDOK Streekpaden and Fietsroutes :-)
                         name: 'GPS File (GPX)',
                         formatter: 'OpenLayersFormatter',
                         format: 'OpenLayers.Format.GeoJSON',
                         targetSrs: 'EPSG:4326',
                         targetFormat: 'GPX',
                         fileExt: '.gpx',
                         mimeType: 'text/plain'
                     },
                    'GeoJSON', 'WellKnownText'],
                // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
                // exportFormats: ['CSV', 'XLS'],
                maxFeatures: 10,

                // In case that the same layer would be requested more than once: discard the styles
                discardStylesForDups: true
            }
        }
    }},
    {type: "-"} ,
    {type: "pan"},
//    {type: "pan", options: {iconCls: "icon-hand"}},
    {type: "zoomin"},
    {type: "zoomout"},
    {type: "zoomvisible"},
    //{type: "coordinatesearch", options: {onSearchCompleteZoom: 8}},
    {type: "-"} ,
    {type: "zoomprevious"},
    {type: "zoomnext"},
    {type: "-"},
// Use "geodesic: true" for non-linear/Mercator projections like Google, Bing etc
    {type: "measurelength", options: {geodesic: false}},
    {type: "measurearea", options: {geodesic: false}}
];
