/** api: example[timeslider]
 *  TimeSlider
 *  ----------
 *  Show time-based Layer data via WMS Time using a timeslider.
 */
Ext.namespace("Heron");
Ext.namespace("Heron.options.map");
Ext.namespace("Heron.options");
Ext.namespace("Heron.scratch");
Ext.namespace("Heron.examples");

Ext.namespace("Heron.geoportal");
Heron.geoportal.menuItems = [
	{
		id: 'hr-menu-bar',
		xtype: 'toolbar',
		floating: false,
		items:[
			{
				xtype: 'tbspacer'},
			{ text: 'Home',
				icon: 'resources/css/images/fam_silk/icons/house.png',
				handler:function(){window.open("http://www2.cgistln.nu.ac.th/", "_blank")}

			},{
				xtype : 'tbseparator'
			},{
				xtype: 'tbbutton',
				text: 'Map',
				icon: 'resources/css/images/silk/map.png',
				card: 'hr-geo-main',
				handler: Heron.widgets.MenuHandler.onSelect
			},
			{
				xtype : 'tbseparator'
			},{
				xtype: 'tbbutton',
				text: 'Services',
				icon: 'resources/css/images/silk/application_view_tile.png',
				card: 'hr-content-main',
				//page: 'iframed',
				handler: Heron.widgets.MenuHandler.onSelect
			},{
				xtype : 'tbseparator'
			},{
				xtype: 'tbbutton',
				text: 'Documents',
				icon: 'resources/css/images/fam_silk/icons/page_white_powerpoint.png',
				card: 'hr-content-main',
				//page: 'iframed',
				handler: Heron.widgets.MenuHandler.onSelect
			},{
				xtype : 'tbseparator'
			},{
				xtype: 'tbbutton',
				text: 'Teams',
				icon: 'resources/css/images/fam_silk/icons/group.png',
				card: 'hr-content-main',
				//page: 'iframed',
				handler: Heron.widgets.MenuHandler.onSelect
			},{
				xtype : 'tbseparator'
			},{
				xtype: 'tbbutton',
				text: 'Help',
				icon: 'resources/css/images/fam_silk/icons/help.png',
				card: 'hr-content-main',
				//page: 'iframed',
				handler: Heron.widgets.MenuHandler.onSelect
			},{
				xtype : 'tbseparator'
			}
		]
	}
];


Ext.namespace("Heron");
Ext.namespace("Heron.options");
Ext.namespace("Heron.options.layertree");
Heron.options.layertree.tree = treeTheme;

Heron.layout = {
	/** Top Panel: fills entire browser window. */
	xtype: 'panel',
	id: 'hr-container-main',
	layout: 'border',
	border: false,

	items :  [
		{
			/** North container: fixed banner plus Menu. */
			xtype: 'panel',
			id: 'hr-container-north',
			region: 'north',
			layout: 'border',
			width: '100%',
			height: 80,
			bodyBorder: false,
			border: false,
			items :  [
				{
					xtype: 'hr_htmlpanel',
					id: 'hr-logo-panel',
					region: 'center',
					bodyBorder: false,
					border: false,
					autoLoad: {
						url: 'img/head.html'
					},
					height: 55
				},{
					xtype: 'hr_menupanel',
					id: 'hr-menu-panel',
					region: 'south',
					bodyBorder: false,
					border: false,
					height: 28,
					/** Menu options, see widgets/MenuPanel */
					hropts: {
						pageRoot: 'content/',
						cardContainer: 'hr-container-center',
						pageContainer: 'hr-content-main',
						defaultCard: 'hr-geo-main',
						//defaultPage: 'inspire'
					},
					/** See above for the items. */
					items: Heron.geoportal.menuItems
				}
			]
		},{
			/**
			 * Content area: either map + navigation or plain (HTML) content driven by Menu.
			 * An ExtJS Card Layout is used to swap between Map view and HTML content views.
			 **/
			xtype: 'panel',
			id: 'hr-container-center',
			region: 'center',
			layout: 'card',
			border: false,
			header: false,
			activeItem: 'hr-content-main',
			width: '100%',

			items :  [
				{
					/** HTML content area in which HTML fragments from content/ dir are placed. */
					xtype: 'hr_htmlpanel',
					id: 'hr-content-main',
					layout: 'fit',
					autoScroll: true,
					height: '100%',
					width: '100%',
					preventBodyReset: true,
					bodyBorder: false,
					border: false
				},{
					/** "Geo" content area, i.e. the Map and the Accordion widgets on the left. */
					xtype: 'panel',
					id: 'hr-geo-main',
					layout: 'border',
					width: '100%',
					border: false,
					items: [
						{
							/** "Geo" navigation area, i.e. the left widgets in Accordion layout. */
							xtype: 'panel',
							id: 'hr-menu-left-container',
							layout: 'accordion',
							region: "west",
							width: 240,
							collapsible: false,
							border: false,
							split: false,
							items: [
								{
									xtype: 'hr_layertreepanel',
									border: true,

									// The LayerTree tree nodes appearance: default is ugly ExtJS document icons
									// Other values are 'none' (no icons). May be overridden in specific 'gx_layer' type config.
									layerIcons : 'bylayertype',

									// Allow moving layers
									enableDD: true,

									// Right-mouse popoup menu
									contextMenu: [
										{
											xtype: 'hr_layernodemenulayerinfo'
										},{
											xtype: 'hr_layernodemenuzoomextent'
										},{
											xtype: 'hr_layernodemenustyle'
										},{
											xtype: 'hr_layernodemenuopacityslider'
										}
									],
									// Optional, use internal default if not set
									hropts: Heron.options.layertree
								},
								{
									xtype: 'hr_htmlpanel',
									id: 'hr-info-west',
									border: true,
									html: Heron.options.menu.html,
									preventBodyReset: true,
									title: 'Drought Monitor'
								},
								/*{
									xtype: 'hr_htmlpanel',
									id: 'hr-info-west',
									border: true,
									html: Heron.options.info.html,
									preventBodyReset: true,
									title: 'Drought Forecast'
								},*/

							]
						},{
							/** Map and Feature Info panel area. */
							xtype: 'panel',
							id: 'hr-map-and-info-container',
							layout: 'border',
							region: 'center',
							width: '100%',
							collapsible: false,
							split	: true,
							border: false,
							items: [
								{
									xtype: 'hr_mappanel',
									id: 'hr-map',
									region: 'center',
									collapsible : false,
									border: false,
									hropts: Heron.options.map
								},
								{
																	xtype: 'hr_timesliderpanel',
																	id: 'hr-timesliderpanel',
																	region: 'south',
																	border: false,
                    							html: '<div id="slider-container" style="margin-left:2px;width:100%;border:none;">'+
																	'<div id="sliderbar" style="position: relative; top: 0px;margin: 0px; h-align: center; width: 100%;height: 100%;border:none;">'+
																	'</div></div><form id="timeslide"><input type="hidden" id="datStart" value="x"/></form>',
																	layerNames: ['v_all_dengue_timslider','v_all_dengue_timslider_pnt'],
																	timelineStartYear: 2008,
																	timelineEndYear: 2020,
																	timelineCenterDate: '2016-02-01',
																	timelineDayWidth: 1,
																	timelineZoom: true,
																	filterTitle: 'Filter op periode:',
																	filterStartDate: '2016-12-27',
																	filterEndDate: '2017-01-03',
																	height: 45,
																	header: true,
																	collapsible: false,
																	collapsed: false,
																	padding: '0px'
									}

							]
						}
					]
				}
			]
		}
	]
};
