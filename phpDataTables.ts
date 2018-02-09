
interface ArrayConstructor {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

interface JQuery {
	phpDataTable(): any;
}

interface phpDataTablesOpts{
	columns?: string[]
}

($=>{
	
	let serverSideScriptLocation: string;
	
	class phpDataTables{
	
		private DataTable: object;
		private $table: JQuery;
		private columns: string[] = [];

		constructor($ele: JQuery, opts: phpDataTablesOpts){
			if($ele.prop("tagName") === "TABLE") this.loadColumnsFromTable($ele);
			else if(Array.isArray(opts.columns)) this.columns = opts.columns;
			else throw new Error("Must initiate phpDataTable on a table element OR pass in a column parameter.");
			this.buildTable($ele);
			this.buidDataTable();
		}

		private loadColumnsFromTable($ele: JQuery): void{
			var self = this;
			let $headerRow = $ele.find("tr:eq(0)");
			let $headers = $headerRow.find("th").length ? $headerRow.find("th") : $headerRow.find("td");
			$headers.each(function(){ self.columns.push($(this).text()); });
		}
		
		private buildTable($ele: JQuery): void{
			var self = this;
			this.$table = $("<table><thead><tr></tr></thead><tfoot><tr></tr></tfoot><tbody></tbody></table>");
			let $headers = this.$table.find("tr")
			this.columns.forEach(itm=>$headers.append(`<th>${itm}</th>`));
			$.each($ele.prop("attributes"), function(){
				self.$table.attr(this.name, this.value);
			});
			$ele.replaceWith(this.$table);
		}
		
		private buidDataTable(){
			this.DataTable = this.$table.DataTable({
				processing: true,
				serverSide: true,
				ajax: (data, callback, settings)=>{
					callback({
						draw: 1,
						recordsTotal: 3,
						recordsFiltered: 3, 
						data:[
							[1,2,3],
							[4,5,6],
							[7,8,9]
						]
					});
				}
			});
		}
		
		getTable(): JQuery{
			return this.$table;
		}
	}
	
	$.fn.phpDataTable = function(){
		if(arguments.length === 1 && "object" === typeof arguments[0]){
			let phpdt = new phpDataTables(this, arguments[0]);
			phpdt.getTable().data('phpDataTable', phpdt);
			return phpdt.getTable();
		}else{
			// it's a method call, the first arg is a method name, rest are params
			let args: any[] = Array.from(arguments); 
			let method: any = args.shift();
			let instance = this.data('phpDataTable');
			if(!instance || "string" !== typeof method || "function" !== typeof instance[method]) return false;
			return instance[method](...args);
		}
	};
	
	let serverSideScriptPathParts: string[] = document.scripts[document.scripts.length-1].src.split("/");
	serverSideScriptPathParts[serverSideScriptPathParts.length-1] = "phpDataTables.php";
	serverSideScriptLocation = serverSideScriptPathParts.join('/');
	
})(jQuery);