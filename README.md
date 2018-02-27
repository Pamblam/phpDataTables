

# phpDataTables 
version 1.0

**phpDataTables** is a simple wrapper for [DataTables](https://datatables.net/), written as a jQuery plugin as well as a universal PHP script that handles communication with an Oracle or MySQL database.

#### Why?

 - You don't need to write a new serverside script for every ajax-sourced datatable.
 - It normalizes table structure, in fact, you can instantiate it on a `<div>` and forget the table entirely as long as you include the `columns` parameter.

#### Why Not?

 - If you're using this on a public facing website/application and you consider your table structure sensitive information. It's fine for the company intranet.

#### How?

You need three file on your server and they *must* all be in the same directory. Create a `/phpDataTables` directory on the server or just copy the whole project to the server. At minimum you must have these three files:

 - **phpDataTables.js** - To be included in your HTML, after including the relevant jQuery and DataTables scripts.
 - **phpDataTables.php** - This handles the interaction with the database. The JS plugin assumes this is in the same directory as phpDataTables.js.
 - **config.ini** - This holds database access information (User, password, etc) - You must fill in the values in this file to be able to connect.
 
 phpDataTables only requires 1 parameter if instantiating upon a `<table>` -  The `dataquery` parameter - which is an SQL query that returns ll the data that is to be shown in the table. The columns returned must match the column names in the table header.

    <table id='datatable'>
      <thead>
        <tr>
          <td>Column A</td>
          <td>Column B</td>
        </tr>
      </thead>
    </table>

    $("#datatable").phpDataTable({
		dataquery: "SELECT `a` as `Column A`, `b` as `Column B` FROM myTable",
	});

If instantiating on a `<div>`  phpDataTables also requires a `columns` array. The column names in this array must match the column names returned by the query.

    <div id="datatable"></div>
    
    $("#datatable").phpDataTable({
		columns: ["Column A","Column B"],
		dataquery: "SELECT `a` as `Column A`, `b` as `Column B` FROM myTable",
	});

**All other options provided in the settings object are passed directly to the DataTables constructor.** Which means you can pass it a [`columnDefs`](https://datatables.net/reference/option/columnDefs) array or any other [DataTables Options](https://datatables.net/reference/option/).
