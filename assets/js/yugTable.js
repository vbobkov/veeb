/**
 * @summary     Table of Yuggoth
 * @description An extension of dataTables, geared towards scalable and intuitive editing/importing of large data sets.
 *
 * @version     1.0.0
 * @file        yugTable.js
 * @author      Vic Bobkov
 * @contact     vik.bobkov@gmail.com
 *
 * @copyright Copyright 2013 Vic Bobkov, all rights reserved.
 *
 * This source file is free software, under the GPL v3 license:
 *   http://www.gnu.org/licenses/gpl.html
 *   http://www.gnu.org/licenses/gpl.txt
 */

$.fn.yugTable = function(data) {
	var self = this;
	self.container_selector = '#' + $(this).prop('id');
	if($(self.container_selector).length < 1) {
		return;
	}
	else if(typeof $(self.container_selector)[0].yugTable !== 'undefined') {
		return $(self.container_selector)[0].yugTable;
	}
	else if(typeof data === 'undefined') {
		return;
	}



	self.settings = data;
	self.clickSimulator = {
		touchDelay: 1000
	};
	self.defaults = {
		headers: function(data, columns, classes, idCheckbox) {
			table_headers = [];
			var current_class;
			var current_header;

			$.each(columns, function(idx, column_name) {
				current_class = '';
				if(typeof classes === 'object') {
					$.each(classes, function(class_name, columns) {
						if(columns.indexOf(column_name) != -1) {
							current_class += ' ' + class_name;
						}
					});
				}
				current_header = {
					bVisible: true,
					sTitle: column_name,
					sClass: current_class
				};

				if(idCheckbox && column_name == 'id') {
					current_header['sType'] = 'num-html';
				}
				table_headers.push(current_header);
			});

			return table_headers;
		},
		entries: function(data, columns) {
			table_data = [];
			entry_column_indexes = {};
			$.each(columns, function(idx, column) {
				entry_column_indexes[column] = idx;
			});

			$.each(data, function(index, entry) {
				entry_array = [];
				$.each(entry, function(column_name, column_value) {
					if(column_value != null && column_name.split('_json').length > 1) {
						column_value = JSON.parse(column_value);
					}
					// entry_array.push(column_value);
					entry_array[entry_column_indexes[column_name]] = column_value;
				});
				table_data[index] = entry_array;
			});
			return table_data;
		},
		redisPollInterval: 10000
	};



	self.fnAddMissingColumns = function(post, row) {
		new_post = $.cloneObj(post);
		var aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns;
		var colname;
		row.find('td').each(function() {
			colname = self.fnGetColumnLabel(this, aoColumns);
			if(typeof new_post[colname] === 'undefined') {
				new_post[colname] = $(this).html();
			}
		});
		return new_post;
	};

	self.fnColumnShowHide = function(iCol, bVis, bVisOther, updateCheckboxes) {
		var aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns;
		if(typeof updateCheckboxes === 'undefined') {
			updateCheckboxes = true;
		}

		if(Object.prototype.toString.call(iCol) === '[object Array]') {
			if(typeof bVisOther !== 'undefined') {
				$.each(aoColumns, function(column_index, column) {
					if(iCol.indexOf(column_index) != -1) {
						self.fnColumnSetVis(column_index, bVis);
					}
					else if(self.fnColumnGetVis(column_index) != bVisOther) {
						self.fnColumnSetVis(column_index, bVisOther);
					}
				});
			}
			else {
				$.each(iCol, function(idx, column_index) {
					self.fnColumnSetVis(column_index, bVis);
				});
			}
		}
		else {
			if(iCol == -1) { // all
				for(var i = 0; i < aoColumns.length; i++) {
					self.fnColumnSetVis(i, true);
				}
			}
			else if(iCol == -2) { // none
				for(var i = 0; i < aoColumns.length; i++) {
					self.fnColumnSetVis(i, false);
				}
			}
			else if(iCol == -3) { // invert
				for(var i = 0; i < aoColumns.length; i++) {
					self.fnColumnSetVis(i, self.fnColumnGetVis(i) ? false : true);
				}
			}
			else {
				self.fnColumnSetVis(iCol, self.fnColumnGetVis(iCol) ? false : true);
				updateCheckboxes = false;
			}
		}

		if(updateCheckboxes) {
			$.each(aoColumns, function(column_index, column) {
				$('.YugCommand_collection .YugCommand_title').filter(function() {
					return $(this).text() === column.sTitle;
				}).parent().find('.YugCommand_radio input').prop('checked', column.isVisible);
			});
		}
	};

	self.fnColumnSetVis = function(column_index, bVis) {
		if(typeof bVis === 'undefined' || typeof self.table_selector === 'undefined') {
			return;
		}
		var aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns[column_index].isVisible = bVis;

		if(bVis) {
			var bVis_display = '';
		}
		else {
			var bVis_display = 'none';
		}

		$(self.table_selector + ' thead tr')[0].children[column_index].style.display = bVis_display;
		$(self.table_selector + ' tbody tr').each(function() {
			if(typeof this.children[column_index] !== 'undefined') {
				this.children[column_index].style.display = bVis_display;
			}
		});
	};

	self.fnColumnGetVis = function(column_index) {
		if($(self.table_selector + ' thead tr')[0].children[column_index].style.display == 'none') {
			return false;
		}
		else {
			return true;
		}
	};

	self.fnGetCellText = function(cell) {
		var select = cell.find('select');
		if(select.length > 0) {
			return select.find(':selected').text();
		}
		else {
			return cell.text();
		}
	};

	self.fnGetColumnName = function(element) {
		return $(element).closest('table').find('thead th:nth-child('
				+ ($(element).closest('tr').children().index($(element).closest('td')) + 1) +
			')').text();
	};

	self.fnGetColumnLabel = function(element, aoColumns) {
		if(typeof aoColumns === 'undefined') {
			aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns;
		}
		return aoColumns[$(element).closest('td').index()].sTitle;
	};

	self.fnGetColumnLabelIndex = function(column_label_name, aoColumns) {
		if(typeof aoColumns === 'undefined') {
			aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns;
		}
		var index = -1;
		$.each(aoColumns, function(column_index, column) {
			if(column_label_name == column.sTitle) {
				index = column_index;
			}
		});
		return index;
	};

	self.fnGetRowCell = function(row, column_label, aoColumns) {
		if(typeof aoColumns === 'undefined') {
			aoColumns = row.closest('table').dataTable().fnSettings().aoColumns;
		}
		$.each(aoColumns, function(column_index, column) {
			if(column.sTitle == column_label) {
				cell = row.find('td:nth-child(' + (column_index + 1) + ')');
				return false;
			}
		});
		return cell;
	};

	/*
	* column mutators (automatic sum calculation on change, etc.)
	* table_cells:
	* post: the name/value mapping to initially begin with (must include an 'id' field)
	* table_row:
	* ignore_redis:
	*
	* returns a new object, with a name/value mapping of all the cells that got changed
	* (not just the ones that are sent to the database)
	*/
	self.fnMutate = function(table_cells, post, table_row, ignore_redis, mutators_to_exclude) {
		if(table_cells.length < 1) {
			return;
		}
		if(typeof table_row === 'undefined') {
			table_row = table_cells[0].closest('tr');
		}
		if(typeof mutators_to_exclude !== 'object') {
			mutators_to_exclude = [];
		}

		all_changes = $.cloneObj(post);
		var dt = table_row.closest('table').dataTable();
		var aoColumns = dt.fnSettings().aoColumns;

		var current_table_cell;
		var current_table_cells = table_cells;
		var current_rhs;
		var lhs_cells;
		var lhs_label;
		var mutator;
		if(typeof self.settings.colMutators !== 'undefined') {
			while(current_table_cells.length > 0) {
				current_table_cell = current_table_cells.shift();
				match_found = false;
				for(var idx = 0; idx < self.settings.colMutators.length; idx++) {
					mutator = self.settings.colMutators[idx];
					if(mutators_to_exclude.indexOf(mutator.name) == -1
					&& mutator.leftHandSide.indexOf(self.fnGetColumnLabel(current_table_cell, aoColumns)) != -1) {

						current_rhs = self.fnGetRowCell(table_row, mutator.rightHandSide, aoColumns);
						lhs_cells = {};
						for(var idx2 = 0; idx2 < mutator.leftHandSide.length; idx2++) {
							lhs_label = mutator.leftHandSide[idx2];
							lhs_cells[lhs_label] = self.fnGetRowCell(table_row, lhs_label, aoColumns);
						}

						if(lhs_cells !== {}) {
							mutated_value = mutator.mutate(lhs_cells);
							all_changes[mutator.rightHandSide] = mutated_value;
							if(mutator.saveToDB) {
								post[mutator.rightHandSide] = mutated_value;
							}
							self.fnSetCell(current_rhs, mutated_value, 'status-red');
							// dt.fnUpdate(mutated_value, table_row[0], self.fnGetColumnLabelIndex(mutator.rightHandSide, aoColumns), false, false);
							current_table_cells.push(current_rhs);
						}
					}
				}
			}
		}

		var existing_data = dt.fnSettings().aoData;
		var id_index = self.fnGetColumnLabelIndex('id');
		for(var j = 0; j < existing_data.length; j++) {
			if(all_changes['id'] == existing_data[j]['_aData'][id_index]) {
				$.each(all_changes, function(name, value) {
					if(name != 'id') {
						existing_data[j]['_aData'][self.fnGetColumnLabelIndex(name)] = value;
					}
				});
				break;
			}
		}

		if(typeof self.settings.colSettings.alwaysSend === 'object') {
			$.each(self.settings.colSettings.alwaysSend, function(idx, column_name) {
				all_changes[column_name] = self.fnGetRowCell(table_row, column_name, aoColumns).text();
			});
		}
		return all_changes;
	};

	self.fnProcessSelectedRows = function(result, process, update_counter, post_completion_processing) {
		var dt = $(self.table_selector).dataTable();
		var current_row;
		var current_row_data;
		var id_checkbox;
		var updates = 0;
		$(self.table_selector + ' tbody tr').each(function() {
			current_row = $(this);
			id_checkbox = current_row.find('td:first-child input[type="checkbox"]');
			current_row_data = dt.fnSettings().aoData[dt.fnGetPosition(this)]._aData;

			if(id_checkbox.length > 0 && id_checkbox.prop('checked')) {
				updates += process(result, current_row_data);

				/*
				// row outline fadein/fadeout (JQuery animate fails hard and I was bored)
				current_row.css('outline', '0.125em dashed rgb(255,0,0)');
				var opacity = 1.0;
				var fadeout = function(params) {
					params[0].css('outline', '0.125em dashed rgba(255,0,0,' + opacity + ')');
					opacity -= 0.1;
					if(opacity <= 0) {
						params[0].css('outline', params[1]);
						clearInterval(row_fade_interval);
					}
				};
				var row_fade_interval = setInterval(fadeout , 100, [current_row, '']);
				*/
			}
		});
		if(typeof post_completion_processing === 'function') {
			post_completion_processing(result, function() { update_counter.html(parseInt($(update_counter[0]).text()) + parseInt(updates)); });
		}
		else {
			update_counter.html(parseInt($(update_counter[0]).text()) + parseInt(updates));
		}
	};

	self.fnRemoveAllStatusColors = function(jquery_element) {
		// removing all classes that start with 'status-'
		jquery_element.removeClass(function (index, class_name) {
			return (class_name.match(/\bstatus-\S+/g) || []).join(' ');
		});
	};

	self.redisAdd = function(rows) {
		if(typeof self.settings.redis === 'undefined'
		|| typeof self.settings.redis.addURL === 'undefined') {
			return;
		}
		$.post(self.settings.redis.addURL, {'rows': rows}, function(response) {
		});
	};

	// $('#products').yugTable().redisGet()
	self.redisGet = function() {
		if(typeof self.settings.redis === 'undefined'
		|| typeof self.settings.redis.getURL === 'undefined') {
			return;
		}

		if(typeof self.settings.redis.lastSync !== 'undefined') {
			var redis_last_synced = self.settings.redis.lastSync;
		}
		else {
			var redis_last_synced = 0;
		}

		if(typeof self.settings.redis.radar !== 'undefined') {
			var radar_button = $(self.settings.redis.radar);
		}

		var dt = $(self.table_selector).dataTable();
		$.post(self.settings.redis.getURL, {'redis_last_synced': redis_last_synced}, function(response) {
			if(response == null || response == '') {
				return;
			}
			response = JSON.parse(response);
			if(response[1].length < 1) {
				return;
			}
			self.settings.redis.lastSync = response[0];
			var entry_data = response[1];

			var entries = {};
			$.each(entry_data, function(idx, product_list) {
				// delete product_list[1];
				$.each(JSON.parse(product_list[0]), function(idx, entry) {
					if(typeof entries[entry['id']] === 'undefined') {
						entries[entry['id']] = entry;
					}
					else {
						$.each(entry, function(name, value) {
							entries[entry['id']][name] = value;
						});
					}
				});
			});

			var aoColumns = dt.fnSettings().aoColumns;
			var existing_data = dt.fnSettings().aoData;
			var column_index;
			var current_cell;
			var id_index = self.fnGetColumnLabelIndex('id', aoColumns);
			var row_array;
			var row_arrays = [];
			var row_cell;
			var table_index;
			$.each(entries, function(id, entry) {
				table_index = -1;
				for(var j = 0; j < existing_data.length; j++) {
					if(entry['id'] == existing_data[j]['_aData'][id_index]) {
						table_index = j;
						break;
					}
				}

				if(table_index != -1) {
					$.each(entry, function(name, value) {
						if(name != 'id') {
							column_index = self.fnGetColumnLabelIndex(name, aoColumns);
							existing_data[table_index]['_aData'][column_index] = value;
							current_cell = $(existing_data[table_index]['nTr']).find('td:nth-child(' + (column_index + 1) + ')');
							if(typeof current_cell !== 'undefined' && current_cell.length > 0 && current_cell[0].innerText != value) {
								self.fnRemoveAllStatusColors(current_cell);
								self.fnSetCell(current_cell, value, 'status-orange');
							}
						}
					});
				}
				else {
					if(id > 0) {
						row_array = Array.apply(null, new Array(aoColumns.length)).map(function() {return null});
						$.each(entry, function(name, value) {
							row_array[self.fnGetColumnLabelIndex(name, aoColumns)] = value;
						});
						row_arrays.push(row_array);
					}
				}
			});
			// var added_rows = dt.fnAddData(row_arrays, false);
			var added_rows = dt.fnAddData(row_arrays);
			$.each(added_rows, function(idx, table_index) {
				$(existing_data[table_index]['nTr']).find('td').addClass('status-orange');
			});
			// dt.fnDraw();
			// dt.fnStandingRedraw();
		});

		if(typeof self.settings.redis.radar !== 'undefined') {
			var bgcolor = radar_button.css('background-color');
			radar_button.css('background-color', 'rgb(128,255,128)');
			radar_button.css('box-shadow', '0em 0em 2em rgb(0,255,0)');
			var opacity = 1.0;
			var fadeout = function(params) {
				params[0].css('background-color', 'rgba(128,255,128,' + opacity + ')');
				params[0].css('box-shadow', '0em 0em 2em rgba(0,255,0,' + opacity + ')');
				opacity -= 0.1;
				if(opacity <= 0) {
					params[0].css('background-color', params[1]);
					params[0].css('box-shadow', params[2]);
					clearInterval(radar_fade_interval);
				}
			};
			var radar_fade_interval = setInterval(fadeout , 50, [radar_button, bgcolor, '']);
		}
	};

	self.redisStop = function() {
		clearInterval(self.redisPoll);
	};

	self.redisStart = function() {
		self.redisPoll = setInterval(function() {
			self.redisGet();
		}, self.redisPollInterval);
	};

	self.fnSetCell = function(cell, value, class_name) {
		// cell.html(value);
		cell[0].innerHTML = value;
		// cell.addClass(class_name);
		if(cell[0].className.indexOf(class_name) == -1) {
			cell[0].className = cell[0].className + ' ' + class_name;
		}
	};

	self.fnSimulateCellChange = function(cell) {
		var cell_value = cell.html();
		cell.click();
		var cell_editarea = cell.find('input, textarea');

		if(cell_editarea.is('textarea')) {
			cell_editarea[0].defaultValue = '';
			cell_editarea.val(cell_value);
			cell_editarea.focusout();
		}
		else if(cell_editarea.is('input')) {
			cell_editarea.attr('value', '');
			cell_editarea.prop('value', cell_value);
			cell_editarea.focusout();
		}
	};



	$.ajax({
		type: 'POST',
		url: self.settings.url,
		data: data.post,

		// progress listener, requires HTML5
		xhr: function() {
			$(self.container_selector + ' .acmedb-table-wrapper .header').
				append('<span class="progress">(loading <progress value="0" max="100"></progress><span class="info"></span>)</span>');
			var xhr = new window.XMLHttpRequest();
			/* this may be useful for later
			//Upload progress
			xhr.upload.addEventListener("progress", function(event){
				if (event.lengthComputable) {
					var percentComplete = event.loaded / event.total;
					//Do something with upload progress
				}
			}, false);
			*/
			//Download progress
			xhr.addEventListener("progress", function(event){
				var size_loaded = event.loaded;
				var size_total = -1;
				if(event.total > 0) {
					var size_total = event.total;
				}
				else {
					var all_headers_content_length_match = this.getAllResponseHeaders().match(/Uncompressed-Content-Length\: (.*?)(\r|\n)/i);
					if(typeof all_headers_content_length_match !== 'undefined' && all_headers_content_length_match != null && all_headers_content_length_match.length > 1) {
						var size_total = all_headers_content_length_match[1];
					}
				}

				if(size_loaded > 999999) {
					var size_loaded_txt = (size_loaded / 1000000).toFixed(1) + 'MB';
				}
				else {
					var size_loaded_txt = (size_loaded / 1000).toFixed(0) + 'KB';
				}

				// Render the download progress to the progress element
				// if (event.lengthComputable && event.total > 0) {
				if(size_total > 0) {
					// the response sent back a total size, which means we can draw a progress bar!
					if(size_total > 999999) {
						var size_total_txt = (size_total / 1000000).toFixed(1) + 'MB';
					}
					else {
						var size_total_txt = (size_total / 1000).toFixed(0) + 'KB';
					}

					$(self.container_selector + ' .acmedb-table-wrapper .header .progress progress').attr('value', (size_loaded / size_total) * 100);
					$(self.container_selector + ' .acmedb-table-wrapper .header .progress .info').html(size_loaded_txt + ' / ' + size_total_txt);
				}
				else {
					// the response sent back a total size header, but we can still display the size of what we already received
					$(self.container_selector + ' .acmedb-table-wrapper .header .progress').html('(' + size_loaded + ' loaded)');
				}
			}, false);
			return xhr;
		},



		// the data is finally all in memory, time to build the table
		success: function(data) {
			data = JSON.parse(data);

			if(typeof self.settings.dataTableSettings === 'undefined') {
				self.settings.dataTableSettings = {};
			}
			else {
				var _columns = [];
				var _classes = [];
				var _idCheckbox = '';
				if(typeof self.settings.colSettings === 'object') {
					if(typeof self.settings.colSettings.columns === 'object') {
						var _columns = self.settings.colSettings.columns;
					}
					else {
						var aoColumns = $(self.table_selector).dataTable().fnSettings().aoColumns;
						var _columns = [];
						$.each(aoColumns, function(column_index, column) {
							_columns.push(column.sTitle);
						});
					}

					if(typeof self.settings.colSettings.classes === 'object') {
						var _classes = self.settings.colSettings.classes;
					}
					if(typeof self.settings.colSettings.idCheckbox === 'string') {
						var _idCheckbox = self.settings.colSettings.idCheckbox;
					}
				}

				// Finalizing the dataTables settings and optimizing for very large result sets
				// by having dataTables read directly from the JSON object that gets returned from the Ajax post.
				// That way, the browser doesn't need to try to render a zillion table rows to the DOM tree before dataTables picks it up.
				if(typeof self.settings.dataSource === 'object') {
					if(typeof self.settings.dataSource.headers === 'function') {
						self.settings.dataTableSettings.aoColumns = self.settings.dataSource.headers(data, _columns, _classes, _idCheckbox);
					}
					else {
						self.settings.dataTableSettings.aoColumns = self.defaults.headers(data, _columns, _classes, _idCheckbox);
					}
					if(typeof self.settings.dataSource.entries === 'function') {
						self.settings.dataTableSettings.aaData = self.settings.dataSource.entries(data, _columns);
					}
					else {
						self.settings.dataTableSettings.aaData = self.defaults.entries(data, _columns);
					}
				}
				else if(typeof self.settings.dataSource !== 'undefined') {
					self.settings.dataTableSettings.aoColumns = self.defaults.headers(data, _columns, _classes, _idCheckbox);
					self.settings.dataTableSettings.aaData = self.defaults.entries(data, _columns);
				}
			}
			self.settings.dataTableSettings.fnDrawCallback = function(oSettings) {
				var bVis_display;
				$.each(oSettings.aoColumns, function(column_index, column) {
					if(column.isVisible) {
						bVis_display = '';
					}
					else {
						bVis_display = 'none';
					}
					self.fnColumnSetVis(column_index, column.isVisible);
				});

				// sticky headers experiment #1: clone the table header, and manually align its position/size using css
				/*
				var table_header = $(self.table_selector + ' thead');
				if($('.header-clone').length < 1) {
					$('body').append($('<div class="acmedb-table-wrapper header-clone"><table class="dataTable"></table></div>'));
					// $(self.table_selector).append($('<div class="acmedb-table-wrapper header-clone"><table class="dataTable"></table></div>'));
				}
				if($('.header-clone table thead.clone').length < 1) {
					$('.header-clone table').append(table_header.clone().addClass('clone'));
				}

				var cloned_header = $('.header-clone table thead.clone');
				$.each(cloned_header.find('th'), function(idx, column) {
					$(this).css('width', 100);
					// $(this).css('width', table_header.find('th:nth-child(' + idx + ')').outerWidth());
				});
				*/
			};

			if(typeof self.settings.colSettings === 'undefined') {
				self.settings.colSettings = {};
			}
			if(typeof self.settings.colSettings.editable === 'undefined') {
				self.settings.colSettings.editable = [];
			}
			if(typeof self.settings.colSettings.uneditable === 'undefined') {
				self.settings.colSettings.uneditable = [];
			}
			if(typeof self.settings.colSettings.unsaveable === 'undefined') {
				self.settings.colSettings.unsaveable = [];
			}

			if(typeof self.settings.colSettings.idCheckbox === 'undefined') {
				// self.settings.colSettings.idCheckboxHTML = '';
				self.settings.colSettings.idCheckbox = '';
			}
			else {
				// self.settings.colSettings.idCheckboxHTML = '<input type="checkbox">';
				self.settings.dataTableSettings.fnRowCallback = function(nRow, aData, iDisplayIndex) {
					// $(nRow).removeClass('highlighted-row');
					var id_cell = $(nRow).find('td:first-child');
					if(id_cell.find('input[type="checkbox"]').length < 1 && id_cell.find('button[name="save"]').length < 1) {
					// if(id_cell.find('button[name="save"]').length < 1) {
						// id_cell.find('input[type="checkbox"]').remove(); // reset checkboxes for anything that's being reloaded via paging, etc.
						id_cell.prepend(self.settings.colSettings.idCheckbox);
					}
				};
			}



			$(document).undelegate(self.container_selector + ' table tbody td', 'click');
			$(document).undelegate(self.container_selector + ' table tbody tr', 'click');
			$(document).undelegate(self.container_selector + ' table tbody .image-preview', 'mouseenter mouseleave');
			$(document).undelegate('.YugCommand, .YugCommand_ColumnToggleMenu', 'click');
			$(document).undelegate('.YugCommand_collection .YugCommand_Button', 'click');
			$(document).undelegate('.YugCommand_collection .YugCommand_radio', 'click');
			$(document).undelegate(self.container_selector + ' .dataTables_filter button', 'click');
			$(document).undelegate(self.container_selector + ' .dataTables_filter input', 'keyup submit');
			$(document).undelegate(self.container_selector + ' table tbody td', 'click touchstart touchend');
			$(document).undelegate(
				self.container_selector + ' table tbody td input, ' + self.container_selector + ' table tbody td textarea, ' + self.container_selector + ' table tbody td select',
				'change focusout keydown'
			);
			$(document).undelegate(self.container_selector + ' table tbody td button[name="save"]', 'click');
			$(document).undelegate(scroll_area, 'mouseenter');



			$(document).delegate(self.container_selector + ' table tbody td', 'click', function(event) {
				if(!$(event.target).is('input[type="checkbox"]')) {
					$(this).find('input[type="checkbox"]').click();
				}
			});

			// row highlighter
			$(document).delegate(self.container_selector + ' table tbody tr', 'click', function(event) {
				$(this).closest('tbody').find('.highlighted-row').removeClass('highlighted-row');
				$(this).addClass('highlighted-row');
			});



			// image previewer
			self.YugImagePreviewerCurrentCell = null;
			$(document).delegate(self.container_selector + ' table tbody .image-preview', 'mouseenter mouseleave', function(event) {
				self.YugImagePreviewerCurrentCell = $(this);
				if($('#YugImagePreviewer').length < 1) {
					$('body').append('<div id="YugImagePreviewer">\
							<img src="">\
							<span class="previewer-error">Failed to retrieve the image.</span>\
							<div class="linker"></div>\
						</div>');
					$('#YugImagePreviewer img').load(function() {
						$('#YugImagePreviewer').css('left', self.YugImagePreviewerCurrentCell.offset().left + (self.YugImagePreviewerCurrentCell.outerWidth() * 0.5));
						$('#YugImagePreviewer').css('top', self.YugImagePreviewerCurrentCell.offset().top - ($('#YugImagePreviewer').outerHeight() + (self.YugImagePreviewerCurrentCell.outerHeight() * 2)));
					});
					$('#YugImagePreviewer img').error(function() {
						$('#YugImagePreviewer .previewer-error').css('display', 'block');
						$('#YugImagePreviewer').css('left', self.YugImagePreviewerCurrentCell.offset().left + (self.YugImagePreviewerCurrentCell.outerWidth() * 0.5));
						$('#YugImagePreviewer').css('top', self.YugImagePreviewerCurrentCell.offset().top - ($('#YugImagePreviewer').outerHeight() + (self.YugImagePreviewerCurrentCell.outerHeight() * 2)));
					})
				}

				$('#YugImagePreviewer').css('visibility', '');
				if (event.type == 'mouseenter') {
					$('#YugImagePreviewer img').css('display', 'none');
					$('#YugImagePreviewer .previewer-error').css('display', '');
					$('#YugImagePreviewer img').attr('src', '');
					$('#YugImagePreviewer img').attr('src', $(this).text());
					$('#YugImagePreviewer img').css('display', '');
					if($(this).text() != '') {
						$('#YugImagePreviewer').css('visibility', 'visible');
					}
				}
			});



			// this flag (bHandlebars = true) automatically prevents dataTables from using pre-made
			// javascript arrays as a data source, because the data is already being built by Handlebars
			// so, when this flag is on, dataSource is instead used to compile the Handlebars template
			if(self.settings.bHandlebars) {
				$(self.container_selector).html(
					Handlebars.compile($(self.container_selector).html()) ({
						headers: self.settings.dataTableSettings.aoColumns,
						entries: self.settings.dataTableSettings.aaData
					})
				);
				delete self.settings.dataTableSettings.aoColumns;
				delete self.settings.dataTableSettings.aaData;
			}



			// initialize dataTables
			$(self.container_selector + ' table').each(function() {
				// self.settings.dataTableSettings.oYugCommand = { aiExclude: [] };
				$(this).dataTable(self.settings.dataTableSettings);
				$(self.container_selector + ' .acmedb-table-wrapper .header .progress').remove();
				$(self.container_selector + ' .clear').remove();

				if(typeof self.settings.colSettings.colShowHide !== 'undefined') {
					if(typeof self.settings.colSettings.colShowHide.container !== 'undefined') {
						var showhide_container = self.settings.colSettings.colShowHide.container;
					}
					else {
						var showhide_container = self.container_selector;
					}
					$(self.container_selector + ' ' + showhide_container).prepend('\
						<div class="YugCommand">\
							<button class="YugCommand_Button YugCommand_ColumnToggleMenu" type="button"><span>Toggle Columns</span></button>\
						</div>\
					');

					var YugCommand_menu = '<div class="YugCommand_collection" style="display:none">';
					$.each($(this).dataTable().fnSettings().aoColumns, function(idx, column) {
						YugCommand_menu += '<button class="YugCommand_Button">\
								<span>\
									<span class="YugCommand_radio"><input type="checkbox" checked=""></span>\
									<span class="YugCommand_title">' + column.sTitle + '</span>\
								</span>\
							</button>';
					});
					YugCommand_menu += '</div>';

					$('body').append(YugCommand_menu);
					var showhide = $(self.container_selector + ' .YugCommand_ColumnToggleMenu');
					$('body .YugCommand_collection').css('left', showhide.offset().left);
					$('body .YugCommand_collection').css('top', showhide.offset().top + showhide.outerHeight());
				}



				// using my own column toggling, because the YugCommand plugin does not handle large datasets very well
				$(document).delegate('.YugCommand, .YugCommand_ColumnToggleMenu', 'click', function() {
					$('.YugCommand_collection').css('display', '');
				});
				$(document).delegate('.YugCommand_collection .YugCommand_Button', 'click', function() {
					$(this).find('.YugCommand_radio input').click();
				});
				$(document).delegate('.YugCommand_collection .YugCommand_radio', 'click', function() {
					self.fnColumnShowHide(
						$(self.table_selector + ' thead th').index(
							$(self.container_selector
							+ ' table thead th[aria-label^='
							+ $(this).parent().find('.YugCommand_title').text() + ']')
						),
						false
					);
				});
				$(document).click(function(event) {
					if($(event.target).closest('.YugCommand_collection').length < 1 && $(event.target).closest('.YugCommand_ColumnToggleMenu').length < 1) {
						$('.YugCommand_collection').css('display', 'none');
					}
				});



				// this is silly, but I can't use bVisible and my fast column filtering algorithm
				// without breaking the dataTable sorting function - it gathers an array of columns for a row
				// and returns null when bVisible is false for a column
				// so, I'm creating another visibility variable
				$.each($(this).dataTable().fnSettings().aoColumns, function(column_index, column) {
					column.isVisible = column.bVisible;
				});

				// self.table_selector = '#' + $(self.container_selector + ' table').prop('id');
				self.table_selector = '#' + $(this).dataTable().prop('id');

				if(typeof self.settings.colSettings.commands === 'object') {
					if(typeof self.settings.colSettings.commands === 'object') {
						var current_append_location;
						$.each(self.settings.colSettings.commands, function(idx, command) {
							if(typeof command.appendLocation !== 'undefined') {
								if(typeof command.type === 'undefined') {
									command.type = 'button';
								}

								if(command.appendLocation != '') {
									current_append_location = $(self.table_selector + '_wrapper').find(command.appendLocation);
								}
								else {
									current_append_location = $(self.table_selector + '_wrapper');
								}

								// sel_tbl is for multi-table initializations,
								// where Yuggoth's table_selector points to the last table initialized by dataTables
								// and passing in the plugin object will no longer give back the correct table selector
								// to individual-table-specific commands such as per-row delete buttons
								var sel_tbl = self.table_selector;

								current_append_location.append('<' + command.type + ' class="' + command.classes + ' ' + command.name + '" type="button">' + command.title + '</button>');
								$(document).undelegate(sel_tbl + '_wrapper .' + command.name, 'click');
								$(document).delegate(sel_tbl + '_wrapper .' + command.name, 'click', function(event) {
									command.method(self, sel_tbl, this);
								});
							}
						});
					}
				}
			});



			// option to disable auto-filter on search box change - user has to click the submit button or hit enter
			if(typeof self.settings.searchFilter !== 'undefined') {
				if(typeof self.settings.searchFilter.resetButton === 'undefined') {
					self.settings.searchFilter.resetButton = 'Reset';
				}
				if(typeof self.settings.searchFilter.searchButton === 'undefined') {
					self.settings.searchFilter.searchButton = 'Search';
				}

				$(self.container_selector + ' .dataTables_filter input').unbind();
				// $(self.container_selector + ' .dataTables_filter input').attr('autocomplete', 'on');
				$(self.container_selector + ' .dataTables_filter').append(
					'<button class="search" type="button">' + self.settings.searchFilter.searchButton + '</button>');
				$(self.container_selector + ' .dataTables_filter').append(
					'<button class="reset" type="button">' + self.settings.searchFilter.resetButton + '</button>');

				// add reset and search buttons next to the search box
				$(document).delegate(self.container_selector + ' .dataTables_filter button', 'click', function(event) {
					var input_field = $(self.container_selector + ' .dataTables_filter input');
					if($(this).hasClass('search')) {
						input_field.submit();
					}
					else if($(this).hasClass('reset')) {
						var search_text = input_field.val();

						var sel_tbl = self.table_selector;
						self.settings.searchFilter.fnCallback(sel_tbl, '');
						// input_field.val(search_text);
					}
				});

				// clicking the search button or pressing enter will filter the table
				$(document).delegate(self.container_selector + ' .dataTables_filter input', 'keyup submit', function(event) {
					event.preventDefault();
					event.stopPropagation();
					if((event.type == 'keyup' && event.which == 13) || event.type == 'submit') {
						var sel_tbl = self.table_selector;
						self.settings.searchFilter.fnCallback(sel_tbl, $(this).val(), self);
					}
				});

				if(typeof self.settings.searchFilter.customFilters === 'function') {
					var sel_tbl = self.table_selector;
					self.settings.searchFilter.customFilters(sel_tbl, self);
				}
				if(typeof self.settings.searchFilter.initialSearch === 'function') {
					var sel_tbl = self.table_selector;
					self.settings.searchFilter.initialSearch(sel_tbl, self);
				}
			}



			// jeditable has failed me spectacularly, so I'll just bind my own dynamic edit boxes -_-
			$(document).delegate(self.container_selector + ' table tbody td', 'click touchstart touchend', function(event) {
				event.stopPropagation();

				$.each(self.settings.colSettings.commands, function(idx, command) {
					if($(event.target).hasClass(command.name)) {
						event.type = '';
					}
				});
				var table_cell = $(this);

				if(event.type == 'click') {
					// Add an input field inside the table cell with the cell's original value, if 2 things are true:
					// 1) The input box is not already open.  Otherwise, the .html() command will repeat and blank out the original value.
					// 2) This column is part of the editable columns for this table.
					var column_label = self.fnGetColumnLabel(this);
					if(table_cell.find('input, textarea').length < 1
						&& ((table_cell.closest('tr').find('button[name="save"]').length > 0
								&& self.settings.colSettings.editable.indexOf(column_label) != -1)
							|| self.settings.colSettings.editable.indexOf(column_label) != -1)) {

						var is_input_cell = true;
						if(typeof self.settings.colSettings.textareas === 'object') {
							$.each(self.settings.colSettings.textareas, function(idx, classname) {
								if(table_cell.hasClass(classname)) {
									is_input_cell = false;
									return false;
								}
							});
						}

						var original_value = table_cell.text();
						if(is_input_cell) {
							table_cell.html('<input changed="0" style="height:'
									+ (table_cell.innerHeight() - parseInt(table_cell.css('border-top-width'))) +
								'px;width:'
									+ (table_cell.innerWidth() - parseInt(table_cell.css('border-left-width'))) +
								'px;" value="' + original_value + '">');
						}
						else {
							var cell_coords = table_cell.position();
							table_cell.html(
								// '<textarea changed="0" style="resize:both;position:absolute;height:5em;width:20em;left:' + (cell_coords.left - (table_cell.innerWidth() * 0.1)) + 'px;top:' + (cell_coords.top - table_cell.innerHeight()) + 'px">'
								'<textarea changed="0" style="resize:both;position:absolute;height:5em;width:20em">'
								+ table_cell.text() + '</textarea>');
						}

						var new_edit_cell = table_cell.find('input, textarea');
						new_edit_cell.prop('original_value', original_value);
						new_edit_cell.select();
					}
				}
				else if(event.type == 'touchend') {
					if((new Date()).getTime() - self.clickSimulator.lastTouchStart < self.clickSimulator.touchDelay) {
						table_cell.click(); // simulate a click for touch-based mobile devices
					}
				}
				else if(event.type == 'touchstart') {
					self.clickSimulator.lastTouchStart = (new Date()).getTime();
				}

				table_cell.closest('tr').click();
			});

			// the user has clicked/tabbed outside of the input field for a table cell that was being edited
			$(document).delegate(
				self.container_selector + ' table tbody td input, ' + self.container_selector + ' table tbody td textarea, ' + self.container_selector + ' table tbody td select',
				'change focusout keydown',
				function(event)
			{
				event.stopPropagation();
				var cell_contains_select = $(this).is('select');
				if(!cell_contains_select && self.settings.colSettings.uneditable.indexOf(self.fnGetColumnLabel(this)) != -1) {
					return;
				}
				var table_cell = $(this).closest('td');
				var table_row = table_cell.closest('tr');
				var all_changes;

				if(event.type == 'focusout' || (event.type == 'change' && cell_contains_select)) {
					var column_name = self.fnGetColumnLabel(this);
					if($(this).is('textarea') || $(this).is('input')) {
						// var prev_value = this.defaultValue;
						// var prev_value = $(this).attr('value');
						var prev_value = $(this).prop('original_value');
					}
					else {
						var prev_value = -1;
						// return false;
					}

					var new_value = $(this).prop('value');
					if(!cell_contains_select) {
						table_cell.html($(this).prop('value')); // revert the table cell back to its usual non-input self
					}

					// self.updateCellAndProcessMutators(table_cell, $(this).attr('value'), $(this).prop('value'));
					if(prev_value != new_value) { // user has changed the table cell's value, update the database
						var id_cell = table_row.children().first();
						table_cell.addClass('status-red');

						if (typeof self.settings.updatePostBuilder === 'function') {
							var post = self.settings.updatePostBuilder(table_cell);
						}
						else {
							var post = {};
							post['id'] = id_cell.text();
							post[column_name] = new_value;
						}

						all_changes = self.fnMutate([table_cell], post, table_row);
						// if(!cell_contains_select && post['id'] != '-1save') {
						if(post['id'] != -1 && post['id'] != '-1save') {
							$.post(self.settings.save_url, post, function(data) {
								if(typeof self.settings.colSettings.fnUpdateCallback === 'function') {
									self.settings.colSettings.fnUpdateCallback(table_row, all_changes, data);
								}
								self.redisAdd([all_changes]);
							});
						}
					}
					else { // nothing was changed, leave it alone, but remove any color status css classes
						self.fnRemoveAllStatusColors(table_cell);
					}
				}

				else if (event.type == 'keydown') {
					// if([9,13,27,37,38,39,40].indexOf(event.which) != -1) {
					if([9,13,27,38,40].indexOf(event.which) != -1) {
						var next_column = [];
						if(event.which == 13) { // user pressed enter
							$(this).focusout();
							return false;
						}
						else if(event.which == 27) { // user pressed escape
							event.preventDefault();
							next_column = table_cell.prev();
							while(next_column.length > 0
							&& (next_column.css('display') == 'none'
								|| self.settings.colSettings.editable.indexOf(self.fnGetColumnLabel(next_column)) == -1)) {
								next_column = next_column.prev();
							}
						}
						else if(event.which == 38) { // user pressed up
							next_column = table_row.prev().find('td:nth-child(' + (table_cell.index() + 1) + ')');
						}
						else if(event.which == 9) { // user pressed tab
							event.preventDefault();
							next_column = table_cell.next();
							while(next_column.length > 0
							&& (next_column.css('display') == 'none'
								|| self.settings.colSettings.editable.indexOf(self.fnGetColumnLabel(next_column)) == -1)) {
								next_column = next_column.next();
							}
						}
						else if(event.which == 40) { // user pressed down
							next_column = table_row.next().find('td:nth-child(' + (table_cell.index() + 1) + ')');
						}

						if(next_column.length > 0) { // the user pressed a command that goes on to edit a nearby cell
							$(this).focusout(); // save this cell's changes
							next_column.click(); // start editing the nearby cell

							// does this table have a draggable and/or resizable wrapper?
							if(typeof self.settings.draggable !== 'undefined') {
								var scroll_area = $(self.settings.draggable);
								var scrollTop = next_column.offset().top + scroll_area.scrollTop() - (document.documentElement.clientHeight * 0.5);
								var scrollLeft = next_column.offset().left + scroll_area.scrollLeft() - (document.documentElement.clientWidth * 0.5);
							}
							else if(typeof self.settings.resizable !== 'undefined') {
								var scroll_area = $(self.settings.resizable);
								var scrollTop = next_column.offset().top + scroll_area.scrollTop() - (document.documentElement.clientHeight * 0.5);
								var scrollLeft = next_column.offset().left + scroll_area.scrollLeft() - (document.documentElement.clientWidth * 0.5);
							}
							else {
								var scroll_area = $('html, body');
								var scrollTop = next_column.offset().top - (document.documentElement.clientHeight * 0.5);
								var scrollLeft = next_column.offset().left - (document.documentElement.clientWidth * 0.5);
							}

							// center the browser window around the nearby cell
							scroll_area.animate({
								scrollTop: scrollTop,
								scrollLeft: scrollLeft
							}, 100);
						}
					}
				}
			});

			$(document).delegate(self.container_selector + ' table tbody td button[name="save"]', 'click', function(event) {

				var all_columns = {};
				var post = {};
				var current_select;
				var current_value;
				var row = $(this).closest('tr');

				row.find('td').each(function() {
					current_column_label = self.fnGetColumnLabel(this);
					current_select = $(this).find('select');
					if($(this).find('button[name="save"]').length > 0) {
						current_value = -1;
					}
					else if(current_select.length > 0) {
						current_select.change();
						current_value = current_select.find(':selected').text();
					}
					else {
						current_value = $(this).text();
					}

					// if(!$(this).hasClass('non-numeric') && current_value != null && current_value != '') {
					if(!$(this).hasClass('non-numeric')) {
						current_value = Number(current_value);
					}

					all_columns[current_column_label] = current_value;
					if(self.settings.colSettings.unsaveable.indexOf(current_column_label) == -1) {
						post[current_column_label] = current_value;
					}
					$(this).html(current_value);
				});

				$.post(self.settings.save_url, post, function(data) {
					all_columns['id'] = $.parseIntOr(data, -1);
					post['id'] = $.parseIntOr(data, -1);
					// $(self.table_selector).dataTable().fnUpdate(self.settings.colSettings.idCheckbox + parseInt(data), $(row)[0], 0);
					$.each(post, function(name, value) {
						$(self.table_selector).dataTable().fnUpdate(value, $(row)[0], self.fnGetColumnLabelIndex(name));
					});

					if(typeof self.settings.colSettings.fnCreateCallback === 'function') {
						self.settings.colSettings.fnCreateCallback($(row), post, data);
					}
					self.redisAdd([all_columns]);
				});
			});

			if(typeof self.settings.redis !== 'undefined') {
				self.redisPollInterval = $.parseIntOr(self.settings.redis.pollInterval, self.defaults.redisPollInterval);
				self.redisStart();
				if(typeof self.settings.redis.radar !== 'undefined') {
					$(self.settings.redis.radar).prop('disabled', true);
				}
			}

			var scroll_area = 'html, body';
			if(typeof self.settings.draggable !== 'undefined') {
				$(self.settings.draggable).draggable({ handles: 'n,e,s,w,se' });
				scroll_area = self.settings.draggable;
			}
			if(typeof self.settings.resizable !== 'undefined') {
				var table_container = $(self.settings.resizable);
				table_container.resizable({ handles: 'n,e,s,w,se' });

				if(typeof self.settings.resizableHeightPadding !== 'undefined') {
					var height_padding = self.settings.resizableHeightPadding;
				}
				else {
					var height_padding = 0;
				}
				if(typeof self.settings.resizableWidthPadding !== 'undefined') {
					var width_padding = self.settings.resizableWidthPadding;
				}
				else {
					var width_padding = 0;
				}

				table_container.css('height', document.documentElement.clientHeight - table_container.offset().top - height_padding);
				table_container.css('width', document.documentElement.clientWidth - table_container.offset().left - width_padding);

				var icon = $(self.settings.resizable + ' .ui-resizable-se');
				var icon_outline_width = parseInt(icon.css('outline-width'));
				icon.css('left', table_container.scrollLeft() + table_container.innerWidth() - (icon.outerWidth() * 2));
				icon.css('top', table_container.scrollTop() + table_container.innerHeight() - (icon.outerHeight() * 2));
				icon.attr('title', 'click and drag to resize');

				table_container.on('resize scroll', function(event) {
					icon.css('left', $(this).scrollLeft() + $(this).innerWidth() - (icon.outerWidth() * 2));
					icon.css('top', $(this).scrollTop() + $(this).innerHeight() - (icon.outerHeight() * 2));
				});

				scroll_area = self.settings.resizable;
			}

			$(scroll_area).attr("tabindex", -1).focus();
			$('html, body').scrollTop(0);
			if(scroll_area != 'html, body') {
				$(document).delegate(scroll_area, 'mouseenter', function(event) {
					if(!$(document.activeElement).is('select') && $(scroll_area).find('input[type!="checkbox"], textarea').length < 1) {
						$(scroll_area).focus();
					}
				});
			}



			$(self.container_selector)[0].yugTable =  self;
		}
	});
};

