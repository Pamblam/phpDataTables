(function ($) {
    var serverSideScriptLocation;
    var phpDataTables = (function () {
        function phpDataTables($ele, opts) {
            this.columns = [];
            if ($ele.prop("tagName") === "TABLE")
                this.loadColumnsFromTable($ele);
            else if (Array.isArray(opts.columns))
                this.columns = opts.columns;
            else
                throw new Error("Must initiate phpDataTable on a table element OR pass in a column parameter.");
            if (!opts.dataquery)
                throw new Error("Must initiate phpDataTable with a dataquery parameter.");
            this.dataquery = opts.dataquery;
            if (opts.columns)
                delete opts.columns;
            delete opts.dataquery;
            this.opts = opts;
            this.buildTable($ele);
            this.buidDataTable();
        }
        phpDataTables.prototype.loadColumnsFromTable = function ($ele) {
            var self = this;
            var $headerRow = $ele.find("tr:eq(0)");
            var $headers = $headerRow.find("th").length ? $headerRow.find("th") : $headerRow.find("td");
            $headers.each(function () { self.columns.push($(this).text()); });
        };
        phpDataTables.prototype.buildTable = function ($ele) {
            var self = this;
            this.$table = $("<div class='table-responsive'><table class='display table table-striped' width='100%' cellspacing='0'><thead><tr></tr></thead><tfoot><tr></tr></tfoot><tbody></tbody></table></div>");
            var $headers = this.$table.find("tr");
            this.columns.forEach(function (itm) { return $headers.append("<th>" + itm + "</th>"); });
            $.each($ele.prop("attributes"), function () {
                self.$table.attr(this.name, this.value);
            });
            $ele.replaceWith(this.$table);
        };
        phpDataTables.prototype.buidDataTable = function () {
            var _this = this;
            var opts = Object.assign({}, this.opts);
            opts.processing = true;
            opts.serverSide = true;
            opts.ajax = function (data, callback, settings) {
                data.dataquery = _this.dataquery;
                if (_this.columns.length !== data.columns.length) {
                    throw new Error("Columns mismatch...");
                }
                for (var i = 0; i < data.columns.length; i++)
                    data.columns[i].colname = _this.columns[i];
                $.ajax({
                    url: serverSideScriptLocation,
                    data: data
                }).done(callback);
            };
            this.DataTable = this.$table.find('table').DataTable(opts);
        };
        phpDataTables.prototype.getTable = function () {
            return this.$table;
        };
        phpDataTables.prototype.getDataTable = function () {
            return this.DataTable;
        };
        return phpDataTables;
    }());
    $.fn.phpDataTable = function () {
        if (arguments.length === 1 && "object" === typeof arguments[0]) {
            var phpdt = new phpDataTables(this, arguments[0]);
            phpdt.getTable().data('phpDataTable', phpdt);
            return phpdt.getTable();
        }
        else {
            var args = Array.from(arguments);
            var method = args.shift();
            var instance = this.data('phpDataTable');
            if (!instance || "string" !== typeof method || "function" !== typeof instance[method])
                return false;
            return instance[method].apply(instance, args);
        }
    };
    var serverSideScriptPathParts = document.scripts[document.scripts.length - 1].src.split("/");
    serverSideScriptPathParts[serverSideScriptPathParts.length - 1] = "phpDataTables.php";
    serverSideScriptLocation = serverSideScriptPathParts.join('/');
})(jQuery);
//# sourceMappingURL=phpDataTables.js.map