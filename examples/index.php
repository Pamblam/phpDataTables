<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>phpDataTables Test</title>
		<link href="../node_modules/datatables/media/css/jquery.dataTables.min.css" rel="stylesheet">
    </head>
    <body>
<!--		<div id="datatable"></div>-->
<table id="datatable"><thead><tr><th>a</th><th>b</th><th>c</th></tr></thead><tfoot><tr><th>a</th><th>b</th><th>c</th></tr></tfoot><tbody></tbody></table>
		<script src="../node_modules/jquery/dist/jquery.min.js"></script>
		<script src="../node_modules/datatables/media/js/jquery.dataTables.js"></script>
		<script src="../phpDataTables.js"></script>
		<script>
			$("#datatable").phpDataTable({
				columns: [
					"your","mom","farts","butts"
				]
			});
//			/$("#datatable").DataTable();
		</script>
    </body>
</html>
