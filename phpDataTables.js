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
            this.$table = $("<table><thead><tr></tr></thead><tfoot><tr></tr></tfoot><tbody></tbody></table>");
            var $headers = this.$table.find("tr");
            this.columns.forEach(function (itm) { return $headers.append("<th>" + itm + "</th>"); });
            $.each($ele.prop("attributes"), function () {
                self.$table.attr(this.name, this.value);
            });
            $ele.replaceWith(this.$table);
        };
        phpDataTables.prototype.buidDataTable = function () {
            this.DataTable = this.$table.DataTable({
                processing: true,
                serverSide: true,
                ajax: function (data, callback, settings) {
                    callback({
                        draw: 1,
                        recordsTotal: 3,
                        recordsFiltered: 3,
                        data: [
                            [1, 2, 3],
                            [4, 5, 6],
                            [7, 8, 9]
                        ]
                    });
                }
            });
        };
        phpDataTables.prototype.getTable = function () {
            return this.$table;
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