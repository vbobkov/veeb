<ul>
To properly use this plugin, extensive knowledge of <a target="_blank" href="http://datatables.net/">dataTables</a> is highly recommended.
<br />
Essentially, Yuggoth extends the functionality of <a target="_blank" href="http://datatables.net/">dataTables</a> to include:
<li>Highly customizable click-and-go table cell editing. Clicking editable cells turns them into input/textarea boxes, navigating away from them automatically saves them to the database.</li>
<li>Customizable column formats/css classes.</li>
<li>Fully customizable custom commands (redundant redudancy, heh).  Anything from setting certain columns to specific values, to, well. Anything. Includes specifying their CSS classes, their ID names, their location in the HTML DOM tree, etc.</li>
<li>Mutators. No, it's not just a cool-sounding name for something that already exists. Ever wanted certain database rows and/or table cells to update their value if, say, some other column got updated? Well, that's exactly what mutators do. Fully chainable (column 1 modifies column2, which changes column4, which is a sum of column2 and column3, etc, etc.). Just be careful with infinite loops!</li>
<li>Every little change is saveable, and by default shows up highlighted in red. Specifying a save URL allows every single table edit to be saved to a back-end database via server-side Ajax calls.</li>
<li>Image previewer. Hovering over an image preview cell will trigger a chat bubble preview of the image. Can be combined with editable cells.</li>
<li>Optionally resizable/draggable table contents (requires <a target="_blank" href="https://jqueryui.com/">JQuery UI</a>).</li>

