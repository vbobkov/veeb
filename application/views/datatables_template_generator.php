<ul>

<div class="title1">Configuration/Template Generator for <a target="_blank" href="http://datatables.net">DataTables.js</a></div>

<pre class="prettyprint lang-html">
</pre>

<style>
	#example {
		border-collapse: collapse;
	}

	#example td,
	#example th	{
		border: 1px solid rgb(0,0,0);
	}

	#example td {
	}

	#example th {
		background-color: rgb(96,224,96);
		cursor: pointer;
		min-width: 10em;
	}
	#example th:hover {
		background-color: rgb(64,192,64);
	}

	#example tr:nth-child(even) {
		background-color: rgb(224,255,224);
	}

	#example tr:nth-child(odd) {
		background-color: rgb(240,255,240);
	}

	#example th.sorting_asc:after {
		content: "\25B2";
	}

	#example th.sorting_desc:after {
		content: "\25BC";
	}

	.dataTables_paginate a {
		background-color: rgb(96,224,96);
		border: 1px solid black;
		cursor: pointer;
		margin: 0em 0.25em 0em 0.25em;
		padding: 0em 0.25em 0em 0.25em;
	}

	.dataTables_paginate a:hover {
		background-color: rgb(64,192,64);
	}
</style>
<div id="example-wrapper">
	<table id="example">
	</table>
</div>
<script type="text/javascript">
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

	$(document).ready(function() {
		$('#example').dataTable(config);
	});
</script>

</ul>