// DataTables - sorting of numeric + HTML columns (HTML gets ignored)
$.extend($.fn.dataTableExt.oSort, {
    "num-html-pre": function ( a ) {
        var x = String(a).replace( /<[\s\S]*?>/g, "" );
        return parseFloat( x );
    },
 
    "num-html-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "num-html-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

$.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings) {
	if(oSettings.oFeatures.bServerSide === false){
		var before = oSettings._iDisplayStart;

		oSettings.oApi._fnReDraw(oSettings);

		// iDisplayStart has been reset to zero - so lets change it back
		oSettings._iDisplayStart = before;
		oSettings.oApi._fnCalculateEnd(oSettings);
	}
	  
	// draw the 'current' page
	oSettings.oApi._fnDraw(oSettings);
};

$.cloneObj = function(obj) {
	var new_obj = {};
	for (key in obj) { // clone object members
		if(obj.hasOwnProperty(key)) {
			new_obj[key] = obj[key];
		}
	}
	return new_obj;
};

$.getKeyByValue = function(value, obj) {
    for( var prop in obj ) {
        if( obj.hasOwnProperty( prop ) ) {
             if( obj[ prop ] === value )
                 return prop;
        }
    }
};

$.addParamsToLocationBar = function(new_params) {
	var new_location = location.href;
	var query_string = location.search;
	var old_params = $.getURLParams();
	new_location = new_location.replace(location.search, '');

	window.history.pushState(new_location + '?' + $.param($.extend(old_params, new_params)),"", new_location + '?' + $.param($.extend(old_params, new_params)));
};

$.getURLParams = function() {
	if(location.search != '') {
		return JSON.parse('{"' + decodeURI(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	}
	else {
		return {};
	}
};



// source: http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
$.capitalize = function(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// source - http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
// test cases - http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
$.isNumber = function(n) {
	if(n == null) {
		var str = 'null';
	}
	else if(typeof n === 'object') {
		var str = n.text();
	}
	else {
		var str = n;
	}
	return !isNaN(parseFloat(str)) && isFinite(str);
};

$.parseFloatOr = function(n, d, decimals) {
	if(n == null && typeof d === 'undefined') {
		return n;
	}
	parsedVal = parseFloat(('' + n).replace(/[^0-9\.\-]+/g,""));
	if($.isNumber(parsedVal)) {
		n = parsedVal;
		if(typeof decimals !== 'undefined') {
			n = n.toFixed(parseInt(decimals));
		}
	}
	else {
		n = d;
	}

	return n;
};

$.parseIntOr = function(n, d) {
	if(n == null && typeof d === 'undefined') {
		return n;
	}
	parsedVal = parseInt(('' + n).replace(/[^0-9\.\-]+/g,""));
	if($.isNumber(parsedVal)) {
		return parsedVal;
	}
	else {
		return d;
	}
};

$.setNonNumericToZero = function(n) {
	if($.isNumber(n)) {
		return n;
	}
	else {
		return 0;
	}
};

$.convertDateToYMDHMS = function(d) {
	return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
		+ '_' + d.getHours() + 'h' + d.getMinutes() + 'm' + d.getSeconds() + 's';
}

$.checkForNullString = function(str, nullstr) {
	if(typeof nullstr === 'undefined') {
		nullstr = '';
	}
	if(str) {
		return str;
	}
	else {
		return nullstr;
	}
}

/* This little gem is from:
* http://stackoverflow.com/questions/1354064/how-to-convert-characters-to-html-entities-using-plain-javascript
*
* This conversion is necessary because DataTables does not support unicode/UTF8.
* And either way, it's good practice to escape unicode/UTF8 (euro sign, trademark, etc) and HTML entities (<, >, etc).
*/
$.escapeHtmlEntities = function (text) {
	return text.replace(/[\u00A0-\u2666<>\&]/g, function(c) {
		return '&' + ($.escapeHtmlEntities.entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0)) + ';';
	});
};
$.escapeHtmlEntitiesNoAlias = function (text) {
	return '&' + ('#'+c.charCodeAt(0)) + ';';
};
// all HTML4 entities as defined here: http://www.w3.org/TR/html4/sgml/entities.html
$.escapeHtmlEntities.entityTable = {
	34 : 'quot', 
	38 : 'amp', 
	39 : 'apos', 
	60 : 'lt', 
	62 : 'gt', 
	160 : 'nbsp', 
	161 : 'iexcl', 
	162 : 'cent', 
	163 : 'pound', 
	164 : 'curren', 
	165 : 'yen', 
	166 : 'brvbar', 
	167 : 'sect', 
	168 : 'uml', 
	169 : 'copy', 
	170 : 'ordf', 
	171 : 'laquo', 
	172 : 'not', 
	173 : 'shy', 
	174 : 'reg', 
	175 : 'macr', 
	176 : 'deg', 
	177 : 'plusmn', 
	178 : 'sup2', 
	179 : 'sup3', 
	180 : 'acute', 
	181 : 'micro', 
	182 : 'para', 
	183 : 'middot', 
	184 : 'cedil', 
	185 : 'sup1', 
	186 : 'ordm', 
	187 : 'raquo', 
	188 : 'frac14', 
	189 : 'frac12', 
	190 : 'frac34', 
	191 : 'iquest', 
	192 : 'Agrave', 
	193 : 'Aacute', 
	194 : 'Acirc', 
	195 : 'Atilde', 
	196 : 'Auml', 
	197 : 'Aring', 
	198 : 'AElig', 
	199 : 'Ccedil', 
	200 : 'Egrave', 
	201 : 'Eacute', 
	202 : 'Ecirc', 
	203 : 'Euml', 
	204 : 'Igrave', 
	205 : 'Iacute', 
	206 : 'Icirc', 
	207 : 'Iuml', 
	208 : 'ETH', 
	209 : 'Ntilde', 
	210 : 'Ograve', 
	211 : 'Oacute', 
	212 : 'Ocirc', 
	213 : 'Otilde', 
	214 : 'Ouml', 
	215 : 'times', 
	216 : 'Oslash', 
	217 : 'Ugrave', 
	218 : 'Uacute', 
	219 : 'Ucirc', 
	220 : 'Uuml', 
	221 : 'Yacute', 
	222 : 'THORN', 
	223 : 'szlig', 
	224 : 'agrave', 
	225 : 'aacute', 
	226 : 'acirc', 
	227 : 'atilde', 
	228 : 'auml', 
	229 : 'aring', 
	230 : 'aelig', 
	231 : 'ccedil', 
	232 : 'egrave', 
	233 : 'eacute', 
	234 : 'ecirc', 
	235 : 'euml', 
	236 : 'igrave', 
	237 : 'iacute', 
	238 : 'icirc', 
	239 : 'iuml', 
	240 : 'eth', 
	241 : 'ntilde', 
	242 : 'ograve', 
	243 : 'oacute', 
	244 : 'ocirc', 
	245 : 'otilde', 
	246 : 'ouml', 
	247 : 'divide', 
	248 : 'oslash', 
	249 : 'ugrave', 
	250 : 'uacute', 
	251 : 'ucirc', 
	252 : 'uuml', 
	253 : 'yacute', 
	254 : 'thorn', 
	255 : 'yuml', 
	402 : 'fnof', 
	913 : 'Alpha', 
	914 : 'Beta', 
	915 : 'Gamma', 
	916 : 'Delta', 
	917 : 'Epsilon', 
	918 : 'Zeta', 
	919 : 'Eta', 
	920 : 'Theta', 
	921 : 'Iota', 
	922 : 'Kappa', 
	923 : 'Lambda', 
	924 : 'Mu', 
	925 : 'Nu', 
	926 : 'Xi', 
	927 : 'Omicron', 
	928 : 'Pi', 
	929 : 'Rho', 
	931 : 'Sigma', 
	932 : 'Tau', 
	933 : 'Upsilon', 
	934 : 'Phi', 
	935 : 'Chi', 
	936 : 'Psi', 
	937 : 'Omega', 
	945 : 'alpha', 
	946 : 'beta', 
	947 : 'gamma', 
	948 : 'delta', 
	949 : 'epsilon', 
	950 : 'zeta', 
	951 : 'eta', 
	952 : 'theta', 
	953 : 'iota', 
	954 : 'kappa', 
	955 : 'lambda', 
	956 : 'mu', 
	957 : 'nu', 
	958 : 'xi', 
	959 : 'omicron', 
	960 : 'pi', 
	961 : 'rho', 
	962 : 'sigmaf', 
	963 : 'sigma', 
	964 : 'tau', 
	965 : 'upsilon', 
	966 : 'phi', 
	967 : 'chi', 
	968 : 'psi', 
	969 : 'omega', 
	977 : 'thetasym', 
	978 : 'upsih', 
	982 : 'piv', 
	8226 : 'bull', 
	8230 : 'hellip', 
	8242 : 'prime', 
	8243 : 'Prime', 
	8254 : 'oline', 
	8260 : 'frasl', 
	8472 : 'weierp', 
	8465 : 'image', 
	8476 : 'real', 
	8482 : 'trade', 
	8501 : 'alefsym', 
	8592 : 'larr', 
	8593 : 'uarr', 
	8594 : 'rarr', 
	8595 : 'darr', 
	8596 : 'harr', 
	8629 : 'crarr', 
	8656 : 'lArr', 
	8657 : 'uArr', 
	8658 : 'rArr', 
	8659 : 'dArr', 
	8660 : 'hArr', 
	8704 : 'forall', 
	8706 : 'part', 
	8707 : 'exist', 
	8709 : 'empty', 
	8711 : 'nabla', 
	8712 : 'isin', 
	8713 : 'notin', 
	8715 : 'ni', 
	8719 : 'prod', 
	8721 : 'sum', 
	8722 : 'minus', 
	8727 : 'lowast', 
	8730 : 'radic', 
	8733 : 'prop', 
	8734 : 'infin', 
	8736 : 'ang', 
	8743 : 'and', 
	8744 : 'or', 
	8745 : 'cap', 
	8746 : 'cup', 
	8747 : 'int', 
	8756 : 'there4', 
	8764 : 'sim', 
	8773 : 'cong', 
	8776 : 'asymp', 
	8800 : 'ne', 
	8801 : 'equiv', 
	8804 : 'le', 
	8805 : 'ge', 
	8834 : 'sub', 
	8835 : 'sup', 
	8836 : 'nsub', 
	8838 : 'sube', 
	8839 : 'supe', 
	8853 : 'oplus', 
	8855 : 'otimes', 
	8869 : 'perp', 
	8901 : 'sdot', 
	8968 : 'lceil', 
	8969 : 'rceil', 
	8970 : 'lfloor', 
	8971 : 'rfloor', 
	9001 : 'lang', 
	9002 : 'rang', 
	9674 : 'loz', 
	9824 : 'spades', 
	9827 : 'clubs', 
	9829 : 'hearts', 
	9830 : 'diams', 
	338 : 'OElig', 
	339 : 'oelig', 
	352 : 'Scaron', 
	353 : 'scaron', 
	376 : 'Yuml', 
	710 : 'circ', 
	732 : 'tilde', 
	8194 : 'ensp', 
	8195 : 'emsp', 
	8201 : 'thinsp', 
	8204 : 'zwnj', 
	8205 : 'zwj', 
	8206 : 'lrm', 
	8207 : 'rlm', 
	8211 : 'ndash', 
	8212 : 'mdash', 
	8216 : 'lsquo', 
	8217 : 'rsquo', 
	8218 : 'sbquo', 
	8220 : 'ldquo', 
	8221 : 'rdquo', 
	8222 : 'bdquo', 
	8224 : 'dagger', 
	8225 : 'Dagger', 
	8240 : 'permil', 
	8249 : 'lsaquo', 
	8250 : 'rsaquo', 
	8364 : 'euro'
};

$.escapeHtmlEntitiesXMLFriendly = function(text) {
	return text.replace(/[\u00A0-\u2666<>\&]/g, function(c) {
		if([34,38,39,60,62,160].indexOf(c.charCodeAt(0)) == -1) {
			return ' ';
		}
		else {
			return '&' + ($.escapeHtmlEntities.entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0)) + ';';
		}
	});
};