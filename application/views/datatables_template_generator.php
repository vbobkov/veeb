<ul>

<div class="title1">Configuration/Template Generator for <a target="_blank" href="http://datatables.net">DataTables.js</a></div>
<li>Includes a preview section at the bottom of this page.</li>
<li>There's eventually going to be a <a target="_blank" href="http://en.wikipedia.org/wiki/Metric_ton">metric ton</a> of options, so I have split this up into toggle-able sections.  Click on a tab to show/edit settings for that section</li>
<li>(Note to self: I'm going to probably go insane figuring out a way to add <a target="_blank" href="https://datatables.net/examples/basic_init/dom.html">sDom</a> editing, without making it illegible. Oh well.)</li>

<div id="gen-wrapper">
	<form id="example-config">
		<div class="example-config-section-wrapper">
			<div class="title4 title4_off">Data Source</div>
			<div class="example-config-section">
				<div class="dataSource-wrapper">
					<span>Source Type:</span><br />
					<input id="dataSource-type-1" type="radio" name="dataSource-type" value="json">
					<label for="dataSource-type-1">Ajax source (JSON)</label><br />
					<!--
					<input id="dataSource-type-2" type="radio" name="dataSource-type" value="serverside">
					<label for="dataSource-type-2">Server side processing</label><br />
					-->
					<input id="dataSource-type-3" type="radio" name="dataSource-type" value="array">
					<label for="dataSource-type-3">Javascript array</label><br />
					<input id="dataSource-type-4" type="radio" name="dataSource-type" value="dom">
					<label for="dataSource-type-4">DOM (existing HTML data)</label><br />

					<label class="toggle dataSource-array-label">data:</label>
					<textarea class="dataSource-array" value="" wrap="off">
[
	["Trident","Internet Explorer 4.0","Win 95+","4","X"],
	["Trident","Internet Explorer 5.0","Win 95+","5","C"],
	["Trident","Internet Explorer 5.5","Win 95+","5.5","A"],
	["Trident","Internet Explorer 6","Win 98+","6","A"],
	["Trident","Internet Explorer 7","Win XP SP2+","7","A"],
	["Trident","AOL browser (AOL desktop)","Win XP","6","A"],
	["Gecko","Firefox 1.0","Win 98+ / OSX.2+","1.7","A"],
	["Gecko","Firefox 1.5","Win 98+ / OSX.2+","1.8","A"],
	["Gecko","Firefox 2.0","Win 98+ / OSX.2+","1.8","A"],
	["Gecko","Firefox 3.0","Win 2k+ / OSX.3+","1.9","A"],
	["Gecko","Camino 1.0","OSX.2+","1.8","A"],
	["Gecko","Camino 1.5","OSX.3+","1.8","A"],
	["Gecko","Netscape 7.2","Win 95+ / Mac OS 8.6-9.2","1.7","A"],
	["Gecko","Netscape Browser 8","Win 98SE+","1.7","A"],
	["Gecko","Netscape Navigator 9","Win 98+ / OSX.2+","1.8","A"],
	["Gecko","Mozilla 1.0","Win 95+ / OSX.1+",1,"A"],
	["Gecko","Mozilla 1.1","Win 95+ / OSX.1+",1.1,"A"],
	["Gecko","Mozilla 1.2","Win 95+ / OSX.1+",1.2,"A"],
	["Gecko","Mozilla 1.3","Win 95+ / OSX.1+",1.3,"A"],
	["Gecko","Mozilla 1.4","Win 95+ / OSX.1+",1.4,"A"],
	["Gecko","Mozilla 1.5","Win 95+ / OSX.1+",1.5,"A"],
	["Gecko","Mozilla 1.6","Win 95+ / OSX.1+",1.6,"A"],
	["Gecko","Mozilla 1.7","Win 98+ / OSX.1+",1.7,"A"],
	["Gecko","Mozilla 1.8","Win 98+ / OSX.1+",1.8,"A"],
	["Gecko","Seamonkey 1.1","Win 98+ / OSX.2+","1.8","A"],
	["Gecko","Epiphany 2.20","Gnome","1.8","A"],
	["Webkit","Safari 1.2","OSX.3","125.5","A"],
	["Webkit","Safari 1.3","OSX.3","312.8","A"],
	["Webkit","Safari 2.0","OSX.4+","419.3","A"],
	["Webkit","Safari 3.0","OSX.4+","522.1","A"],
	["Webkit","OmniWeb 5.5","OSX.4+","420","A"],
	["Webkit","iPod Touch / iPhone","iPod","420.1","A"],
	["Webkit","S60","S60","413","A"],
	["Presto","Opera 7.0","Win 95+ / OSX.1+","-","A"],
	["Presto","Opera 7.5","Win 95+ / OSX.2+","-","A"],
	["Presto","Opera 8.0","Win 95+ / OSX.2+","-","A"],
	["Presto","Opera 8.5","Win 95+ / OSX.2+","-","A"],
	["Presto","Opera 9.0","Win 95+ / OSX.3+","-","A"],
	["Presto","Opera 9.2","Win 88+ / OSX.3+","-","A"],
	["Presto","Opera 9.5","Win 88+ / OSX.3+","-","A"],
	["Presto","Opera for Wii","Wii","-","A"],
	["Presto","Nokia N800","N800","-","A"],
	["Presto","Nintendo DS browser","Nintendo DS","8.5","C/A<sup>1</sup>"],
	["KHTML","Konqureror 3.1","KDE 3.1","3.1","C"],
	["KHTML","Konqureror 3.3","KDE 3.3","3.3","A"],
	["KHTML","Konqureror 3.5","KDE 3.5","3.5","A"],
	["Tasman","Internet Explorer 4.5","Mac OS 8-9","-","X"],
	["Tasman","Internet Explorer 5.1","Mac OS 7.6-9","1","C"],
	["Tasman","Internet Explorer 5.2","Mac OS 8-X","1","C"],
	["Misc","NetFront 3.1","Embedded devices","-","C"],
	["Misc","NetFront 3.4","Embedded devices","-","A"],
	["Misc","Dillo 0.8","Embedded devices","-","X"],
	["Misc","Links","Text only","-","X"],
	["Misc","Lynx","Text only","-","X"],
	["Misc","IE Mobile","Windows Mobile 6","-","C"],
	["Misc","PSP browser","PSP","-","C"],
	["Other browsers","All others","-","-","U"]
]</textarea>

					<label class="toggle dataSource-headers-label">headers:</label>
					<textarea class="dataSource-headers" value="" wrap="on">
["Engine", "Browser", "Platform", "Version", "Grade"]</textarea>

					<label class="toggle dataSource-json-url-label">JSON URL:</label>
					<input class="dataSource-json-url" type="text" value="/assets/examples/datatables_json_example.txt">

					<label class="toggle dataSource-url-label">URL:</label>
					<input class="dataSource-url" type="text" value="/shenanigans/datatables_example_serverside">

					<label class="toggle dataSource-dom-label">Table HTML:</label>
					<textarea class="dataSource-dom" value="" wrap="off">
<thead>
	<tr>
		<th>Engine</th>
		<th>Browser</th>
		<th>Platform</th>
		<th>Version</th>
		<th>Grade</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>Trident</td>
		<td>Internet Explorer 4.0</td>
		<td>Win 95+</td>
		<td>4</td>
		<td>X</td>
	</tr>
	<tr>
		<td>Trident</td>
		<td>Internet Explorer 5.0</td>
		<td>Win 95+</td>
		<td>5</td>
		<td>C</td>
	</tr>
	<tr>
		<td>Trident</td>
		<td>Internet Explorer 5.5</td>
		<td>Win 95+</td>
		<td>5.5</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Trident</td>
		<td>Internet Explorer 6.0</td>
		<td>Win 98+</td>
		<td>6</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Trident</td>
		<td>Internet Explorer 7.0</td>
		<td>Win XP SP2+</td>
		<td>7</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Gecko</td>
		<td>Firefox 1.5</td>
		<td>Win 98+ / OSX.2+</td>
		<td>1.8</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Gecko</td>
		<td>Firefox 2</td>
		<td>Win 98+ / OSX.2+</td>
		<td>1.8</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Gecko</td>
		<td>Firefox 3</td>
		<td>Win 2k+ / OSX.3+</td>
		<td>1.9</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Webkit</td>
		<td>Safari 1.2</td>
		<td>OSX.3</td>
		<td>125.5</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Webkit</td>
		<td>Safari 1.3</td>
		<td>OSX.3</td>
		<td>312.8</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Webkit</td>
		<td>Safari 2.0</td>
		<td>OSX.4+</td>
		<td>419.3</td>
		<td>A</td>
	</tr>
	<tr>
		<td>Webkit</td>
		<td>Safari 3.0</td>
		<td>OSX.4+</td>
		<td>522.1</td>
		<td>A</td>
	</tr>
</tbody></textarea>
				</div>
			</div>
		</div>
		<div class="example-config-section-wrapper">
			<div class="title4 title4_off">Common Flags</div>
			<div class="example-config-section">
				<input id="processing-indicator-1" class="bProcessing" type="checkbox" name="processing-indicator">
				<label for="processing-indicator-1">Processing Indicator</label><br />
			</div>
		</div>
		<div class="example-config-section-wrapper">
			<div class="title4 title4_off">Pagination</div>
			<div class="example-config-section">
				<div class="aLengthMenu-wrapper">
					<span>Page Lengths:</span><input class="aLengthMenu" type="text" value="" disabled><br />
					<input id="page-lengths-1" type="radio" name="page-lengths" value="10,25,50,100" checked="checked">
					<label for="page-lengths-1">Default (10,25,50,100)</label><br />
					<input id="page-lengths-2" type="radio" name="page-lengths" value="10,100,1000,10000">
					<label for="page-lengths-2">10,100,1000,10000</label><br />
					<input id="page-lengths-3" type="radio" name="page-lengths" value="10,25,50,100,200,500,1000,2000,10000">
					<label for="page-lengths-3">10,25,50,100,200,500,1000,2000,10000</label><br />
					<input id="page-lengths-4" type="radio" name="page-lengths" value="custom">
					<label for="page-lengths-4">Custom</label><br />
				</div>
				<br />
				<span>Navigation Type:</span>
				<select class="sPaginationType">
					<option value="two_button">Two Button</option>
					<option value="full_numbers">Full Numbers</option>
				</select>
			</div>
		</div>
		<div class="example-config-section-wrapper">
			<div class="title4 title4_off">Table Styling (CSS)</div>
			<div class="example-config-section">
				<textarea id="example-style" autocomplete="off" wrap="off"></textarea><br />
			</div>
		</div>
		<br /><input type="submit" value="Generate Code">
	</form>

	<div id="example-code">
	</div>
	<br /><br />

	<div class="title3" id="preview-title">Preview</div><br />
	<div id="example-wrapper">
		<table id="example"></table>
	</div>
</div>



<script type="text/javascript">
	function readConfig(config, form) {
		var dataSource = $('#example-config .dataSource-wrapper input[name="dataSource-type"]:checked').prop('value');
		var dataSource_headers = JSON.parse($('#example-config .dataSource-headers').val());
		config.aoColumns = [];
		if(dataSource == 'array') {
			var data_array = $('#example-config .dataSource-array');
			config.aaData = JSON.parse(data_array.val());
		}
		else if(dataSource == 'json') {
			config.sAjaxSource = $('#example-config .dataSource-json-url').prop('value');
		}
		else if(dataSource == 'serverside') {
			config.bServerSide = true;
			config.bProcessing = true;
			config.sAjaxSource = $('#example-config .dataSource-url').prop('value');
		}
		else {
			dataSource_headers = [];
			delete config.aoColumns;
			$('#example').html('');
			$('#example').html($('#example-config .dataSource-dom').val());
		}
		if(dataSource_headers.length > 0) {
			$.each(dataSource_headers, function(idx, header) {
				config.aoColumns.push({"sTitle": header});
			});
		}

		if(form.find('.bProcessing').prop('checked') == true) {
			config.bProcessing = form.find('.bProcessing').prop('checked');
		}

		if(form.find('.aLengthMenu').prop('value') != '') {
			config.aLengthMenu = form.find('.aLengthMenu').prop('value').replace(/ /g, '').split(',');
		}
		if(form.find('.sPaginationType option:selected').attr('value') != 'two_button') {
			config.sPaginationType = form.find('.sPaginationType option:selected').attr('value');
		}
	};



	$(document).ready(function() {
		var example_style = '#example {\n\
	border-collapse: collapse;\n\
}\n\
\n\
#example td,\n\
#example th {\n\
	border: 1px solid rgb(0,0,0);\n\
}\n\
\n\
#example td {\n\
}\n\
\n\
#example th {\n\
	background-color: rgb(96,224,96);\n\
	cursor: pointer;\n\
	min-width: 10em;\n\
}\n\
#example th:hover {\n\
	background-color: rgb(64,192,64);\n\
}\n\
\n\
#example tr:nth-child(even) {\n\
	background-color: rgb(224,255,224);\n\
}\n\
\n\
#example tr:nth-child(odd) {\n\
	background-color: rgb(240,255,240);\n\
}\n\
\n\
#example th.sorting_asc:after {\n\
	content: "\\25B2";\n\
}\n\
\n\
#example th.sorting_desc:after {\n\
	content: "\\25BC";\n\
}\n\
\n\
.dataTables_paginate a {\n\
	background-color: rgb(96,224,96);\n\
	border: 1px solid black;\n\
	cursor: pointer;\n\
	margin: 0em 0.25em 0em 0.25em;\n\
	padding: 0em 0.25em 0em 0.25em;\n\
}\n\
\n\
.dataTables_paginate a:hover {\n\
	background-color: rgb(64,192,64);\n\
}';

		if($('#example-style').html() == '') {
			$('#example-style').html(example_style);
		}

		// http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
		$("textarea").keydown(function(e) {
			if(e.keyCode === 9) { // tab was pressed
				// get caret position/selection
				var start = this.selectionStart;
				var end = this.selectionEnd;

				var $this = $(this);
				var value = $this.val();

				// set textarea value to: text before caret + tab + text after caret
				$this.val(value.substring(0, start)
							+ "\t"
							+ value.substring(end));

				// put caret at right position again (add one for the tab)
				this.selectionStart = this.selectionEnd = start + 1;

				// prevent the focus lose
				e.preventDefault();
			}
		});

		$(document).undelegate('#example-config .dataSource-wrapper input[type="radio"]', 'click');
		$(document).delegate('#example-config .dataSource-wrapper input[type="radio"]', 'click', function(event) {
			$('#example-config .dataSource-wrapper input[type!="radio"], #example-config .dataSource-wrapper textarea, #example-config .dataSource-wrapper label').css('display', '');
			if($(this).prop('value') == 'array') {
				$('#example-config .dataSource-array').css('display', 'inline');
				$('#example-config .dataSource-headers').css('display', 'inline');
				$('#example-config .dataSource-array-label').css('display', 'block');
				$('#example-config .dataSource-headers-label').css('display', 'block');
			}
			else if($(this).prop('value') == 'json') {
				$('#example-config .dataSource-json-url').css('display', 'inline');
				$('#example-config .dataSource-json-url-label').css('display', 'block');
			}
			else if($(this).prop('value') == 'serverside') {
				$('#example-config .dataSource-url').css('display', 'inline');
				$('#example-config .dataSource-url-label').css('display', 'block');
			}
			else {
				$('#example-config .dataSource-dom').css('display', 'inline');
				$('#example-config .dataSource-dom-label').css('display', 'block');
			}
		});
		$('#example-config .dataSource-wrapper input[name="dataSource-type"]:first').click();

		$(document).undelegate('#example-config .aLengthMenu-wrapper input[type="radio"]', 'click');
		$(document).delegate('#example-config .aLengthMenu-wrapper input[type="radio"]', 'click', function(event) {
			if($(this).prop('value') == 'custom') {
				$('#example-config .aLengthMenu').attr('disabled', false);
				$('#example-config .aLengthMenu').prop('value', '');
				$('#example-config .aLengthMenu').focus();
			}
			else {
				$('#example-config .aLengthMenu').attr('disabled', true);
				$('#example-config .aLengthMenu').prop('value', $(this).prop('value'));
			}
		});

		$(document).undelegate('#example-config .title4', 'click');
		$(document).delegate('#example-config .title4', 'click', function(event) {
			var config_section = $(this).closest('.example-config-section-wrapper').find('.example-config-section');
			if(config_section.css('display') != 'none') {
				config_section.css('display', 'none');
				$(this).removeClass('title4_on');
				$(this).addClass('title4_off');
			}
			else {
				config_section.css('display', 'block');
				$(this).removeClass('title4_off');
				$(this).addClass('title4_on');
			}
		});

		// the user has clicked the Generate button
		$(document).undelegate('#example-config', 'submit');
		$(document).delegate('#example-config', 'submit', function(event) {
			event.preventDefault();
			event.stopPropagation();
			var config = {};
			readConfig(config, $('#example-config'));

			if($('#example-style-css').length > 0) {
				$('#example-style-css').remove();
			}
			$('head').append('<style type="text/css" id="example-style-css">' + $('#example-style').val() + '</style>');

			// confusing string manipulations and 1337 r3g3x h4x, to make copy/paste code output look neat
			$('#preview-title').css('display', 'inline-block');
			$('#example-code').html('');
			var config_string = '\t\t\t' + JSON.stringify(config, null, '\t').split('\n').join('\n\t\t\t');
			var table_html_string = '\t\t' + $('#example').html().split('\n').join('\n\t\t');
			if(table_html_string == '\t\t') {
				table_html_string = '';
			}
			else {
				table_html_string += '\n';
			}
			var example_code =
'<div id="example-wrapper">\n\
	<table id="example">\n'
	+  table_html_string + '\
	</table>\n\
</div>\n\
<script type="text/javascript">\n\
	$(document).ready(function() {\n\
		$(\'#example\').dataTable(\n'
			+ config_string + '\n\
		);\n\
	});\n\
<\/script>\n\n\
<style type="text/css" id="example-style-css">\n' + $('#example-style-css').html() + '\n</style>\n\n';
			example_code = replaceGTLT(example_code);
			$('#example-code').html('<div class="title3">Code</div><pre class="prettyprint lang-html replace-gtlt">' + example_code + '</pre>');
			prettyPrint();
			$('#example-code .replace-gtlt').each(function(event) {
				$(this).html($(this).html().replace(/\<span class=\"com\"\>\#example/g, '<span class="pln">#example'));
			});

			$('#example-wrapper').css('display', 'inline-block');
			if($('#example').dataTableSettings.length > 0) {
				$('#example').dataTable().fnDestroy();
			}
			$('#example').dataTable(config);
		});
	});
</script>

</ul>
