<ul>

<div class="title1">Configuration/Template Generator for <a target="_blank" href="http://datatables.net">DataTables.js</a></div>

<div id="gen-wrapper">
	<form id="example-config">
		<div class="example-config-section">
			<div class="title">Table CSS</div>
			<textarea id="example-style" autocomplete="off"></textarea><br />
		</div>
		<input type="submit" value="Generate">
	</form>

	<div id="example-code">
	</div>

	<div class="title2">Preview</div><br />
	<div id="example-wrapper">
		<table id="example">
		</table>
	</div>
</div>



<script type="text/javascript">
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

		var config = {
			"sAjaxSource": '/assets/uploads/datatables_json_example.txt',
			"aoColumns": [
				{ "sTitle": "Engine" },
				{ "sTitle": "Browser" },
				{ "sTitle": "Platform" },
				{ "sTitle": "Version", "sClass": "center" },
				{ "sTitle": "Grade", "sClass": "center" }
			]
			// aaData: [],
			// aoColumns: []
			// aLengthMenu: [10, 25, 50, 100],
			// bAutoWidth: false,
			// bDeferRender: true,
			// bProcessing: true,
			// bSortClasses: false,
			// iDisplayLength: 50,
			// sDom: '<"acmedb-widget regular-commands"l<"YugCommand2"><"YugCommand3">f><><"acmedb-widget magento-commands"<"magento-commands2">><"acmedb-widget google-commands"<"google-commands2">><><"acmedb-widget amazon-commands"<"amazon-commands2">><"clear-floats">pir<"products-table-wrapper"t>',
			// sPaginationType: 'full_numbers'
		};

		if($('#example-style').html() == '') {
			$('#example-style').html(example_style);
		}

		// the user has clicked the Generate button
		$(document).delegate('#example-config', 'submit', function(event) {
			event.preventDefault();
			event.stopPropagation();

			if($('#example-style-css').length > 0) {
				$('#example-style-css').remove();
			}
			$('head').append('<style type="text/css" id="example-style-css">' + $('#example-style').val() + '</style>');

			if($('#example').dataTableSettings.length > 0) {
				$('#example').dataTable().fnDestroy();
			}
			$('#example').dataTable(config);

			// confusing string manipulations and 1337 r3g3x h4x, to make copy/paste code output look neat
			$('#example-code').html('');
			var config_string = '\t\t\t' + JSON.stringify(config, null, '\t').split('\n').join('\n\t\t\t');
			var example_code =
'<style type="text/css" id="example-style-css">\n' + $('#example-style-css').html() + '\n</style>\n\n\
&lt;script type="text/javascript"&gt;\n\
	$(document).ready(function() {\n\
		$(\'#example\').dataTable(\n\
' + config_string + '\n\
		);\n\
	});\n\
&lt;/script&gt;';
			example_code = replace_gtlt(example_code);
			$('#example-code').html('<pre class="prettyprint lang-html replace-gtlt">' + example_code + '</pre>');
			prettyPrint();
			$('#example-code .replace-gtlt').each(function(event) {
				$(this).html($(this).html().replace(/\<span class=\"com\"\>\#example/g, '<span class="pln">#example'));
			});
		});
	});
</script>

</ul>