<br /><br />
The original purpose I created Yuggoth for was scalable rendering and editing of large data sets, with the ability to fully customize how and when a website can mold said data sets.
With the right parameters, Yuggoth is capable of loading ridiculously large data sets without relying on server-side processing (paginating/returning only a few rows from the database at a time).
<br /><br />
Yes, Yuggoth can load the entire huge table of whatever it is.  The highest I've tried so far has been roughly 500MB of JSON data, gzipped, sent over the wire, unzipped and parsed into Yuggoth.
Yuggoth is only limited by browser/system memory. Although, I'd imagine loading over 1GB of JSON data would make any browser unresponsive for a rather long time. :)
<br /><br />
The source code for Yuggoth can be found <a target="_blank" href="/assets/js/yugTable.js">here.</a>
<br />
Yuggoth is open source under the <a target="_blank" href="http://www.gnu.org/licenses/gpl.html">GPL v3 license</a>.
<br /><br />
</ul>


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
<div class="togglable-widget" id="table2" style="display:none">
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
	function renderStatsChart(data_source, platform, widget_suffix, title) {
		if(typeof title === 'undefined') {
			title = platform;
		}

		var charts = [];
		$.each(data_source[platform], function(year, months) {
			var new_plot = {
				name: year,
				data: $.map(months, function(value, index) { return $.parseFloatOr(value.toFixed(2), 0); })
			};
			if($.parseIntOr(year) + 2 < (new Date()).getFullYear()) {
				// new_plot['visible'] = false;
			}
			charts.push(new_plot);
		});

		$('#sales_statistics .' + platform + widget_suffix + ' .chart').highcharts({
			title: {
				text: title,
				x: 0
			},
			subtitle: {
				text: '(' + platform + ')',
				x: 0
			},
			xAxis: {
				title: {
					text: 'Date',
					style: {
						fontSize: '16px',
						fontFamily: 'Verdana, sans-serif'
					}
				},
				labels: {
					// enabled: false
					rotation: -45,
					// maxStaggerLines: 7,
					// staggerLines: 7,
					// step: 7
					style: {
						fontSize: '14px',
						fontFamily: 'Verdana, sans-serif'
					}
				},
				categories: months
			},
			yAxis: {
				title: {
					text: 'sales',
					style: {
						fontSize: '16px',
						fontFamily: 'Verdana, sans-serif'
					}
				},
				labels: {
					// enabled: false,
					formatter: function () {
						return '$' + $.numberWithCommas(this.value);
					},
					rotation: 0,
					style: {
						fontSize: '14px',
						fontFamily: 'Verdana, sans-serif'
					}
				},
				plotLines: [{
					value: 0,
					width: 1,
					// color: '#808080'
					// color: '#660000'
				}],
				endOnTick:false,
				min: 0
			},
			tooltip: {
				// formatter: function() {
					// return 'Date: <b>'+ this.x + '</b><br />Violations: <b>'+ this.y +'</b>';
				// },
				valueSuffix: ''
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				// verticalAlign: 'top',
				borderWidth: 0,
				// floating: true,
				// top: 20
			},
			series: charts
		});
	}





	$(document).ready(function() {
		table1 = {};
		table2 = {};
		table1_data = [];
		table2_data = [];

		for(var i = 1; i < 101; i++) {
			table1[i] = {
				'id': i,
				'table2_id': Math.floor(Math.random() * 50) + 1,
				'value1': Math.floor(Math.random() * 1337),
				'value2': Math.floor(Math.random() * 1337)
			};
		}

		for(var i = 1; i < 51; i++) {
			table2[i] = {
				'id': i,
				'table1_id': Math.floor(Math.random() * 100) + 1,
				'value3': Math.floor(Math.random() * 1337),
				'value4': Math.floor(Math.random() * 1337)
			};
		}

		$.each(table1, function(id, row) {
			table1_data.push(row);
		});
		$.each(table2, function(id, row) {
			table2_data.push(row);
		});

		$('#table1').yugTable({
			data: table2_data,

			resizable: '.table1-table-wrapper',
			resizableHeightPadding: 48,
			resizableWidthPadding: 40,

			colSettings: {
				classes: {
					'non-numeric': [
					]
				},

				colShowHide: {
					container: '.regular-commands'
				},

				columns: [
				],

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

			// dataSource: {},

			searchFilter: {
				fnCallback: function(dtSelector, search, yTable) {
					$(dtSelector).dataTable().fnFilter(search);
				},
				resetButton: 'Reset',
				searchButton: 'Search'
			}
		});

		/*
		$('#table2').yugTable({
			data: table2_data,

			resizable: '.table2-table-wrapper',
			resizableHeightPadding: 48,
			resizableWidthPadding: 40,

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

			// dataSource: {},

			searchFilter: {
				fnCallback: function(dtSelector, search, yTable) {
					$(dtSelector).dataTable().fnFilter(search);
				},
				resetButton: 'Reset',
				searchButton: 'Search'
			}
		});
		*/



		/*
		$(document).delegate('#table1 .dataTable tbody tr td .order-link', 'click', function(event) {
			event.stopPropagation();
			var table1_id = $(this).closest('tr').find('td:first').text();
			$('.table2-items-table').css('display', '');
			var opt = $('#table1_' + transaction_id);
			if(opt.length < 1) {
				var table1_items_summary = [];
				var current_item;
				if(typeof table1[table1_id] !== 'undefined') {
					$.each(transaction_items[transaction_id], function(idx, item) {
						if(typeof table2[item['product_id']] !== 'undefined') {
							current_item = $.cloneObj(item);
							current_item['manufacturer'] = table2[item['product_id']]['manufacturer_name'];
							current_item['model'] = table2[item['product_id']]['model'];
							table1_items_summary.push(current_item);
						}
					});
				}

				if(table1_items_summary.length < 1) {
					table1_items_summary.push({
						'id': '-1',
						'table1_id': '-1',
						'value3': 'NO DATA',
						'value4': 'NO DATA'
					});
				}

				$(this).closest('td').append(
					'<div class="veeb-subtable transaction-items-table" id="transaction_' + transaction_id + '">\
						<span class="linker"></span>\
						<div class="close-button">X</div>\
						<table></table>\
					</div>'
				);

				opt = $('#transaction_' + transaction_id);
				opt.yugTable({
					data: table1_items_summary,

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
						// sDom: '<"veeb-widget regular-commands"l<>f><><"clear-floats">p<>ir<"transaction-items-table-wrapper"t>',
						sDom: '<"veeb-widget regular-commands"><><"clear-floats">p<>ir<"transaction-items-table-wrapper"t>',
						sPaginationType: 'full_numbers'
					},

					dataSource: {
						entries: function(data, columns, classes, idCheckbox) {
							table_data = [];
							var column_value;
							$.each(data, function(index, entry) {
								entry_array = [];
								$.each(columns, function(idx, column_name) {
									column_value = entry[column_name];
									if(typeof column_value !== 'undefined') {
										if(column_name == 'product_id') {
											column_value = '<a target="_blank" href="/products?id=' + column_value + '">' + column_value + '</a>';
										}
									}
									else {
										column_value = '';
									}
									entry_array.push(column_value);
								});
								table_data[index] = entry_array;
							});
							return table_data;
						}
					},
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



		$(document).delegate('#table2 .dataTable tbody tr td .table1-link', 'click', function(event) {
			event.stopPropagation();
			var product_id = $(this).closest('tr').find('td:first').text();
			$('.table1-summary-table').css('display', '');
			if($('#table1_' + product_id).length < 1) {
				var table1_summary = [];
				$.each(table2[product_id]['transaction_ids'], function(idx, transaction_id) {
					table1_summary.push({
						'transaction_id': transaction_id,
						'order_id': transaction_order_ids[transaction_id]
					});
				});

				$(this).closest('td').append(
					'<div class="veeb-subtable table1-summary-table" id="table1_' + product_id + '">\
						<span class="linker"></span>\
						<div class="close-button">X</div>\
						<table></table>\
					</div>'
				);

				$('#table1_' + product_id).yugTable({
					data: table1_summary,

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
							command_filter_invert
						],

						alwaysSend: [
						],

						editable: [
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
						sDom: '<"veeb-widget regular-commands"><><"clear-floats">p<>ir<"table1-summary-table-wrapper"t>',
						sPaginationType: 'full_numbers'
					},

					dataSource: {
						entries: function(data, columns, classes, idCheckbox) {
							table_data = [];
							var column_value;
							$.each(data, function(index, entry) {
								entry_array = [];
								$.each(columns, function(idx, column_name) {
									column_value = entry[column_name];
									if(typeof column_value !== 'undefined') {
										if(column_name == 'order_id') {
											column_value = '<span class="link order-link2">' + column_value + '</span>';
										}
									}
									else {
										column_value = '';
									}
									entry_array.push(column_value);
								});
								table_data[index] = entry_array;
							});
							return table_data;
						}
					},
				});
				$('#table1_' + product_id).css('display', 'block');
			}
			else {
				if($('#table1_' + product_id).css('display') == 'block') {
					$('#table1_' + product_id).css('display', '');
				}	
				else {
					$('#table1_' + product_id).css('display', 'block');
				}
			}
		});



		$(document).delegate('.table1-summary-table .dataTable tbody tr td .order-link2', 'click', function(event) {
			event.stopPropagation();
			var order_id = $(this).text();
			var table1_table_search_box = $('#table1 .dataTables_filter:not(#table1 .dataTable .dataTables_filter)');
			// $(this).closest('.veeb-subtable').find('.close-button').click();
			$('.table-toggler button[table_id="table1"]').click();
			table1_table_search_box.find('input[type="search"]').prop('value', order_id);
			table1_table_search_box.find('.search').click();
			$('#table1 .dataTable tbody tr:not(#table1 .dataTable .dataTable tr)').each(function() {
				if($(this).find('.order-link').text() == order_id) {
					$(this).click();
					$(this).find('.order-link').click();
					// $('.table1-table-wrapper').animate({
						// scrollTop: $(this).offset().top - 64
						// scrollTop: $(this).position().top - 64
					// }, 0);
					return false;
				}
			});
		});
		*/



		$(document).delegate('.widget-toggler button[widget_id="table_totals"]', 'click', function(event) {
			renderStatsChart(totals, 'table1', '-totals', 'Table1 Totals');
			renderStatsChart(totals, 'table2', '-totals', 'Table2 Totals');
		});



		$(document).undelegate('.veeb-subtable .close-button', 'click');
		$(document).delegate('.veeb-subtable .close-button', 'click', function(event) {
			event.stopPropagation();
			$(this).closest('.veeb-subtable').css('display', '');
		});
	});
</script>
