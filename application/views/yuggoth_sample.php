<?php echo $includes; ?>

<div class="widget-toggler">
	<button widget_id="table1">Table 1</button>
	<button widget_id="table2">Table 2</button>
	<button widget_id="table_totals">Summary</button>
</div>

<div class="togglable-widget" id="table1">
	<div class="veeb-widget">
		<div class="veeb-table-wrapper">
			<div class="header big-header"><u>Table 1</u></div>
			<table>
			</table>
		</div>
	</div>
</div>
<div class="togglable-widget" id="table2">
	<div class="veeb-widget">
		<div class="veeb-table-wrapper">
			<div class="header big-header"><u>Table 2</u></div>
			<table>
			</table>
		</div>
	</div>
</div>
<div class="togglable-widget" id="table_totals" style="display:none">
	<div class="veeb-widget table1-totals">
		<div class="veeb-table-wrapper">
			<div class="chart"></div>
			<ul class="totals">
				<span>Totals</span>
			</ul>
		</div>
	</div>
	<div class="veeb-widget table2-totals">
		<div class="veeb-table-wrapper">
			<div class="chart"></div>
			<ul class="totals">
				<span>Totals</span>
			</ul>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function() {
		random_image_urls = [
			'https://www.google.com/images/srpr/logo11w.png',
			'https://www.google.com/logos/pacman10-hp.2.png',
			'https://www.google.com/logos/2012/startrek2012-hp.jpg',
			'https://lh5.ggpht.com/jeMAdKHTkOFqBhfwKwjNXW9-5tBkfcZ3gcHgE4af37of3jOBUOlCldsSsPwMEjuwQZG07ljMEINAEr-07jvfbwP9gzbnTCIumTMvaWzB',
			'https://lh3.ggpht.com/y-0L2mwB9XkfwnF1MgXKkiw3W1GoezWMzGuqo1JLhd1Lj2rhaVH-f6a4k3bM7q4p-DwGB5plepghFt4lSmXA-8jh_vYAKorqLLYmvRCxzA',
			'https://lh6.ggpht.com/ET-OVQZYfdE0JDzi5c52NjaHR0i3cLDS8Njg7uh4MfZtR2cNEPRB4QMCx_WU-D0usol_b_xmJTWfISm1Vwx_ClFqnAEuFXbBsGKKKenJ',
			'https://lh6.ggpht.com/C0uv3dbUIjDwR3azyWYOeKy56Ej9yMbabQmNXgiJtMECnZ3lxZj06WpFwLVrGETE-zi8EMZnm0zS5SGdXuhFQhMdBHUhB5VGE-cjMag'
		];
		table1 = {};
		table2 = {};
		table1_data = [];
		table2_data = [];
		table1_size = 50000;
		table2_size = 25000;
		max_rand = 1337455;

		for(var i = 1; i < table1_size + 1; i++) {
			table1[i] = {
				'id': i,
				'table2_id': Math.floor(Math.random() * table2_size) + 1,
				'value1': Math.floor(Math.random() * max_rand),
				'value2': Math.floor(Math.random() * max_rand),
				'image1': random_image_urls[Math.floor(Math.random() * random_image_urls.length)],
				'image2': random_image_urls[Math.floor(Math.random() * random_image_urls.length)],
				'image3': random_image_urls[Math.floor(Math.random() * random_image_urls.length)]
			};
		}

		for(var i = 1; i < table2_size + 1; i++) {
			table2[i] = {
				'id': i,
				'table1_id': Math.floor(Math.random() * table1_size) + 1,
				'value3': Math.floor(Math.random() * max_rand),
				'value4': Math.floor(Math.random() * max_rand)
			};
		}

		$.each(table1, function(id, row) {
			table1_data.push(row);
		});
		$.each(table2, function(id, row) {
			table2_data.push(row);
		});

		$('#table1').yugTable({
			data: table1_data,

			// resizable: '.table1-table-wrapper',
			resizableHeightPadding: 48,
			resizableWidthPadding: 40,
			stickyHeaders: true,

			colSettings: {
				classes: {
					'limited-width': [
						'image1',
						'image2',
						'image3'
					],
					'non-numeric': [
					],
					'image-preview': [
						'image1',
						'image2',
						'image3'
					]
				},

				colShowHide: {
					container: '.regular-commands'
				},

				commands: [
					command_filter_all,
					command_filter_none,
					command_filter_invert,
					command_checkall,
					command_uncheckall
				],

				alwaysSend: [
				],

				editable: [
					'value1',
					'value2',
					'image1',
					'image2',
					'image3'
				],

				// not added to cells that have a save button (button[name="save"])
				idCheckbox: '<input type="checkbox">',

				textareas: [
					'limited-width'
				],

				uneditable: [
					'id'
				],

				unsaveable: [
				]
			},

			colMutators: [
			],

			dataTableSettings: {
				// aaSorting: [[2, 'desc']],
				aLengthMenu: [10, 25, 50, 100, 500, 1000, 2000, 5000, 10000],
				bAutoWidth: false,
				bDeferRender: true,
				bProcessing: true,
				bSortClasses: false,
				fnHeaderCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
					$(nHead).find('th').each(function() {
						$(this).html($(this).html().replace(/_/g, '&nbsp;'));
					});
				},
				iDisplayLength: 100,
				oLanguage: {
					sSearch: ''
				},
				oSearchFilter: {
					bAutoFilter: false,
				},
				sDom: '<"veeb-widget regular-commands"l<>f><><"clear-floats">p<>ir<"table1-table-wrapper"t>',
				sPaginationType: 'full_numbers'
			},

			dataSource: {
				entries: function(data, columns) {
					table_data = [];
					entry_column_indexes = {};
					$.each(columns, function(idx, column) {
						entry_column_indexes[column] = idx;
					});

					$.each(data, function(index, entry) {
						entry_array = [];
						$.each(entry, function(column_name, column_value) {
							if(column_name == 'table2_id') {
								column_value = '<span class="link">' + column_value + '</span>';
							}
							entry_array.push(column_value);
						});
						table_data[index] = entry_array;
					});
					return table_data;
				}
			},

			searchFilter: {
				fnCallback: function(dtSelector, search, yTable) {
					$(dtSelector).dataTable().fnFilter(search);
				},
				resetButton: 'Reset',
				searchButton: 'Search'
			}
		});

		$('#table2').yugTable({
			data: table2_data,

			// resizable: '.table2-table-wrapper',
			resizableHeightPadding: 48,
			resizableWidthPadding: 40,
			stickyHeaders: true,

			colSettings: {
				classes: {
					'non-numeric': [
					]
				},

				colShowHide: {
					container: '.regular-commands'
				},

				commands: [
					command_filter_all,
					command_filter_none,
					command_filter_invert,
					command_checkall,
					command_uncheckall
				],

				alwaysSend: [
				],

				editable: [
					'value3',
					'value4'
				],

				// not added to cells that have a save button (button[name="save"])
				idCheckbox: '<input type="checkbox">',

				textareas: [
					'limited-width'
				],

				uneditable: [
					'id'
				],

				unsaveable: [
				]
			},

			colMutators: [
			],

			dataTableSettings: {
				// aaSorting: [[5, 'desc']],
				aLengthMenu: [10, 25, 50, 100, 500, 1000, 2000, 5000, 10000],
				bAutoWidth: false,
				bDeferRender: true,
				bProcessing: true,
				bSortClasses: false,
				fnHeaderCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
					$(nHead).find('th').each(function() {
						$(this).html($(this).html().replace(/_/g, '&nbsp;'));
					});
				},
				iDisplayLength: 100,
				oLanguage: {
					sSearch: ''
				},
				oSearchFilter: {
					bAutoFilter: false,
				},
				sDom: '<"veeb-widget regular-commands"l<>f><><"clear-floats">p<>ir<"table2-table-wrapper"t>',
				sPaginationType: 'full_numbers'
			},

			dataSource: {
				entries: function(data, columns) {
					table_data = [];
					entry_column_indexes = {};
					$.each(columns, function(idx, column) {
						entry_column_indexes[column] = idx;
					});

					$.each(data, function(index, entry) {
						entry_array = [];
						$.each(entry, function(column_name, column_value) {
							if(column_name == 'table1_id') {
								column_value = '<span class="link">' + column_value + '</span>';
							}
							entry_array.push(column_value);
						});
						table_data[index] = entry_array;
					});
					return table_data;
				}
			},

			searchFilter: {
				fnCallback: function(dtSelector, search, yTable) {
					$(dtSelector).dataTable().fnFilter(search);
				},
				resetButton: 'Reset',
				searchButton: 'Search'
			}
		});
		$('#table2').css('display', 'none');



		$(document).delegate('#table1 .table1-table-wrapper >.dataTable >tbody >tr >td >.link', 'click', function(event) {
			event.stopPropagation();
			var table2_id = $(this).closest('tr').find('td:nth-child(2)').text();
			$('.table2-items-table').css('display', '');
			var opt = $('#table2_' + table2_id);
			if(opt.length < 1) {
				var table2_items_summary = [];
				table2_items_summary.push({
					'id': '-1',
					'table2_id': table2_id,
					'subvalue1': 'NO DATA',
					'subvalue2': 'NO DATA',
					'subvalue3': 'NO DATA'
				});

				$(this).closest('td').append(
					'<div class="veeb-subtable" id="table2_' + table2_id + '">\
						<span class="linker"></span>\
						<div class="close-button">X</div>\
						<table></table>\
					</div>'
				);

				opt = $('#table2_' + table2_id);
				opt.yugTable({
					data: table2_items_summary,

					colSettings: {
						classes: {
							'limited-width': [
								'image4'
							]
						},

						colShowHide: {
							container: '.regular-commands'
						},

						commands: [
							command_filter_all,
							command_filter_none,
							command_filter_invert,
							command_checkall,
							command_uncheckall
						],

						alwaysSend: [
						],

						editable: [
							'image4',
							'subvalue1',
							'subvalue2',
							'subvalue3'
						],

						// idCheckbox: '<input type="checkbox">',

						textareas: [
							'limited-width'
						],

						uneditable: [
							'id'
						],

						unsaveable: [
						]
					},

					colMutators: [
					],

					dataTableSettings: {
						aLengthMenu: [10, 25, 50, 100, 500, 1000, 2000, 5000, 10000],
						bAutoWidth: false,
						bDeferRender: true,
						bProcessing: true,
						bSortClasses: false,
						fnHeaderCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
							$(nHead).find('th').each(function() {
								$(this).html($(this).html().replace(/_/g, '&nbsp;'));
							});
						},
						iDisplayLength: 100,
						oLanguage: {
							sSearch: ''
						},
						oSearchFilter: {
							bAutoFilter: false,
						},
						// sDom: '<"veeb-widget regular-commands"l<>f><><"clear-floats">p<>ir<"table2-items-table-wrapper"t>',
						sDom: '<"veeb-widget regular-commands"><><"clear-floats">p<>ir<"table2-items-table-wrapper"t>',
						sPaginationType: 'full_numbers'
					},

					dataSource: {},
				});
				opt.css('display', 'block');
			}
			else {
				if(opt.css('display') == 'block') {
					opt.css('display', '');
				}	
				else {
					opt.css('display', 'block');
				}
			}
		});

		$(document).delegate('#table2 .table2-table-wrapper >.dataTable >tbody >tr >td >.link', 'click', function(event) {
			event.stopPropagation();
			var table1_id = $(this).closest('tr').find('td:nth-child(2)').text();
			$('.table1-items-table').css('display', '');
			var opt = $('#table1_' + table1_id);
			if(opt.length < 1) {
				var table2_items_summary = [];
				table2_items_summary.push({
					'id': '-1',
					'table1_id': table1_id,
					'image1': table1[table1_id]['image1'],
					'subvalue4': 'NO DATA'
				});

				$(this).closest('td').append(
					'<div class="veeb-subtable" id="table1_' + table1_id + '">\
						<span class="linker"></span>\
						<div class="close-button">X</div>\
						<table></table>\
					</div>'
				);

				opt = $('#table1_' + table1_id);
				opt.yugTable({
					data: table2_items_summary,

					colSettings: {
						classes: {
							'limited-width': [
								'image1'
							]
						},

						colShowHide: {
							container: '.regular-commands'
						},

						commands: [
							command_filter_all,
							command_filter_none,
							command_filter_invert,
							command_checkall,
							command_uncheckall
						],

						alwaysSend: [
						],

						editable: [
							'image1',
							'subvalue4'
						],

						// idCheckbox: '<input type="checkbox">',

						textareas: [
							'limited-width'
						],

						uneditable: [
							'id'
						],

						unsaveable: [
						]
					},

					colMutators: [
					],

					dataTableSettings: {
						aLengthMenu: [10, 25, 50, 100, 500, 1000, 2000, 5000, 10000],
						bAutoWidth: false,
						bDeferRender: true,
						bProcessing: true,
						bSortClasses: false,
						fnHeaderCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
							$(nHead).find('th').each(function() {
								$(this).html($(this).html().replace(/_/g, '&nbsp;'));
							});
						},
						iDisplayLength: 100,
						oLanguage: {
							sSearch: ''
						},
						oSearchFilter: {
							bAutoFilter: false,
						},
						// sDom: '<"veeb-widget regular-commands"l<>f><><"clear-floats">p<>ir<"table1-items-table-wrapper"t>',
						sDom: '<"veeb-widget regular-commands"><><"clear-floats">p<>ir<"table1-items-table-wrapper"t>',
						sPaginationType: 'full_numbers'
					},

					dataSource: {},
				});
				opt.css('display', 'block');
			}
			else {
				if(opt.css('display') == 'block') {
					opt.css('display', '');
				}	
				else {
					opt.css('display', 'block');
				}
			}
		});

		$(document).undelegate('.widget-toggler button', 'click');
		$(document).delegate('.widget-toggler button', 'click', function(event) {
			$('.togglable-widget').css('display', 'none');
			$('#' + $(this).attr('widget_id')).css('display', 'block');
		});

		$(document).undelegate('.veeb-subtable .close-button', 'click');
		$(document).delegate('.veeb-subtable .close-button', 'click', function(event) {
			event.stopPropagation();
			$(this).closest('.veeb-subtable').css('display', '');
		});
	});
</script>
