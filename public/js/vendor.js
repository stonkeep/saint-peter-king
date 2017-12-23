webpackJsonp([1],{

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(51);


/***/ }),

/***/ 51:
/***/ (function(module, exports) {

/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.11.1
 * https://github.com/wenzhixin/bootstrap-table/
 */

(function ($) {
    'use strict';

    // TOOLS DEFINITION
    // ======================

    var cachedWidth = null;

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };

    // http://jsfiddle.net/wenyi/47nz7ez9/3/
    var setFieldIndex = function (columns) {
        var i, j, k,
            totalCol = 0,
            flag = [];

        for (i = 0; i < columns[0].length; i++) {
            totalCol += columns[0][i].colspan || 1;
        }

        for (i = 0; i < columns.length; i++) {
            flag[i] = [];
            for (j = 0; j < totalCol; j++) {
                flag[i][j] = false;
            }
        }

        for (i = 0; i < columns.length; i++) {
            for (j = 0; j < columns[i].length; j++) {
                var r = columns[i][j],
                    rowspan = r.rowspan || 1,
                    colspan = r.colspan || 1,
                    index = $.inArray(false, flag[i]);

                if (colspan === 1) {
                    r.fieldIndex = index;
                    // when field is undefined, use index instead
                    if (typeof r.field === 'undefined') {
                        r.field = index;
                    }
                }

                for (k = 0; k < rowspan; k++) {
                    flag[i + k][index] = true;
                }
                for (k = 0; k < colspan; k++) {
                    flag[i][index + k] = true;
                }
            }
        }
    };

    var getScrollBarWidth = function () {
        if (cachedWidth === null) {
            var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
                outer = $('<div/>').addClass('fixed-table-scroll-outer'),
                w1, w2;

            outer.append(inner);
            $('body').append(outer);

            w1 = inner[0].offsetWidth;
            outer.css('overflow', 'scroll');
            w2 = inner[0].offsetWidth;

            if (w1 === w2) {
                w2 = outer[0].clientWidth;
            }

            outer.remove();
            cachedWidth = w1 - w2;
        }
        return cachedWidth;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        var func = name;

        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                func = window;
                $.each(names, function (i, f) {
                    func = func[f];
                });
            } else {
                func = window[name];
            }
        }
        if (typeof func === 'object') {
            return func;
        }
        if (typeof func === 'function') {
            return func.apply(self, args || []);
        }
        if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
            return sprintf.apply(this, [name].concat(args));
        }
        return defaultValue;
    };

    var compareObjects = function (objectA, objectB, compareLength) {
        // Create arrays of property names
        var objectAProperties = Object.getOwnPropertyNames(objectA),
            objectBProperties = Object.getOwnPropertyNames(objectB),
            propName = '';

        if (compareLength) {
            // If number of properties is different, objects are not equivalent
            if (objectAProperties.length !== objectBProperties.length) {
                return false;
            }
        }

        for (var i = 0; i < objectAProperties.length; i++) {
            propName = objectAProperties[i];

            // If the property is not in the object B properties, continue with the next property
            if ($.inArray(propName, objectBProperties) > -1) {
                // If values of same property are not equal, objects are not equivalent
                if (objectA[propName] !== objectB[propName]) {
                    return false;
                }
            }
        }

        // If we made it this far, objects are considered equivalent
        return true;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/`/g, '&#x60;');
        }
        return text;
    };

    var getRealDataAttr = function (dataAttr) {
        for (var attr in dataAttr) {
            var auxAttr = attr.split(/(?=[A-Z])/).join('-').toLowerCase();
            if (auxAttr !== attr) {
                dataAttr[auxAttr] = dataAttr[attr];
                delete dataAttr[attr];
            }
        }

        return dataAttr;
    };

    var getItemField = function (item, field, escape) {
        var value = item;

        if (typeof field !== 'string' || item.hasOwnProperty(field)) {
            return escape ? escapeHTML(item[field]) : item[field];
        }
        var props = field.split('.');
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                value = value && value[props[p]];
            }
        }
        return escape ? escapeHTML(value) : value;
    };

    var isIEBrowser = function () {
        return !!(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
    };

    var objectKeys = function () {
        // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
        if (!Object.keys) {
            Object.keys = (function() {
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length;

                return function(obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        sortClass: undefined,
        locale: undefined,
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        sortStable: false,
        striped: false,
        columns: [[]],
        data: [],
        totalField: 'total',
        dataField: 'rows',
        method: 'get',
        url: undefined,
        ajax: undefined,
        cache: true,
        contentType: 'application/json',
        dataType: 'json',
        ajaxOptions: {},
        queryParams: function (params) {
            return params;
        },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {
            return res;
        },
        pagination: false,
        onlyInfoPagination: false,
        paginationLoop: true,
        sidePagination: 'client', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        paginationHAlign: 'right', //right, left
        paginationVAlign: 'bottom', //bottom, top, both
        paginationDetailHAlign: 'left', //right, left
        paginationPreText: '&lsaquo;',
        paginationNextText: '&rsaquo;',
        search: false,
        searchOnEnterKey: false,
        strictSearch: false,
        searchAlign: 'right',
        selectItemName: 'btSelectItem',
        showHeader: true,
        showFooter: false,
        showColumns: false,
        showPaginationSwitch: false,
        showRefresh: false,
        showToggle: false,
        buttonsAlign: 'right',
        smartDisplay: true,
        escape: false,
        minimumCountColumns: 1,
        idField: undefined,
        uniqueId: undefined,
        cardView: false,
        detailView: false,
        detailFormatter: function (index, row) {
            return '';
        },
        trimOnSearch: true,
        clickToSelect: false,
        singleSelect: false,
        toolbar: undefined,
        toolbarAlign: 'left',
        checkboxHeader: true,
        sortable: true,
        silentSort: true,
        maintainSelected: false,
        searchTimeOut: 500,
        searchText: '',
        iconSize: undefined,
        buttonsClass: 'default',
        iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
        icons: {
            paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon-refresh icon-refresh',
            toggle: 'glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon-th icon-th',
            detailOpen: 'glyphicon-plus icon-plus',
            detailClose: 'glyphicon-minus icon-minus'
        },

        customSearch: $.noop,

        customSort: $.noop,

        rowStyle: function (row, index) {
            return {};
        },

        rowAttributes: function (row, index) {
            return {};
        },

        footerStyle: function (row, index) {
            return {};
        },

        onAll: function (name, args) {
            return false;
        },
        onClickCell: function (field, value, row, $element) {
            return false;
        },
        onDblClickCell: function (field, value, row, $element) {
            return false;
        },
        onClickRow: function (item, $element) {
            return false;
        },
        onDblClickRow: function (item, $element) {
            return false;
        },
        onSort: function (name, order) {
            return false;
        },
        onCheck: function (row) {
            return false;
        },
        onUncheck: function (row) {
            return false;
        },
        onCheckAll: function (rows) {
            return false;
        },
        onUncheckAll: function (rows) {
            return false;
        },
        onCheckSome: function (rows) {
            return false;
        },
        onUncheckSome: function (rows) {
            return false;
        },
        onLoadSuccess: function (data) {
            return false;
        },
        onLoadError: function (status) {
            return false;
        },
        onColumnSwitch: function (field, checked) {
            return false;
        },
        onPageChange: function (number, size) {
            return false;
        },
        onSearch: function (text) {
            return false;
        },
        onToggle: function (cardView) {
            return false;
        },
        onPreBody: function (data) {
            return false;
        },
        onPostBody: function () {
            return false;
        },
        onPostHeader: function () {
            return false;
        },
        onExpandRow: function (index, row, $detail) {
            return false;
        },
        onCollapseRow: function (index, row) {
            return false;
        },
        onRefreshOptions: function (options) {
            return false;
        },
        onRefresh: function (params) {
          return false;
        },
        onResetView: function () {
            return false;
        }
    };

    BootstrapTable.LOCALES = {};

    BootstrapTable.LOCALES['en-US'] = BootstrapTable.LOCALES.en = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s rows per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatDetailPagination: function (totalRows) {
            return sprintf('Showing %s rows', totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        },
        formatAllRows: function () {
            return 'All';
        }
    };

    $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['en-US']);

    BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        titleTooltip: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        falign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        footerFormatter: undefined,
        events: undefined,
        sorter: undefined,
        sortName: undefined,
        cellStyle: undefined,
        searchable: true,
        searchFormatter: true,
        cardVisible: true,
        escape : false
    };

    BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-cell.bs.table': 'onClickCell',
        'dbl-click-cell.bs.table': 'onDblClickCell',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'check-some.bs.table': 'onCheckSome',
        'uncheck-some.bs.table': 'onUncheckSome',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch',
        'page-change.bs.table': 'onPageChange',
        'search.bs.table': 'onSearch',
        'toggle.bs.table': 'onToggle',
        'pre-body.bs.table': 'onPreBody',
        'post-body.bs.table': 'onPostBody',
        'post-header.bs.table': 'onPostHeader',
        'expand-row.bs.table': 'onExpandRow',
        'collapse-row.bs.table': 'onCollapseRow',
        'refresh-options.bs.table': 'onRefreshOptions',
        'reset-view.bs.table': 'onResetView',
        'refresh.bs.table': 'onRefresh'
    };

    BootstrapTable.prototype.init = function () {
        this.initLocale();
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initHiddenRows();
        this.initFooter();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initSearchText();
        this.initServer();
    };

    BootstrapTable.prototype.initLocale = function () {
        if (this.options.locale) {
            var parts = this.options.locale.split(/-|_/);
            parts[0].toLowerCase();
            if (parts[1]) parts[1].toUpperCase();
            if ($.fn.bootstrapTable.locales[this.options.locale]) {
                // locale as requested
                $.extend(this.options, $.fn.bootstrapTable.locales[this.options.locale]);
            } else if ($.fn.bootstrapTable.locales[parts.join('-')]) {
                // locale with sep set to - (in case original was specified with _)
                $.extend(this.options, $.fn.bootstrapTable.locales[parts.join('-')]);
            } else if ($.fn.bootstrapTable.locales[parts[0]]) {
                // short locale language code (i.e. 'en')
                $.extend(this.options, $.fn.bootstrapTable.locales[parts[0]]);
            }
        }
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
            '<div class="fixed-table-toolbar"></div>',
            this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination" style="clear: both;"></div>' :
                '',
            '<div class="fixed-table-container">',
            '<div class="fixed-table-header"><table></table></div>',
            '<div class="fixed-table-body">',
            '<div class="fixed-table-loading">',
            this.options.formatLoadingMessage(),
            '</div>',
            '</div>',
            '<div class="fixed-table-footer"><table><tr></tr></table></div>',
            this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination"></div>' :
                '',
            '</div>',
            '</div>'
        ].join(''));

        this.$container.insertAfter(this.$el);
        this.$tableContainer = this.$container.find('.fixed-table-container');
        this.$tableHeader = this.$container.find('.fixed-table-header');
        this.$tableBody = this.$container.find('.fixed-table-body');
        this.$tableLoading = this.$container.find('.fixed-table-loading');
        this.$tableFooter = this.$container.find('.fixed-table-footer');
        this.$toolbar = this.$container.find('.fixed-table-toolbar');
        this.$pagination = this.$container.find('.fixed-table-pagination');

        this.$tableBody.append(this.$el);
        this.$container.after('<div class="clearfix"></div>');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
        if ($.inArray('table-no-bordered', this.options.classes.split(' ')) !== -1) {
            this.$tableContainer.addClass('table-no-bordered');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('>thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        this.$header.find('tr').each(function () {
            var column = [];

            $(this).find('th').each(function () {
                // Fix #2014 - getFieldIndex and elsewhere assume this is string, causes issues if not
                if (typeof $(this).data('field') !== 'undefined') {
                    $(this).data('field', $(this).data('field') + '');
                }
                column.push($.extend({}, {
                    title: $(this).html(),
                    'class': $(this).attr('class'),
                    titleTooltip: $(this).attr('title'),
                    rowspan: $(this).attr('rowspan') ? +$(this).attr('rowspan') : undefined,
                    colspan: $(this).attr('colspan') ? +$(this).attr('colspan') : undefined
                }, $(this).data()));
            });
            columns.push(column);
        });
        if (!$.isArray(this.options.columns[0])) {
            this.options.columns = [this.options.columns];
        }
        this.options.columns = $.extend(true, [], columns, this.options.columns);
        this.columns = [];

        setFieldIndex(this.options.columns);
        $.each(this.options.columns, function (i, columns) {
            $.each(columns, function (j, column) {
                column = $.extend({}, BootstrapTable.COLUMN_DEFAULTS, column);

                if (typeof column.fieldIndex !== 'undefined') {
                    that.columns[column.fieldIndex] = column;
                }

                that.options.columns[i][j] = column;
            });
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        var m = [];
        this.$el.find('>tbody>tr').each(function (y) {
            var row = {};

            // save tr's id, class and data-* attributes
            row._id = $(this).attr('id');
            row._class = $(this).attr('class');
            row._data = getRealDataAttr($(this).data());

            $(this).find('>td').each(function (x) {
                var $this = $(this),
                    cspan = +$this.attr('colspan') || 1,
                    rspan = +$this.attr('rowspan') || 1,
                    tx, ty;

                for (; m[y] && m[y][x]; x++); //skip already occupied cells in current row

                for (tx = x; tx < x + cspan; tx++) { //mark matrix elements occupied by current cell with true
                    for (ty = y; ty < y + rspan; ty++) {
                        if (!m[ty]) { //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }

                var field = that.columns[x].field;

                row[field] = $(this).html();
                // save td's id, class and data-* attributes
                row['_' + field + '_id'] = $(this).attr('id');
                row['_' + field + '_class'] = $(this).attr('class');
                row['_' + field + '_rowspan'] = $(this).attr('rowspan');
                row['_' + field + '_colspan'] = $(this).attr('colspan');
                row['_' + field + '_title'] = $(this).attr('title');
                row['_' + field + '_data'] = getRealDataAttr($(this).data());
            });
            data.push(row);
        });
        this.options.data = data;
        if (data.length) this.fromHtml = true;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = {},
            html = [];

        this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            sortNames: [],
            cellStyles: [],
            searchables: []
        };

        $.each(this.options.columns, function (i, columns) {
            html.push('<tr>');

            if (i === 0 && !that.options.cardView && that.options.detailView) {
                html.push(sprintf('<th class="detail" rowspan="%s"><div class="fht-cell"></div></th>',
                    that.options.columns.length));
            }

            $.each(columns, function (j, column) {
                var text = '',
                    halign = '', // header align style
                    align = '', // body align style
                    style = '',
                    class_ = sprintf(' class="%s"', column['class']),
                    order = that.options.sortOrder || column.order,
                    unitWidth = 'px',
                    width = column.width;

                if (column.width !== undefined && (!that.options.cardView)) {
                    if (typeof column.width === 'string') {
                        if (column.width.indexOf('%') !== -1) {
                            unitWidth = '%';
                        }
                    }
                }
                if (column.width && typeof column.width === 'string') {
                    width = column.width.replace('%', '').replace('px', '');
                }

                halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
                align = sprintf('text-align: %s; ', column.align);
                style = sprintf('vertical-align: %s; ', column.valign);
                style += sprintf('width: %s; ', (column.checkbox || column.radio) && !width ?
                    '36px' : (width ? width + unitWidth : undefined));

                if (typeof column.fieldIndex !== 'undefined') {
                    that.header.fields[column.fieldIndex] = column.field;
                    that.header.styles[column.fieldIndex] = align + style;
                    that.header.classes[column.fieldIndex] = class_;
                    that.header.formatters[column.fieldIndex] = column.formatter;
                    that.header.events[column.fieldIndex] = column.events;
                    that.header.sorters[column.fieldIndex] = column.sorter;
                    that.header.sortNames[column.fieldIndex] = column.sortName;
                    that.header.cellStyles[column.fieldIndex] = column.cellStyle;
                    that.header.searchables[column.fieldIndex] = column.searchable;

                    if (!column.visible) {
                        return;
                    }

                    if (that.options.cardView && (!column.cardVisible)) {
                        return;
                    }

                    visibleColumns[column.field] = column;
                }

                html.push('<th' + sprintf(' title="%s"', column.titleTooltip),
                    column.checkbox || column.radio ?
                        sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                        class_,
                    sprintf(' style="%s"', halign + style),
                    sprintf(' rowspan="%s"', column.rowspan),
                    sprintf(' colspan="%s"', column.colspan),
                    sprintf(' data-field="%s"', column.field),
                    '>');

                html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                    'sortable both' : ''));

                text = that.options.escape ? escapeHTML(column.title) : column.title;

                if (column.checkbox) {
                    if (!that.options.singleSelect && that.options.checkboxHeader) {
                        text = '<input name="btSelectAll" type="checkbox" />';
                    }
                    that.header.stateField = column.field;
                }
                if (column.radio) {
                    text = '';
                    that.header.stateField = column.field;
                    that.options.singleSelect = true;
                }

                html.push(text);
                html.push('</div>');
                html.push('<div class="fht-cell"></div>');
                html.push('</div>');
                html.push('</th>');
            });
            html.push('</tr>');
        });

        this.$header.html(html.join(''));
        this.$header.find('th[data-field]').each(function (i) {
            $(this).data(visibleColumns[$(this).data('field')]);
        });
        this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
            var target = $(this);

            if (that.options.detailView) {
                if (target.closest('.bootstrap-table')[0] !== that.$container[0])
                    return false;
            }

            if (that.options.sortable && target.parent().data().sortable) {
                that.onSort(event);
            }
        });

        this.$header.children().children().off('keypress').on('keypress', function (event) {
            if (that.options.sortable && $(this).data().sortable) {
                var code = event.keyCode || event.which;
                if (code == 13) { //Enter keycode
                    that.onSort(event);
                }
            }
        });

        $(window).off('resize.bootstrap-table');
        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$tableHeader.hide();
            this.$tableLoading.css('top', 0);
        } else {
            this.$header.show();
            this.$tableHeader.show();
            this.$tableLoading.css('top', this.$header.outerHeight() + 1);
            // Assign the correct sortable arrow
            this.getCaret();
            $(window).on('resize.bootstrap-table', $.proxy(this.resetWidth, this));
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$selectAll.off('click').on('click', function () {
                var checked = $(this).prop('checked');
                that[checked ? 'checkAll' : 'uncheckAll']();
                that.updateSelected();
            });
    };

    BootstrapTable.prototype.initFooter = function () {
        if (!this.options.showFooter || this.options.cardView) {
            this.$tableFooter.hide();
        } else {
            this.$tableFooter.show();
        }
    };

    /**
     * @param data
     * @param type: append / prepend
     */
    BootstrapTable.prototype.initData = function (data, type) {
        if (type === 'append') {
            this.data = this.data.concat(data);
        } else if (type === 'prepend') {
            this.data = [].concat(data).concat(this.data);
        } else {
            this.data = data || this.options.data;
        }

        // Fix #839 Records deleted when adding new row on filtered table
        if (type === 'append') {
            this.options.data = this.options.data.concat(data);
        } else if (type === 'prepend') {
            this.options.data = [].concat(data).concat(this.options.data);
        } else {
            this.options.data = this.data;
        }

        if (this.options.sidePagination === 'server') {
            return;
        }
        this.initSort();
    };

    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields),
            timeoutId = 0;

        if (this.options.customSort !== $.noop) {
            this.options.customSort.apply(this, [this.options.sortName, this.options.sortOrder]);
            return;
        }

        if (index !== -1) {
            if (this.options.sortStable) {
                $.each(this.data, function (i, row) {
                    if (!row.hasOwnProperty('_position')) row._position = i;
                });
            }

            this.data.sort(function (a, b) {
                if (that.header.sortNames[index]) {
                    name = that.header.sortNames[index];
                }
                var aa = getItemField(a, name, that.options.escape),
                    bb = getItemField(b, name, that.options.escape),
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === undefined || aa === null) {
                    aa = '';
                }
                if (bb === undefined || bb === null) {
                    bb = '';
                }

                if (that.options.sortStable && aa === bb) {
                    aa = a._position;
                    bb = b._position;
                }

                // IF both values are numeric, do a numeric comparison
                if ($.isNumeric(aa) && $.isNumeric(bb)) {
                    // Convert numerical values form string to float.
                    aa = parseFloat(aa);
                    bb = parseFloat(bb);
                    if (aa < bb) {
                        return order * -1;
                    }
                    return order;
                }

                if (aa === bb) {
                    return 0;
                }

                // If value is not a string, convert to string
                if (typeof aa !== 'string') {
                    aa = aa.toString();
                }

                if (aa.localeCompare(bb) === -1) {
                    return order * -1;
                }

                return order;
            });

            if (this.options.sortClass !== undefined) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    that.$el.removeClass(that.options.sortClass);
                    var index = that.$header.find(sprintf('[data-field="%s"]',
                        that.options.sortName).index() + 1);
                    that.$el.find(sprintf('tr td:nth-child(%s)', index))
                        .addClass(that.options.sortClass);
                }, 250);
            }
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = event.type === "keypress" ? $(event.currentTarget) : $(event.currentTarget).parent(),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder);

        // Assign the correct sortable arrow
        this.getCaret();

        if (this.options.sidePagination === 'server') {
            this.initServer(this.options.silentSort);
            return;
        }

        this.initSort();
        this.initBody();
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        if (this.$toolbar.find('.bs-bars').children().length) {
            $('body').append($(this.options.toolbar));
        }
        this.$toolbar.html('');

        if (typeof this.options.toolbar === 'string' || typeof this.options.toolbar === 'object') {
            $(sprintf('<div class="bs-bars pull-%s"></div>', this.options.toolbarAlign))
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
            this.options.buttonsAlign, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
            this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="paginationSwitch" aria-label="pagination Switch" title="%s">',
                    this.options.formatPaginationSwitch()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                '</button>');
        }

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="refresh" aria-label="refresh" title="%s">',
                    this.options.formatRefresh()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    '" type="button" name="toggle" aria-label="toggle" title="%s">',
                    this.options.formatToggle()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
                '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                    this.options.formatColumns()),
                '<button type="button" aria-label="columns" class="btn' +
                sprintf(' btn-%s', this.options.buttonsClass) +
                sprintf(' btn-%s', this.options.iconSize) +
                ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">');

            $.each(this.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }

                if (that.options.cardView && !column.cardVisible) {
                    return;
                }

                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li role="menuitem">' +
                        '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                        '</li>', column.field, i, checked, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extensions
        if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]')
                .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.toggleView();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($(this).val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                '<div class="pull-' + this.options.searchAlign + ' search">',
                sprintf('<input class="form-control' +
                    sprintf(' input-%s', this.options.iconSize) +
                    '" type="text" placeholder="%s">',
                    this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup drop blur').on('keyup drop blur', function (event) {
                if (that.options.searchOnEnterKey && event.keyCode !== 13) {
                    return;
                }

                if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
                    return;
                }

                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });

            if (isIEBrowser()) {
                $search.off('mouseup').on('mouseup', function (event) {
                    clearTimeout(timeoutId); // doesn't matter if it's 0
                    timeoutId = setTimeout(function () {
                        that.onSearch(event);
                    }, that.options.searchTimeOut);
                });
            }
        }
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch && $(event.currentTarget).val() !== text) {
            $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;
        this.options.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        this.trigger('search', text);
    };

    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            if (this.options.customSearch !== $.noop) {
                this.options.customSearch.apply(this, [this.searchText]);
                return;
            }

            var s = this.searchText && (this.options.escape ?
                escapeHTML(this.searchText) : this.searchText).toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

            // Check filter
            this.data = f ? $.grep(this.options.data, function (item, i) {
                for (var key in f) {
                    if ($.isArray(f[key]) && $.inArray(item[key], f[key]) === -1 ||
                            !$.isArray(f[key]) && item[key] !== f[key]) {
                        return false;
                    }
                }
                return true;
            }) : this.options.data;

            this.data = s ? $.grep(this.data, function (item, i) {
                for (var j = 0; j < that.header.fields.length; j++) {

                    if (!that.header.searchables[j]) {
                        continue;
                    }

                    var key = $.isNumeric(that.header.fields[j]) ? parseInt(that.header.fields[j], 10) : that.header.fields[j];
                    var column = that.columns[getFieldIndex(that.columns, key)];
                    var value;

                    if (typeof key === 'string') {
                        value = item;
                        var props = key.split('.');
                        for (var prop_index = 0; prop_index < props.length; prop_index++) {
                            value = value[props[prop_index]];
                        }

                        // Fix #142: respect searchForamtter boolean
                        if (column && column.searchFormatter) {
                            value = calculateObjectValue(column,
                                that.header.formatters[j], [value, item, i], value);
                        }
                    } else {
                        value = item[key];
                    }

                    if (typeof value === 'string' || typeof value === 'number') {
                        if (that.options.strictSearch) {
                            if ((value + '').toLowerCase() === s) {
                                return true;
                            }
                        } else {
                            if ((value + '').toLowerCase().indexOf(s) !== -1) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }) : this.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        if (!this.options.pagination) {
            this.$pagination.hide();
            return;
        } else {
            this.$pagination.show();
        }

        var that = this,
            html = [],
            $allSelected = false,
            i, from, to,
            $pageList,
            $first, $pre,
            $next, $last,
            $number,
            data = this.getData(),
            pageList = this.options.pageList;

        if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
            if (this.options.pageSize === this.options.formatAllRows()) {
                this.options.pageSize = this.options.totalRows;
                $allSelected = true;
            } else if (this.options.pageSize === this.options.totalRows) {
                // Fix #667 Table with pagination,
                // multiple pages and a search that matches to one page throws exception
                var pageLst = typeof this.options.pageList === 'string' ?
                    this.options.pageList.replace('[', '').replace(']', '')
                        .replace(/ /g, '').toLowerCase().split(',') : this.options.pageList;
                if ($.inArray(this.options.formatAllRows().toLowerCase(), pageLst)  > -1) {
                    $allSelected = true;
                }
            }

            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;

            this.options.totalPages = this.totalPages;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
        }

        html.push(
            '<div class="pull-' + this.options.paginationDetailHAlign + ' pagination-detail">',
            '<span class="pagination-info">',
            this.options.onlyInfoPagination ? this.options.formatDetailPagination(this.options.totalRows) :
            this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
            '</span>');

        if (!this.options.onlyInfoPagination) {
            html.push('<span class="page-list">');

            var pageNumber = [
                    sprintf('<span class="btn-group %s">',
                        this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                            'dropdown' : 'dropup'),
                    '<button type="button" class="btn' +
                    sprintf(' btn-%s', this.options.buttonsClass) +
                    sprintf(' btn-%s', this.options.iconSize) +
                    ' dropdown-toggle" data-toggle="dropdown">',
                    '<span class="page-size">',
                    $allSelected ? this.options.formatAllRows() : this.options.pageSize,
                    '</span>',
                    ' <span class="caret"></span>',
                    '</button>',
                    '<ul class="dropdown-menu" role="menu">'
                ];

            if (typeof this.options.pageList === 'string') {
                var list = this.options.pageList.replace('[', '').replace(']', '')
                    .replace(/ /g, '').split(',');

                pageList = [];
                $.each(list, function (i, value) {
                    pageList.push(value.toUpperCase() === that.options.formatAllRows().toUpperCase() ?
                        that.options.formatAllRows() : +value);
                });
            }

            $.each(pageList, function (i, page) {
                if (!that.options.smartDisplay || i === 0 || pageList[i - 1] < that.options.totalRows) {
                    var active;
                    if ($allSelected) {
                        active = page === that.options.formatAllRows() ? ' class="active"' : '';
                    } else {
                        active = page === that.options.pageSize ? ' class="active"' : '';
                    }
                    pageNumber.push(sprintf('<li role="menuitem"%s><a href="#">%s</a></li>', active, page));
                }
            });
            pageNumber.push('</ul></span>');

            html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
            html.push('</span>');

            html.push('</div>',
                '<div class="pull-' + this.options.paginationHAlign + ' pagination">',
                '<ul class="pagination' + sprintf(' pagination-%s', this.options.iconSize) + '">',
                '<li class="page-pre"><a href="#">' + this.options.paginationPreText + '</a></li>');

            if (this.totalPages < 5) {
                from = 1;
                to = this.totalPages;
            } else {
                from = this.options.pageNumber - 2;
                to = from + 4;
                if (from < 1) {
                    from = 1;
                    to = 5;
                }
                if (to > this.totalPages) {
                    to = this.totalPages;
                    from = to - 4;
                }
            }

            if (this.totalPages >= 6) {
                if (this.options.pageNumber >= 3) {
                    html.push('<li class="page-first' + (1 === this.options.pageNumber ? ' active' : '') + '">',
                        '<a href="#">', 1, '</a>',
                        '</li>');

                    from++;
                }

                if (this.options.pageNumber >= 4) {
                    if (this.options.pageNumber == 4 || this.totalPages == 6 || this.totalPages == 7) {
                        from--;
                    } else {
                        html.push('<li class="page-first-separator disabled">',
                            '<a href="#">...</a>',
                            '</li>');
                    }

                    to--;
                }
            }

            if (this.totalPages >= 7) {
                if (this.options.pageNumber >= (this.totalPages - 2)) {
                    from--;
                }
            }

            if (this.totalPages == 6) {
                if (this.options.pageNumber >= (this.totalPages - 2)) {
                    to++;
                }
            } else if (this.totalPages >= 7) {
                if (this.totalPages == 7 || this.options.pageNumber >= (this.totalPages - 3)) {
                    to++;
                }
            }

            for (i = from; i <= to; i++) {
                html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
                    '<a href="#">', i, '</a>',
                    '</li>');
            }

            if (this.totalPages >= 8) {
                if (this.options.pageNumber <= (this.totalPages - 4)) {
                    html.push('<li class="page-last-separator disabled">',
                        '<a href="#">...</a>',
                        '</li>');
                }
            }

            if (this.totalPages >= 6) {
                if (this.options.pageNumber <= (this.totalPages - 3)) {
                    html.push('<li class="page-last' + (this.totalPages === this.options.pageNumber ? ' active' : '') + '">',
                        '<a href="#">', this.totalPages, '</a>',
                        '</li>');
                }
            }

            html.push(
                '<li class="page-next"><a href="#">' + this.options.paginationNextText + '</a></li>',
                '</ul>',
                '</div>');
        }
        this.$pagination.html(html.join(''));

        if (!this.options.onlyInfoPagination) {
            $pageList = this.$pagination.find('.page-list a');
            $first = this.$pagination.find('.page-first');
            $pre = this.$pagination.find('.page-pre');
            $next = this.$pagination.find('.page-next');
            $last = this.$pagination.find('.page-last');
            $number = this.$pagination.find('.page-number');

            if (this.options.smartDisplay) {
                if (this.totalPages <= 1) {
                    this.$pagination.find('div.pagination').hide();
                }
                if (pageList.length < 2 || this.options.totalRows <= pageList[0]) {
                    this.$pagination.find('span.page-list').hide();
                }

                // when data is empty, hide the pagination
                this.$pagination[this.getData().length ? 'show' : 'hide']();
            }

            if (!this.options.paginationLoop) {
                if (this.options.pageNumber === 1) {
                    $pre.addClass('disabled');
                }
                if (this.options.pageNumber === this.totalPages) {
                    $next.addClass('disabled');
                }
            }

            if ($allSelected) {
                this.options.pageSize = this.options.formatAllRows();
            }
            $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
            $first.off('click').on('click', $.proxy(this.onPageFirst, this));
            $pre.off('click').on('click', $.proxy(this.onPagePre, this));
            $next.off('click').on('click', $.proxy(this.onPageNext, this));
            $last.off('click').on('click', $.proxy(this.onPageLast, this));
            $number.off('click').on('click', $.proxy(this.onPageNumber, this));
        }
    };

    BootstrapTable.prototype.updatePagination = function (event) {
        // Fix #171: IE disabled button can be clicked bug.
        if (event && $(event.currentTarget).hasClass('disabled')) {
            return;
        }

        if (!this.options.maintainSelected) {
            this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
            this.initServer();
        } else {
            this.initBody();
        }

        this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
            this.options.formatAllRows() : +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);

        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageFirst = function (event) {
        this.options.pageNumber = 1;
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        if ((this.options.pageNumber - 1) === 0) {
            this.options.pageNumber = this.options.totalPages;
        } else {
            this.options.pageNumber--;
        }
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        if ((this.options.pageNumber + 1) > this.options.totalPages) {
            this.options.pageNumber = 1;
        } else {
            this.options.pageNumber++;
        }
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageLast = function (event) {
        this.options.pageNumber = this.totalPages;
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
        return false;
    };

    BootstrapTable.prototype.initRow = function(item, i, data, parentDom) {
        var that=this,
            key,
            html = [],
            style = {},
            csses = [],
            data_ = '',
            attributes = {},
            htmlAttributes = [];

        if ($.inArray(item, this.hiddenRows) > -1) {
            return;
        }

        style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

        if (style && style.css) {
            for (key in style.css) {
                csses.push(key + ': ' + style.css[key]);
            }
        }

        attributes = calculateObjectValue(this.options,
            this.options.rowAttributes, [item, i], attributes);

        if (attributes) {
            for (key in attributes) {
                htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
            }
        }

        if (item._data && !$.isEmptyObject(item._data)) {
            $.each(item._data, function(k, v) {
                // ignore data-index
                if (k === 'index') {
                    return;
                }
                data_ += sprintf(' data-%s="%s"', k, v);
            });
        }

        html.push('<tr',
            sprintf(' %s', htmlAttributes.join(' ')),
            sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
            sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
            sprintf(' data-index="%s"', i),
            sprintf(' data-uniqueid="%s"', item[this.options.uniqueId]),
            sprintf('%s', data_),
            '>'
        );

        if (this.options.cardView) {
            html.push(sprintf('<td colspan="%s"><div class="card-views">', this.header.fields.length));
        }

        if (!this.options.cardView && this.options.detailView) {
            html.push('<td>',
                '<a class="detail-icon" href="#">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.detailOpen),
                '</a>',
                '</td>');
        }

        $.each(this.header.fields, function(j, field) {
            var text = '',
                value_ = getItemField(item, field, that.options.escape),
                value = '',
                type = '',
                cellStyle = {},
                id_ = '',
                class_ = that.header.classes[j],
                data_ = '',
                rowspan_ = '',
                colspan_ = '',
                title_ = '',
                column = that.columns[j];

            if (that.fromHtml && typeof value_ === 'undefined') {
                return;
            }

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            if (column.escape) {
                value_ = escapeHTML(value_);
            }

            style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

            // handle td's id and class
            if (item['_' + field + '_id']) {
                id_ = sprintf(' id="%s"', item['_' + field + '_id']);
            }
            if (item['_' + field + '_class']) {
                class_ = sprintf(' class="%s"', item['_' + field + '_class']);
            }
            if (item['_' + field + '_rowspan']) {
                rowspan_ = sprintf(' rowspan="%s"', item['_' + field + '_rowspan']);
            }
            if (item['_' + field + '_colspan']) {
                colspan_ = sprintf(' colspan="%s"', item['_' + field + '_colspan']);
            }
            if (item['_' + field + '_title']) {
                title_ = sprintf(' title="%s"', item['_' + field + '_title']);
            }
            cellStyle = calculateObjectValue(that.header,
                that.header.cellStyles[j], [value_, item, i, field], cellStyle);
            if (cellStyle.classes) {
                class_ = sprintf(' class="%s"', cellStyle.classes);
            }
            if (cellStyle.css) {
                var csses_ = [];
                for (var key in cellStyle.css) {
                    csses_.push(key + ': ' + cellStyle.css[key]);
                }
                style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
            }

            value = calculateObjectValue(column,
                that.header.formatters[j], [value_, item, i], value_);

            if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
                $.each(item['_' + field + '_data'], function(k, v) {
                    // ignore data-index
                    if (k === 'index') {
                        return;
                    }
                    data_ += sprintf(' data-%s="%s"', k, v);
                });
            }

            if (column.checkbox || column.radio) {
                type = column.checkbox ? 'checkbox' : type;
                type = column.radio ? 'radio' : type;

                text = [sprintf(that.options.cardView ?
                        '<div class="card-view %s">' : '<td class="bs-checkbox %s">', column['class'] || ''),
                    '<input' +
                    sprintf(' data-index="%s"', i) +
                    sprintf(' name="%s"', that.options.selectItemName) +
                    sprintf(' type="%s"', type) +
                    sprintf(' value="%s"', item[that.options.idField]) +
                    sprintf(' checked="%s"', value === true ||
                        (value_ || value && value.checked) ? 'checked' : undefined) +
                    sprintf(' disabled="%s"', !column.checkboxEnabled ||
                        (value && value.disabled) ? 'disabled' : undefined) +
                    ' />',
                    that.header.formatters[j] && typeof value === 'string' ? value : '',
                    that.options.cardView ? '</div>' : '</td>'
                ].join('');

                item[that.header.stateField] = value === true || (value && value.checked);
            } else {
                value = typeof value === 'undefined' || value === null ?
                    that.options.undefinedText : value;

                text = that.options.cardView ? ['<div class="card-view">',
                    that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                        getPropertyFromOther(that.columns, 'field', 'title', field)) : '',
                    sprintf('<span class="value">%s</span>', value),
                    '</div>'
                ].join('') : [sprintf('<td%s %s %s %s %s %s %s>',
                        id_, class_, style, data_, rowspan_, colspan_, title_),
                    value,
                    '</td>'
                ].join('');

                // Hide empty data on Card view when smartDisplay is set to true.
                if (that.options.cardView && that.options.smartDisplay && value === '') {
                    // Should set a placeholder for event binding correct fieldIndex
                    text = '<div class="card-view"></div>';
                }
            }

            html.push(text);
        });

        if (this.options.cardView) {
            html.push('</div></td>');
        }
        html.push('</tr>');

        return html.join(' ');
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('>tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        var trFragments = $(document.createDocumentFragment());
        var hasTr;

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var item = data[i];
            var tr = this.initRow(item, i, data, trFragments);
            hasTr = hasTr || !!tr;
            if (tr&&tr!==true) {
                trFragments.append(tr);
            }
        }

        // show no records
        if (!hasTr) {
            trFragments.append('<tr class="no-records-found">' +
                sprintf('<td colspan="%s">%s</td>',
                this.$header.find('th').length,
                this.options.formatNoMatches()) +
                '</tr>');
        }

        this.$body.html(trFragments);

        if (!fixedScroll) {
            this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr[data-index] > td').off('click dblclick').on('click dblclick', function (e) {
            var $td = $(this),
                $tr = $td.parent(),
                item = that.data[$tr.data('index')],
                index = $td[0].cellIndex,
                fields = that.getVisibleFields(),
                field = fields[that.options.detailView && !that.options.cardView ? index - 1 : index],
                column = that.columns[getFieldIndex(that.columns, field)],
                value = getItemField(item, field, that.options.escape);

            if ($td.find('.detail-icon').length) {
                return;
            }

            that.trigger(e.type === 'click' ? 'click-cell' : 'dbl-click-cell', field, value, item, $td);
            that.trigger(e.type === 'click' ? 'click-row' : 'dbl-click-row', item, $tr, field);

            // if click to select - then trigger the checkbox/radio click
            if (e.type === 'click' && that.options.clickToSelect && column.clickToSelect) {
                var $selectItem = $tr.find(sprintf('[name="%s"]', that.options.selectItemName));
                if ($selectItem.length) {
                    $selectItem[0].click(); // #144: .trigger('click') bug
                }
            }
        });

        this.$body.find('> tr[data-index] > td > .detail-icon').off('click').on('click', function () {
            var $this = $(this),
                $tr = $this.parent().parent(),
                index = $tr.data('index'),
                row = data[index]; // Fix #980 Detail view, when searching, returns wrong row

            // remove and update
            if ($tr.next().is('tr.detail-view')) {
                $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailOpen));
                that.trigger('collapse-row', index, row);
                $tr.next().remove();
            } else {
                $this.find('i').attr('class', sprintf('%s %s', that.options.iconsPrefix, that.options.icons.detailClose));
                $tr.after(sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>', $tr.find('td').length));
                var $element = $tr.next().find('td');
                var content = calculateObjectValue(that.options, that.options.detailFormatter, [index, row, $element], '');
                if($element.length === 1) {
                    $element.append(content);
                }
                that.trigger('expand-row', index, row, $element);
            }
            that.resetView();
            return false;
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            var $this = $(this),
                checked = $this.prop('checked'),
                row = that.data[$this.data('index')];

            if (that.options.maintainSelected && $(this).is(':radio')) {
                $.each(that.options.data, function (i, row) {
                    row[that.header.stateField] = false;
                });
            }

            row[that.header.stateField] = checked;

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
            that.trigger(checked ? 'check' : 'uncheck', row, $this);
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }

            var field = that.header.fields[i],
                fieldIndex = $.inArray(field, that.getVisibleFields());

            if (that.options.detailView && !that.options.cardView) {
                fieldIndex += 1;
            }

            for (var key in events) {
                that.$body.find('>tr:not(.no-records-found)').each(function () {
                    var $tr = $(this),
                        $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(fieldIndex),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[field];

                        func.apply(this, [e, value, row, index]);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body', data);
    };

    BootstrapTable.prototype.initServer = function (silent, query, url) {
        var that = this,
            data = {},
            params = {
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            },
            request;

        if (this.options.pagination) {
            params.pageSize = this.options.pageSize === this.options.formatAllRows() ?
                this.options.totalRows : this.options.pageSize;
            params.pageNumber = this.options.pageNumber;
        }

        if (!(url || this.options.url) && !this.options.ajax) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };

            if (this.options.pagination) {
                params.offset = this.options.pageSize === this.options.formatAllRows() ?
                    0 : this.options.pageSize * (this.options.pageNumber - 1);
                params.limit = this.options.pageSize === this.options.formatAllRows() ?
                    this.options.totalRows : this.options.pageSize;
            }
        }

        if (!($.isEmptyObject(this.filterColumnsPartial))) {
            params.filter = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$tableLoading.show();
        }
        request = $.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url:  url || this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
                JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                that.load(res);
                that.trigger('load-success', res);
                if (!silent) that.$tableLoading.hide();
            },
            error: function (res) {
                that.trigger('load-error', res.status, res);
                if (!silent) that.$tableLoading.hide();
            }
        });

        if (this.options.ajax) {
            calculateObjectValue(this, this.options.ajax, [request], null);
        } else {
            if (this._xhr && this._xhr.readyState !== 4) {
                this._xhr.abort();
            }
            this._xhr = $.ajax(request);
        }
    };

    BootstrapTable.prototype.initSearchText = function () {
        if (this.options.search) {
            if (this.options.searchText !== '') {
                var $search = this.$toolbar.find('.search input');
                $search.val(this.options.searchText);
                this.onSearch({currentTarget: $search});
            }
        }
    };

    BootstrapTable.prototype.getCaret = function () {
        var that = this;

        $.each(this.$header.find('th'), function (i, th) {
            $(th).find('.sortable').removeClass('desc asc').addClass($(th).data('field') === that.options.sortName ? that.options.sortOrder : 'both');
        });
    };

    BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length &&
            this.$selectItem.filter(':enabled').length ===
            this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

        this.$selectItem.each(function () {
            $(this).closest('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function () {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = $(this).prop('checked');
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            if (that.header.stateField) {
                row[that.header.stateField] = false;
            }
        });
        this.initHiddenRows();
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        // fix #61: the hidden table reset header bug.
        // fix bug: get $el.css('width') error sometime (height = 500)
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitHeader = function () {
        var that = this,
            fixedBody,
            scrollWidth,
            focused,
            focusedTemp;

        if (that.$el.is(':hidden')) {
            that.timeoutId_ = setTimeout($.proxy(that.fitHeader, that), 100);
            return;
        }
        fixedBody = this.$tableBody.get(0);

        scrollWidth = fixedBody.scrollWidth > fixedBody.clientWidth &&
        fixedBody.scrollHeight > fixedBody.clientHeight + this.$header.outerHeight() ?
            getScrollBarWidth() : 0;

        this.$el.css('margin-top', -this.$header.outerHeight());

        focused = $(':focus');
        if (focused.length > 0) {
            var $th = focused.parents('th');
            if ($th.length > 0) {
                var dataField = $th.attr('data-field');
                if (dataField !== undefined) {
                    var $headerTh = this.$header.find("[data-field='" + dataField + "']");
                    if ($headerTh.length > 0) {
                        $headerTh.find(":input").addClass("focus-temp");
                    }
                }
            }
        }

        this.$header_ = this.$header.clone(true, true);
        this.$selectAll_ = this.$header_.find('[name="btSelectAll"]');
        this.$tableHeader.css({
            'margin-right': scrollWidth
        }).find('table').css('width', this.$el.outerWidth())
            .html('').attr('class', this.$el.attr('class'))
            .append(this.$header_);


        focusedTemp = $('.focus-temp:visible:eq(0)');
        if (focusedTemp.length > 0) {
            focusedTemp.focus();
            this.$header.find('.focus-temp').removeClass('focus-temp');
        }

        // fix bug: $.data() is not working as expected after $.append()
        this.$header.find('th[data-field]').each(function (i) {
            that.$header_.find(sprintf('th[data-field="%s"]', $(this).data('field'))).data($(this).data());
        });

        var visibleFields = this.getVisibleFields(),
            $ths = this.$header_.find('th');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                index = i;

            if (that.options.detailView && !that.options.cardView) {
                if (i === 0) {
                    that.$header_.find('th.detail').find('.fht-cell').width($this.innerWidth());
                }
                index = i - 1;
            }

            var $th = that.$header_.find(sprintf('th[data-field="%s"]', visibleFields[index]));
            if ($th.length > 1) {
                $th = $($ths[$this[0].cellIndex]);
            }

            $th.find('.fht-cell').width($this.innerWidth());
        });
        // horizontal scroll event
        // TODO: it's probably better improving the layout than binding to scroll event
        this.$tableBody.off('scroll').on('scroll', function () {
            that.$tableHeader.scrollLeft($(this).scrollLeft());

            if (that.options.showFooter && !that.options.cardView) {
                that.$tableFooter.scrollLeft($(this).scrollLeft());
            }
        });
        that.trigger('post-header');
    };

    BootstrapTable.prototype.resetFooter = function () {
        var that = this,
            data = that.getData(),
            html = [];

        if (!this.options.showFooter || this.options.cardView) { //do nothing
            return;
        }

        if (!this.options.cardView && this.options.detailView) {
            html.push('<td><div class="th-inner">&nbsp;</div><div class="fht-cell"></div></td>');
        }

        $.each(this.columns, function (i, column) {
            var key,
                falign = '', // footer align style
                valign = '',
                csses = [],
                style = {},
                class_ = sprintf(' class="%s"', column['class']);

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
            valign = sprintf('vertical-align: %s; ', column.valign);

            style = calculateObjectValue(null, that.options.footerStyle);

            if (style && style.css) {
                for (key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            html.push('<td', class_, sprintf(' style="%s"', falign + valign + csses.concat().join('; ')), '>');
            html.push('<div class="th-inner">');

            html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');

            html.push('</div>');
            html.push('<div class="fht-cell"></div>');
            html.push('</div>');
            html.push('</td>');
        });

        this.$tableFooter.find('tr').html(html.join(''));
        this.$tableFooter.show();
        clearTimeout(this.timeoutFooter_);
        this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this),
            this.$el.is(':hidden') ? 100 : 0);
    };

    BootstrapTable.prototype.fitFooter = function () {
        var that = this,
            $footerTd,
            elWidth,
            scrollWidth;

        clearTimeout(this.timeoutFooter_);
        if (this.$el.is(':hidden')) {
            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
            return;
        }

        elWidth = this.$el.css('width');
        scrollWidth = elWidth > this.$tableBody.width() ? getScrollBarWidth() : 0;

        this.$tableFooter.css({
            'margin-right': scrollWidth
        }).find('table').css('width', elWidth)
            .attr('class', this.$el.attr('class'));

        $footerTd = this.$tableFooter.find('td');

        this.$body.find('>tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this);

            $footerTd.eq(i).find('.fht-cell').width($this.innerWidth());
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
            return;
        }
        this.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.getVisibleFields = function () {
        var that = this,
            visibleFields = [];

        $.each(this.header.fields, function (j, field) {
            var column = that.columns[getFieldIndex(that.columns, field)];

            if (!column.visible) {
                return;
            }
            visibleFields.push(field);
        });
        return visibleFields;
    };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var padding = 0;

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = this.$toolbar.outerHeight(true),
                paginationHeight = this.$pagination.outerHeight(true),
                height = this.options.height - toolbarHeight - paginationHeight;

            this.$tableContainer.css('height', height + 'px');
        }

        if (this.options.cardView) {
            // remove the element css
            this.$el.css('margin-top', '0');
            this.$tableContainer.css('padding-bottom', '0');
            this.$tableFooter.hide();
            return;
        }

        if (this.options.showHeader && this.options.height) {
            this.$tableHeader.show();
            this.resetHeader();
            padding += this.$header.outerHeight();
        } else {
            this.$tableHeader.hide();
            this.trigger('post-header');
        }

        if (this.options.showFooter) {
            this.resetFooter();
            if (this.options.height) {
                padding += this.$tableFooter.outerHeight() + 1;
            }
        }

        // Assign the correct sortable arrow
        this.getCaret();
        this.$tableContainer.css('padding-bottom', padding + 'px');
        this.trigger('reset-view');
    };

    BootstrapTable.prototype.getData = function (useCurrentPage) {
        return (this.searchText || !$.isEmptyObject(this.filterColumns) || !$.isEmptyObject(this.filterColumnsPartial)) ?
            (useCurrentPage ? this.data.slice(this.pageFrom - 1, this.pageTo) : this.data) :
            (useCurrentPage ? this.options.data.slice(this.pageFrom - 1, this.pageTo) : this.options.data);
    };

    BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.sidePagination === 'server') {
            this.options.totalRows = data[this.options.totalField];
            fixedScroll = data.fixedScroll;
            data = data[this.options.dataField];
        } else if (!$.isArray(data)) { // support fixedScroll
            fixedScroll = data.fixedScroll;
            data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                continue;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
                this.options.data.splice(i, 1);
                if (this.options.sidePagination === 'server') {
                    this.options.totalRows -= 1;
                }
            }
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.removeAll = function () {
        if (this.options.data.length > 0) {
            this.options.data.splice(0, this.options.data.length);
            this.initSearch();
            this.initPagination();
            this.initBody(true);
        }
    };

    BootstrapTable.prototype.getRowByUniqueId = function (id) {
        var uniqueId = this.options.uniqueId,
            len = this.options.data.length,
            dataRow = null,
            i, row, rowUniqueId;

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (row.hasOwnProperty(uniqueId)) { // uniqueId is a column
                rowUniqueId = row[uniqueId];
            } else if(row._data.hasOwnProperty(uniqueId)) { // uniqueId is a row data property
                rowUniqueId = row._data[uniqueId];
            } else {
                continue;
            }

            if (typeof rowUniqueId === 'string') {
                id = id.toString();
            } else if (typeof rowUniqueId === 'number') {
                if ((Number(rowUniqueId) === rowUniqueId) && (rowUniqueId % 1 === 0)) {
                    id = parseInt(id);
                } else if ((rowUniqueId === Number(rowUniqueId)) && (rowUniqueId !== 0)) {
                    id = parseFloat(id);
                }
            }

            if (rowUniqueId === id) {
                dataRow = row;
                break;
            }
        }

        return dataRow;
    };

    BootstrapTable.prototype.removeByUniqueId = function (id) {
        var len = this.options.data.length,
            row = this.getRowByUniqueId(id);

        if (row) {
            this.options.data.splice(this.options.data.indexOf(row), 1);
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateByUniqueId = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [ params ];

        $.each(allParams, function(i, params) {
            var rowId;

            if (!params.hasOwnProperty('id') || !params.hasOwnProperty('row')) {
                return;
            }

            rowId = $.inArray(that.getRowByUniqueId(params.id), that.options.data);

            if (rowId === -1) {
                return;
            }
            $.extend(that.options.data[rowId], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        this.data.splice(params.index, 0, params.row);
        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {
        var that = this;
        var allParams = $.isArray(params) ? params : [ params ];

        $.each(allParams, function(i, params) {
            if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
                return;
            }
            $.extend(that.options.data[params.index], params.row);
        });

        this.initSearch();
        this.initPagination();
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.initHiddenRows = function () {
        this.hiddenRows = [];
    };

    BootstrapTable.prototype.showRow = function (params) {
        this.toggleRow(params, true);
    };

    BootstrapTable.prototype.hideRow = function (params) {
        this.toggleRow(params, false);
    };

    BootstrapTable.prototype.toggleRow = function (params, visible) {
        var row, index;

        if (params.hasOwnProperty('index')) {
            row = this.getData()[params.index];
        } else if (params.hasOwnProperty('uniqueId')) {
            row = this.getRowByUniqueId(params.uniqueId);
        }

        if (!row) {
            return;
        }

        index = $.inArray(row, this.hiddenRows);

        if (!visible && index === -1) {
            this.hiddenRows.push(row);
        } else if (visible && index > -1) {
            this.hiddenRows.splice(index, 1);
        }
        this.initBody(true);
    };

    BootstrapTable.prototype.getHiddenRows = function (show) {
        var that = this,
            data = this.getData(),
            rows = [];

        $.each(data, function (i, row) {
            if ($.inArray(row, that.hiddenRows) > -1) {
                rows.push(row);
            }
        });
        this.hiddenRows = rows;
        return rows;
    };

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.getVisibleFields()),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('>tr'),
            $td;

        if (this.options.detailView && !this.options.cardView) {
            col += 1;
        }

        $td = $tr.eq(row).find('>td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('>td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
    };

    BootstrapTable.prototype.updateCell = function (params) {
        if (!params.hasOwnProperty('index') ||
            !params.hasOwnProperty('field') ||
            !params.hasOwnProperty('value')) {
            return;
        }
        this.data[params.index][params.field] = params.value;

        if (params.reinit === false) {
            return;
        }
        this.initSort();
        this.initBody(true);
    };

    BootstrapTable.prototype.getOptions = function () {
        return this.options;
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
            // fix #2424: from html with checkbox
            return row[that.header.stateField] === true;
        });
    };

    BootstrapTable.prototype.getAllSelections = function () {
        var that = this;

        return $.grep(this.options.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
    };

    BootstrapTable.prototype.checkInvert = function () {
        var that = this;
        var rows = that.$selectItem.filter(':enabled');
        var checked = rows.filter(':checked');
        rows.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
        that.updateRows();
        that.updateSelected();
        that.trigger('uncheck-some', checked);
        checked = that.getSelections();
        that.trigger('check-some', checked);
    };

    BootstrapTable.prototype.checkAll_ = function (checked) {
        var rows;
        if (!checked) {
            rows = this.getSelections();
        }
        this.$selectAll.add(this.$selectAll_).prop('checked', checked);
        this.$selectItem.filter(':enabled').prop('checked', checked);
        this.updateRows();
        if (checked) {
            rows = this.getSelections();
        }
        this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
    };

    BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
    };

    BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
    };

    BootstrapTable.prototype.check_ = function (checked, index) {
        var $el = this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
        this.trigger(checked ? 'check' : 'uncheck', this.data[index], $el);
    };

    BootstrapTable.prototype.checkBy = function (obj) {
        this.checkBy_(true, obj);
    };

    BootstrapTable.prototype.uncheckBy = function (obj) {
        this.checkBy_(false, obj);
    };

    BootstrapTable.prototype.checkBy_ = function (checked, obj) {
        if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
            return;
        }

        var that = this,
            rows = [];
        $.each(this.options.data, function (index, row) {
            if (!row.hasOwnProperty(obj.field)) {
                return false;
            }
            if ($.inArray(row[obj.field], obj.values) !== -1) {
                var $el = that.$selectItem.filter(':enabled')
                    .filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
                row[that.header.stateField] = checked;
                rows.push(row);
                that.trigger(checked ? 'check' : 'uncheck', row, $el);
            }
        });
        this.updateSelected();
        this.trigger(checked ? 'check-some' : 'uncheck-some', rows);
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .css('margin-top', '0')
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$tableLoading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$tableLoading.hide();
    };

    BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        var button = this.$toolbar.find('button[name="paginationSwitch"] i');
        if (this.options.pagination) {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
        }
        if (params && params.pageNumber) {
            this.options.pageNumber = params.pageNumber;
        }
        if (params && params.pageSize) {
            this.options.pageSize = params.pageSize;
        }
        this.initServer(params && params.silent,
            params && params.query, params && params.url);
        this.trigger('refresh', params);
    };

    BootstrapTable.prototype.resetWidth = function () {
        if (this.options.showHeader && this.options.height) {
            this.fitHeader();
        }
        if (this.options.showFooter) {
            this.fitFooter();
        }
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.columns, field), true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.columns, field), false, true);
    };

    BootstrapTable.prototype.getHiddenColumns = function () {
        return $.grep(this.columns, function (column) {
            return !column.visible;
        });
    };

    BootstrapTable.prototype.getVisibleColumns = function () {
        return $.grep(this.columns, function (column) {
            return column.visible;
        });
    };

    BootstrapTable.prototype.toggleAllColumns = function (visible) {
        $.each(this.columns, function (i, column) {
            this.columns[i].visible = visible;
        });

        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();
        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.showAllColumns = function () {
        this.toggleAllColumns(true);
    };

    BootstrapTable.prototype.hideAllColumns = function () {
        this.toggleAllColumns(false);
    };

    BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.scrollTo = function (value) {
        if (typeof value === 'string') {
            value = value === 'bottom' ? this.$tableBody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
            this.$tableBody.scrollTop(value);
        }
        if (typeof value === 'undefined') {
            return this.$tableBody.scrollTop();
        }
    };

    BootstrapTable.prototype.getScrollPosition = function () {
        return this.scrollTo();
    };

    BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        // Fixed remove toolbar when click cardView button.
        //that.initToolbar();
        this.initBody();
        this.trigger('toggle', this.options.cardView);
    };

    BootstrapTable.prototype.refreshOptions = function (options) {
        //If the objects are equivalent then avoid the call of destroy / init methods
        if (compareObjects(this.options, options, true)) {
            return;
        }
        this.options = $.extend(this.options, options);
        this.trigger('refresh-options', this.options);
        this.destroy();
        this.init();
    };

    BootstrapTable.prototype.resetSearch = function (text) {
        var $search = this.$toolbar.find('.search input');
        $search.val(text || '');
        this.onSearch({currentTarget: $search});
    };

    BootstrapTable.prototype.expandRow_ = function (expand, index) {
        var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', index));
        if ($tr.next().is('tr.detail-view') === (expand ? false : true)) {
            $tr.find('> td > .detail-icon').click();
        }
    };

    BootstrapTable.prototype.expandRow = function (index) {
        this.expandRow_(true, index);
    };

    BootstrapTable.prototype.collapseRow = function (index) {
        this.expandRow_(false, index);
    };

    BootstrapTable.prototype.expandAllRows = function (isSubTable) {
        if (isSubTable) {
            var $tr = this.$body.find(sprintf('> tr[data-index="%s"]', 0)),
                that = this,
                detailIcon = null,
                executeInterval = false,
                idInterval = -1;

            if (!$tr.next().is('tr.detail-view')) {
                $tr.find('> td > .detail-icon').click();
                executeInterval = true;
            } else if (!$tr.next().next().is('tr.detail-view')) {
                $tr.next().find(".detail-icon").click();
                executeInterval = true;
            }

            if (executeInterval) {
                try {
                    idInterval = setInterval(function () {
                        detailIcon = that.$body.find("tr.detail-view").last().find(".detail-icon");
                        if (detailIcon.length > 0) {
                            detailIcon.click();
                        } else {
                            clearInterval(idInterval);
                        }
                    }, 1);
                } catch (ex) {
                    clearInterval(idInterval);
                }
            }
        } else {
            var trs = this.$body.children();
            for (var i = 0; i < trs.length; i++) {
                this.expandRow_(true, $(trs[i]).data("index"));
            }
        }
    };

    BootstrapTable.prototype.collapseAllRows = function (isSubTable) {
        if (isSubTable) {
            this.expandRow_(false, 0);
        } else {
            var trs = this.$body.children();
            for (var i = 0; i < trs.length; i++) {
                this.expandRow_(false, $(trs[i]).data("index"));
            }
        }
    };

    BootstrapTable.prototype.updateFormatText = function (name, text) {
        if (this.options[sprintf('format%s', name)]) {
            if (typeof text === 'string') {
                this.options[sprintf('format%s', name)] = function () {
                    return text;
                };
            } else if (typeof text === 'function') {
                this.options[sprintf('format%s', name)] = text;
            }
        }
        this.initToolbar();
        this.initPagination();
        this.initBody();
    };

    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getAllSelections', 'getData',
        'load', 'append', 'prepend', 'remove', 'removeAll',
        'insertRow', 'updateRow', 'updateCell', 'updateByUniqueId', 'removeByUniqueId',
        'getRowByUniqueId', 'showRow', 'hideRow', 'getHiddenRows',
        'mergeCells',
        'checkAll', 'uncheckAll', 'checkInvert',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'resetWidth',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn', 'getHiddenColumns', 'getVisibleColumns',
        'showAllColumns', 'hideAllColumns',
        'filterBy',
        'scrollTo',
        'getScrollPosition',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView',
        'refreshOptions',
        'resetSearch',
        'expandRow', 'collapseRow', 'expandAllRows', 'collapseAllRows',
        'updateFormatText'
    ];

    $.fn.bootstrapTable = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;
    $.fn.bootstrapTable.utils = {
        sprintf: sprintf,
        getFieldIndex: getFieldIndex,
        compareObjects: compareObjects,
        calculateObjectValue: calculateObjectValue,
        getItemField: getItemField,
        objectKeys: objectKeys,
        isIEBrowser: isIEBrowser
    };

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });
})(jQuery);


/***/ })

},[50]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLXRhYmxlL2Rpc3QvYm9vdHN0cmFwLXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLHVCQUF1QjtBQUMxQztBQUNBOztBQUVBLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLG9CQUFvQjtBQUN2Qyx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixhQUFhO0FBQ3hDO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLDhCQUE4QjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFDdEMsc0NBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxpQkFBaUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyxxQkFBcUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQyxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixpQkFBaUIsTUFBTTs7QUFFN0MsNEJBQTRCLGdCQUFnQixRQUFRO0FBQ3BELGdDQUFnQyxnQkFBZ0I7QUFDaEQscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRDtBQUNqRCxnREFBZ0Q7QUFDaEQsb0RBQW9EO0FBQ3BELDRDQUE0QztBQUM1Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7O0FBRWI7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsK0JBQStCLCtCQUErQjs7QUFFOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsMkJBQTJCO0FBQzNFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsU0FBUztBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUZBQXFGOztBQUVyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQTBGO0FBQzFGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVDQUF1QyxpQkFBaUI7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHVCQUF1QjtBQUN0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnRUFBZ0U7QUFDaEU7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNkNBQTZDO0FBQzdDLGlEQUFpRDs7QUFFakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvR0FBb0c7QUFDcEc7O0FBRUEsMEZBQTBGLGFBQWE7O0FBRXZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyw2QkFBNkI7QUFDdEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsUUFBUTtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCLFFBQVE7QUFDakM7O0FBRUEsK0NBQStDO0FBQy9DO0FBQ0EsYUFBYSw4Q0FBOEM7QUFDM0Q7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsbUJBQW1CO0FBQ3hDLHlCQUF5QixtQkFBbUI7QUFDNUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwiZmlsZSI6Ii9qcy92ZW5kb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgemhpeGluIHdlbiA8d2VuemhpeGluMjAxMEBnbWFpbC5jb20+XG4gKiB2ZXJzaW9uOiAxLjExLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS93ZW56aGl4aW4vYm9vdHN0cmFwLXRhYmxlL1xuICovXG5cbihmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIFRPT0xTIERFRklOSVRJT05cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YXIgY2FjaGVkV2lkdGggPSBudWxsO1xuXG4gICAgLy8gaXQgb25seSBkb2VzICclcycsIGFuZCByZXR1cm4gJycgd2hlbiBhcmd1bWVudHMgYXJlIHVuZGVmaW5lZFxuICAgIHZhciBzcHJpbnRmID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlLFxuICAgICAgICAgICAgaSA9IDE7XG5cbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzW2krK107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZsYWcgPyBzdHIgOiAnJztcbiAgICB9O1xuXG4gICAgdmFyIGdldFByb3BlcnR5RnJvbU90aGVyID0gZnVuY3Rpb24gKGxpc3QsIGZyb20sIHRvLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICAgICQuZWFjaChsaXN0LCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bZnJvbV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlbVt0b107XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgZ2V0RmllbGRJbmRleCA9IGZ1bmN0aW9uIChjb2x1bW5zLCBmaWVsZCkge1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICAkLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGksIGNvbHVtbikge1xuICAgICAgICAgICAgaWYgKGNvbHVtbi5maWVsZCA9PT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfTtcblxuICAgIC8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvd2VueWkvNDduejdlejkvMy9cbiAgICB2YXIgc2V0RmllbGRJbmRleCA9IGZ1bmN0aW9uIChjb2x1bW5zKSB7XG4gICAgICAgIHZhciBpLCBqLCBrLFxuICAgICAgICAgICAgdG90YWxDb2wgPSAwLFxuICAgICAgICAgICAgZmxhZyA9IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5zWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3RhbENvbCArPSBjb2x1bW5zWzBdW2ldLmNvbHNwYW4gfHwgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmbGFnW2ldID0gW107XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgdG90YWxDb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGZsYWdbaV1bal0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uc1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciByID0gY29sdW1uc1tpXVtqXSxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbiA9IHIucm93c3BhbiB8fCAxLFxuICAgICAgICAgICAgICAgICAgICBjb2xzcGFuID0gci5jb2xzcGFuIHx8IDEsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJC5pbkFycmF5KGZhbHNlLCBmbGFnW2ldKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2xzcGFuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHIuZmllbGRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGZpZWxkIGlzIHVuZGVmaW5lZCwgdXNlIGluZGV4IGluc3RlYWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByLmZpZWxkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgci5maWVsZCA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd3NwYW47IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBmbGFnW2kgKyBrXVtpbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgY29sc3BhbjsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdbaV1baW5kZXggKyBrXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRTY3JvbGxCYXJXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNhY2hlZFdpZHRoID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgaW5uZXIgPSAkKCc8cC8+JykuYWRkQ2xhc3MoJ2ZpeGVkLXRhYmxlLXNjcm9sbC1pbm5lcicpLFxuICAgICAgICAgICAgICAgIG91dGVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2ZpeGVkLXRhYmxlLXNjcm9sbC1vdXRlcicpLFxuICAgICAgICAgICAgICAgIHcxLCB3MjtcblxuICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKGlubmVyKTtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQob3V0ZXIpO1xuXG4gICAgICAgICAgICB3MSA9IGlubmVyWzBdLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgb3V0ZXIuY3NzKCdvdmVyZmxvdycsICdzY3JvbGwnKTtcbiAgICAgICAgICAgIHcyID0gaW5uZXJbMF0ub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgIGlmICh3MSA9PT0gdzIpIHtcbiAgICAgICAgICAgICAgICB3MiA9IG91dGVyWzBdLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRlci5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNhY2hlZFdpZHRoID0gdzEgLSB3MjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FjaGVkV2lkdGg7XG4gICAgfTtcblxuICAgIHZhciBjYWxjdWxhdGVPYmplY3RWYWx1ZSA9IGZ1bmN0aW9uIChzZWxmLCBuYW1lLCBhcmdzLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBuYW1lO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgb2JqLmZ1bmMxLmZ1bmMyXG4gICAgICAgICAgICB2YXIgbmFtZXMgPSBuYW1lLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgICAgIGlmIChuYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IHdpbmRvdztcbiAgICAgICAgICAgICAgICAkLmVhY2gobmFtZXMsIGZ1bmN0aW9uIChpLCBmKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgPSBmdW5jW2ZdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gd2luZG93W25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoc2VsZiwgYXJncyB8fCBbXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFmdW5jICYmIHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyAmJiBzcHJpbnRmLmFwcGx5KHRoaXMsIFtuYW1lXS5jb25jYXQoYXJncykpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseSh0aGlzLCBbbmFtZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH07XG5cbiAgICB2YXIgY29tcGFyZU9iamVjdHMgPSBmdW5jdGlvbiAob2JqZWN0QSwgb2JqZWN0QiwgY29tcGFyZUxlbmd0aCkge1xuICAgICAgICAvLyBDcmVhdGUgYXJyYXlzIG9mIHByb3BlcnR5IG5hbWVzXG4gICAgICAgIHZhciBvYmplY3RBUHJvcGVydGllcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdEEpLFxuICAgICAgICAgICAgb2JqZWN0QlByb3BlcnRpZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3RCKSxcbiAgICAgICAgICAgIHByb3BOYW1lID0gJyc7XG5cbiAgICAgICAgaWYgKGNvbXBhcmVMZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIElmIG51bWJlciBvZiBwcm9wZXJ0aWVzIGlzIGRpZmZlcmVudCwgb2JqZWN0cyBhcmUgbm90IGVxdWl2YWxlbnRcbiAgICAgICAgICAgIGlmIChvYmplY3RBUHJvcGVydGllcy5sZW5ndGggIT09IG9iamVjdEJQcm9wZXJ0aWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0QVByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHByb3BOYW1lID0gb2JqZWN0QVByb3BlcnRpZXNbaV07XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBub3QgaW4gdGhlIG9iamVjdCBCIHByb3BlcnRpZXMsIGNvbnRpbnVlIHdpdGggdGhlIG5leHQgcHJvcGVydHlcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkocHJvcE5hbWUsIG9iamVjdEJQcm9wZXJ0aWVzKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdmFsdWVzIG9mIHNhbWUgcHJvcGVydHkgYXJlIG5vdCBlcXVhbCwgb2JqZWN0cyBhcmUgbm90IGVxdWl2YWxlbnRcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0QVtwcm9wTmFtZV0gIT09IG9iamVjdEJbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSBtYWRlIGl0IHRoaXMgZmFyLCBvYmplY3RzIGFyZSBjb25zaWRlcmVkIGVxdWl2YWxlbnRcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIHZhciBlc2NhcGVIVE1MID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHRleHRcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csICcmIzAzOTsnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9gL2csICcmI3g2MDsnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgdmFyIGdldFJlYWxEYXRhQXR0ciA9IGZ1bmN0aW9uIChkYXRhQXR0cikge1xuICAgICAgICBmb3IgKHZhciBhdHRyIGluIGRhdGFBdHRyKSB7XG4gICAgICAgICAgICB2YXIgYXV4QXR0ciA9IGF0dHIuc3BsaXQoLyg/PVtBLVpdKS8pLmpvaW4oJy0nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGF1eEF0dHIgIT09IGF0dHIpIHtcbiAgICAgICAgICAgICAgICBkYXRhQXR0clthdXhBdHRyXSA9IGRhdGFBdHRyW2F0dHJdO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhQXR0clthdHRyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhQXR0cjtcbiAgICB9O1xuXG4gICAgdmFyIGdldEl0ZW1GaWVsZCA9IGZ1bmN0aW9uIChpdGVtLCBmaWVsZCwgZXNjYXBlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZCAhPT0gJ3N0cmluZycgfHwgaXRlbS5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBlc2NhcGUgPyBlc2NhcGVIVE1MKGl0ZW1bZmllbGRdKSA6IGl0ZW1bZmllbGRdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9wcyA9IGZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgIGZvciAodmFyIHAgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgJiYgdmFsdWVbcHJvcHNbcF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlc2NhcGUgPyBlc2NhcGVIVE1MKHZhbHVlKSA6IHZhbHVlO1xuICAgIH07XG5cbiAgICB2YXIgaXNJRUJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIShuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIFwiKSA+IDAgfHwgISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LipydlxcOjExXFwuLykpO1xuICAgIH07XG5cbiAgICB2YXIgb2JqZWN0S2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3Qva2V5c1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICBoYXNEb250RW51bUJ1ZyA9ICEoeyB0b1N0cmluZzogbnVsbCB9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgZG9udEVudW1zID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWVPZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGFzT3duUHJvcGVydHknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW10sIHByb3AsIGk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHByb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBCT09UU1RSQVAgVEFCTEUgQ0xBU1MgREVGSU5JVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHZhciBCb290c3RyYXBUYWJsZSA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRlbF8gPSB0aGlzLiRlbC5jbG9uZSgpO1xuICAgICAgICB0aGlzLnRpbWVvdXRJZF8gPSAwO1xuICAgICAgICB0aGlzLnRpbWVvdXRGb290ZXJfID0gMDtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUuREVGQVVMVFMgPSB7XG4gICAgICAgIGNsYXNzZXM6ICd0YWJsZSB0YWJsZS1ob3ZlcicsXG4gICAgICAgIHNvcnRDbGFzczogdW5kZWZpbmVkLFxuICAgICAgICBsb2NhbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZFRleHQ6ICctJyxcbiAgICAgICAgc29ydE5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgc29ydE9yZGVyOiAnYXNjJyxcbiAgICAgICAgc29ydFN0YWJsZTogZmFsc2UsXG4gICAgICAgIHN0cmlwZWQ6IGZhbHNlLFxuICAgICAgICBjb2x1bW5zOiBbW11dLFxuICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgdG90YWxGaWVsZDogJ3RvdGFsJyxcbiAgICAgICAgZGF0YUZpZWxkOiAncm93cycsXG4gICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgIHVybDogdW5kZWZpbmVkLFxuICAgICAgICBhamF4OiB1bmRlZmluZWQsXG4gICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBhamF4T3B0aW9uczoge30sXG4gICAgICAgIHF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICB9LFxuICAgICAgICBxdWVyeVBhcmFtc1R5cGU6ICdsaW1pdCcsIC8vIHVuZGVmaW5lZFxuICAgICAgICByZXNwb25zZUhhbmRsZXI6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHBhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICBvbmx5SW5mb1BhZ2luYXRpb246IGZhbHNlLFxuICAgICAgICBwYWdpbmF0aW9uTG9vcDogdHJ1ZSxcbiAgICAgICAgc2lkZVBhZ2luYXRpb246ICdjbGllbnQnLCAvLyBjbGllbnQgb3Igc2VydmVyXG4gICAgICAgIHRvdGFsUm93czogMCwgLy8gc2VydmVyIHNpZGUgbmVlZCB0byBzZXRcbiAgICAgICAgcGFnZU51bWJlcjogMSxcbiAgICAgICAgcGFnZVNpemU6IDEwLFxuICAgICAgICBwYWdlTGlzdDogWzEwLCAyNSwgNTAsIDEwMF0sXG4gICAgICAgIHBhZ2luYXRpb25IQWxpZ246ICdyaWdodCcsIC8vcmlnaHQsIGxlZnRcbiAgICAgICAgcGFnaW5hdGlvblZBbGlnbjogJ2JvdHRvbScsIC8vYm90dG9tLCB0b3AsIGJvdGhcbiAgICAgICAgcGFnaW5hdGlvbkRldGFpbEhBbGlnbjogJ2xlZnQnLCAvL3JpZ2h0LCBsZWZ0XG4gICAgICAgIHBhZ2luYXRpb25QcmVUZXh0OiAnJmxzYXF1bzsnLFxuICAgICAgICBwYWdpbmF0aW9uTmV4dFRleHQ6ICcmcnNhcXVvOycsXG4gICAgICAgIHNlYXJjaDogZmFsc2UsXG4gICAgICAgIHNlYXJjaE9uRW50ZXJLZXk6IGZhbHNlLFxuICAgICAgICBzdHJpY3RTZWFyY2g6IGZhbHNlLFxuICAgICAgICBzZWFyY2hBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc2VsZWN0SXRlbU5hbWU6ICdidFNlbGVjdEl0ZW0nLFxuICAgICAgICBzaG93SGVhZGVyOiB0cnVlLFxuICAgICAgICBzaG93Rm9vdGVyOiBmYWxzZSxcbiAgICAgICAgc2hvd0NvbHVtbnM6IGZhbHNlLFxuICAgICAgICBzaG93UGFnaW5hdGlvblN3aXRjaDogZmFsc2UsXG4gICAgICAgIHNob3dSZWZyZXNoOiBmYWxzZSxcbiAgICAgICAgc2hvd1RvZ2dsZTogZmFsc2UsXG4gICAgICAgIGJ1dHRvbnNBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgc21hcnREaXNwbGF5OiB0cnVlLFxuICAgICAgICBlc2NhcGU6IGZhbHNlLFxuICAgICAgICBtaW5pbXVtQ291bnRDb2x1bW5zOiAxLFxuICAgICAgICBpZEZpZWxkOiB1bmRlZmluZWQsXG4gICAgICAgIHVuaXF1ZUlkOiB1bmRlZmluZWQsXG4gICAgICAgIGNhcmRWaWV3OiBmYWxzZSxcbiAgICAgICAgZGV0YWlsVmlldzogZmFsc2UsXG4gICAgICAgIGRldGFpbEZvcm1hdHRlcjogZnVuY3Rpb24gKGluZGV4LCByb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSxcbiAgICAgICAgdHJpbU9uU2VhcmNoOiB0cnVlLFxuICAgICAgICBjbGlja1RvU2VsZWN0OiBmYWxzZSxcbiAgICAgICAgc2luZ2xlU2VsZWN0OiBmYWxzZSxcbiAgICAgICAgdG9vbGJhcjogdW5kZWZpbmVkLFxuICAgICAgICB0b29sYmFyQWxpZ246ICdsZWZ0JyxcbiAgICAgICAgY2hlY2tib3hIZWFkZXI6IHRydWUsXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxuICAgICAgICBzaWxlbnRTb3J0OiB0cnVlLFxuICAgICAgICBtYWludGFpblNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoVGltZU91dDogNTAwLFxuICAgICAgICBzZWFyY2hUZXh0OiAnJyxcbiAgICAgICAgaWNvblNpemU6IHVuZGVmaW5lZCxcbiAgICAgICAgYnV0dG9uc0NsYXNzOiAnZGVmYXVsdCcsXG4gICAgICAgIGljb25zUHJlZml4OiAnZ2x5cGhpY29uJywgLy8gZ2x5cGhpY29uIG9mIGZhIChmb250IGF3ZXNvbWUpXG4gICAgICAgIGljb25zOiB7XG4gICAgICAgICAgICBwYWdpbmF0aW9uU3dpdGNoRG93bjogJ2dseXBoaWNvbi1jb2xsYXBzZS1kb3duIGljb24tY2hldnJvbi1kb3duJyxcbiAgICAgICAgICAgIHBhZ2luYXRpb25Td2l0Y2hVcDogJ2dseXBoaWNvbi1jb2xsYXBzZS11cCBpY29uLWNoZXZyb24tdXAnLFxuICAgICAgICAgICAgcmVmcmVzaDogJ2dseXBoaWNvbi1yZWZyZXNoIGljb24tcmVmcmVzaCcsXG4gICAgICAgICAgICB0b2dnbGU6ICdnbHlwaGljb24tbGlzdC1hbHQgaWNvbi1saXN0LWFsdCcsXG4gICAgICAgICAgICBjb2x1bW5zOiAnZ2x5cGhpY29uLXRoIGljb24tdGgnLFxuICAgICAgICAgICAgZGV0YWlsT3BlbjogJ2dseXBoaWNvbi1wbHVzIGljb24tcGx1cycsXG4gICAgICAgICAgICBkZXRhaWxDbG9zZTogJ2dseXBoaWNvbi1taW51cyBpY29uLW1pbnVzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGN1c3RvbVNlYXJjaDogJC5ub29wLFxuXG4gICAgICAgIGN1c3RvbVNvcnQ6ICQubm9vcCxcblxuICAgICAgICByb3dTdHlsZTogZnVuY3Rpb24gKHJvdywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICByb3dBdHRyaWJ1dGVzOiBmdW5jdGlvbiAocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvb3RlclN0eWxlOiBmdW5jdGlvbiAocm93LCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uQWxsOiBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNsaWNrQ2VsbDogZnVuY3Rpb24gKGZpZWxkLCB2YWx1ZSwgcm93LCAkZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkRibENsaWNrQ2VsbDogZnVuY3Rpb24gKGZpZWxkLCB2YWx1ZSwgcm93LCAkZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkNsaWNrUm93OiBmdW5jdGlvbiAoaXRlbSwgJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25EYmxDbGlja1JvdzogZnVuY3Rpb24gKGl0ZW0sICRlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU29ydDogZnVuY3Rpb24gKG5hbWUsIG9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hlY2s6IGZ1bmN0aW9uIChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25VbmNoZWNrOiBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hlY2tBbGw6IGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVW5jaGVja0FsbDogZnVuY3Rpb24gKHJvd3MpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGVja1NvbWU6IGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uVW5jaGVja1NvbWU6IGZ1bmN0aW9uIChyb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9hZFN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9hZEVycm9yOiBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29sdW1uU3dpdGNoOiBmdW5jdGlvbiAoZmllbGQsIGNoZWNrZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25QYWdlQ2hhbmdlOiBmdW5jdGlvbiAobnVtYmVyLCBzaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU2VhcmNoOiBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblRvZ2dsZTogZnVuY3Rpb24gKGNhcmRWaWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUHJlQm9keTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Qb3N0Qm9keTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvblBvc3RIZWFkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FeHBhbmRSb3c6IGZ1bmN0aW9uIChpbmRleCwgcm93LCAkZGV0YWlsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29sbGFwc2VSb3c6IGZ1bmN0aW9uIChpbmRleCwgcm93KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVmcmVzaE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIG9uUmVmcmVzaDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25SZXNldFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5MT0NBTEVTID0ge307XG5cbiAgICBCb290c3RyYXBUYWJsZS5MT0NBTEVTWydlbi1VUyddID0gQm9vdHN0cmFwVGFibGUuTE9DQUxFUy5lbiA9IHtcbiAgICAgICAgZm9ybWF0TG9hZGluZ01lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnTG9hZGluZywgcGxlYXNlIHdhaXQuLi4nO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRSZWNvcmRzUGVyUGFnZTogZnVuY3Rpb24gKHBhZ2VOdW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBzcHJpbnRmKCclcyByb3dzIHBlciBwYWdlJywgcGFnZU51bWJlcik7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFNob3dpbmdSb3dzOiBmdW5jdGlvbiAocGFnZUZyb20sIHBhZ2VUbywgdG90YWxSb3dzKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ByaW50ZignU2hvd2luZyAlcyB0byAlcyBvZiAlcyByb3dzJywgcGFnZUZyb20sIHBhZ2VUbywgdG90YWxSb3dzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0RGV0YWlsUGFnaW5hdGlvbjogZnVuY3Rpb24gKHRvdGFsUm93cykge1xuICAgICAgICAgICAgcmV0dXJuIHNwcmludGYoJ1Nob3dpbmcgJXMgcm93cycsIHRvdGFsUm93cyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFNlYXJjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdTZWFyY2gnO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXROb01hdGNoZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnTm8gbWF0Y2hpbmcgcmVjb3JkcyBmb3VuZCc7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdFBhZ2luYXRpb25Td2l0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnSGlkZS9TaG93IHBhZ2luYXRpb24nO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRSZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1JlZnJlc2gnO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRUb2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnVG9nZ2xlJztcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0Q29sdW1uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdDb2x1bW5zJztcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0QWxsUm93czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdBbGwnO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuZXh0ZW5kKEJvb3RzdHJhcFRhYmxlLkRFRkFVTFRTLCBCb290c3RyYXBUYWJsZS5MT0NBTEVTWydlbi1VUyddKTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLkNPTFVNTl9ERUZBVUxUUyA9IHtcbiAgICAgICAgcmFkaW86IGZhbHNlLFxuICAgICAgICBjaGVja2JveDogZmFsc2UsXG4gICAgICAgIGNoZWNrYm94RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZmllbGQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgdGl0bGVUb29sdGlwOiB1bmRlZmluZWQsXG4gICAgICAgICdjbGFzcyc6IHVuZGVmaW5lZCxcbiAgICAgICAgYWxpZ246IHVuZGVmaW5lZCwgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxuICAgICAgICBoYWxpZ246IHVuZGVmaW5lZCwgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxuICAgICAgICBmYWxpZ246IHVuZGVmaW5lZCwgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxuICAgICAgICB2YWxpZ246IHVuZGVmaW5lZCwgLy8gdG9wLCBtaWRkbGUsIGJvdHRvbVxuICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICAgIG9yZGVyOiAnYXNjJywgLy8gYXNjLCBkZXNjXG4gICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgIHN3aXRjaGFibGU6IHRydWUsXG4gICAgICAgIGNsaWNrVG9TZWxlY3Q6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogdW5kZWZpbmVkLFxuICAgICAgICBmb290ZXJGb3JtYXR0ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgZXZlbnRzOiB1bmRlZmluZWQsXG4gICAgICAgIHNvcnRlcjogdW5kZWZpbmVkLFxuICAgICAgICBzb3J0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBjZWxsU3R5bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiB0cnVlLFxuICAgICAgICBjYXJkVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgZXNjYXBlIDogZmFsc2VcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUuRVZFTlRTID0ge1xuICAgICAgICAnYWxsLmJzLnRhYmxlJzogJ29uQWxsJyxcbiAgICAgICAgJ2NsaWNrLWNlbGwuYnMudGFibGUnOiAnb25DbGlja0NlbGwnLFxuICAgICAgICAnZGJsLWNsaWNrLWNlbGwuYnMudGFibGUnOiAnb25EYmxDbGlja0NlbGwnLFxuICAgICAgICAnY2xpY2stcm93LmJzLnRhYmxlJzogJ29uQ2xpY2tSb3cnLFxuICAgICAgICAnZGJsLWNsaWNrLXJvdy5icy50YWJsZSc6ICdvbkRibENsaWNrUm93JyxcbiAgICAgICAgJ3NvcnQuYnMudGFibGUnOiAnb25Tb3J0JyxcbiAgICAgICAgJ2NoZWNrLmJzLnRhYmxlJzogJ29uQ2hlY2snLFxuICAgICAgICAndW5jaGVjay5icy50YWJsZSc6ICdvblVuY2hlY2snLFxuICAgICAgICAnY2hlY2stYWxsLmJzLnRhYmxlJzogJ29uQ2hlY2tBbGwnLFxuICAgICAgICAndW5jaGVjay1hbGwuYnMudGFibGUnOiAnb25VbmNoZWNrQWxsJyxcbiAgICAgICAgJ2NoZWNrLXNvbWUuYnMudGFibGUnOiAnb25DaGVja1NvbWUnLFxuICAgICAgICAndW5jaGVjay1zb21lLmJzLnRhYmxlJzogJ29uVW5jaGVja1NvbWUnLFxuICAgICAgICAnbG9hZC1zdWNjZXNzLmJzLnRhYmxlJzogJ29uTG9hZFN1Y2Nlc3MnLFxuICAgICAgICAnbG9hZC1lcnJvci5icy50YWJsZSc6ICdvbkxvYWRFcnJvcicsXG4gICAgICAgICdjb2x1bW4tc3dpdGNoLmJzLnRhYmxlJzogJ29uQ29sdW1uU3dpdGNoJyxcbiAgICAgICAgJ3BhZ2UtY2hhbmdlLmJzLnRhYmxlJzogJ29uUGFnZUNoYW5nZScsXG4gICAgICAgICdzZWFyY2guYnMudGFibGUnOiAnb25TZWFyY2gnLFxuICAgICAgICAndG9nZ2xlLmJzLnRhYmxlJzogJ29uVG9nZ2xlJyxcbiAgICAgICAgJ3ByZS1ib2R5LmJzLnRhYmxlJzogJ29uUHJlQm9keScsXG4gICAgICAgICdwb3N0LWJvZHkuYnMudGFibGUnOiAnb25Qb3N0Qm9keScsXG4gICAgICAgICdwb3N0LWhlYWRlci5icy50YWJsZSc6ICdvblBvc3RIZWFkZXInLFxuICAgICAgICAnZXhwYW5kLXJvdy5icy50YWJsZSc6ICdvbkV4cGFuZFJvdycsXG4gICAgICAgICdjb2xsYXBzZS1yb3cuYnMudGFibGUnOiAnb25Db2xsYXBzZVJvdycsXG4gICAgICAgICdyZWZyZXNoLW9wdGlvbnMuYnMudGFibGUnOiAnb25SZWZyZXNoT3B0aW9ucycsXG4gICAgICAgICdyZXNldC12aWV3LmJzLnRhYmxlJzogJ29uUmVzZXRWaWV3JyxcbiAgICAgICAgJ3JlZnJlc2guYnMudGFibGUnOiAnb25SZWZyZXNoJ1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0TG9jYWxlKCk7XG4gICAgICAgIHRoaXMuaW5pdENvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLmluaXRUYWJsZSgpO1xuICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgdGhpcy5pbml0RGF0YSgpO1xuICAgICAgICB0aGlzLmluaXRIaWRkZW5Sb3dzKCk7XG4gICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xuICAgICAgICB0aGlzLmluaXRUb29sYmFyKCk7XG4gICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2hUZXh0KCk7XG4gICAgICAgIHRoaXMuaW5pdFNlcnZlcigpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdExvY2FsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2NhbGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHRoaXMub3B0aW9ucy5sb2NhbGUuc3BsaXQoLy18Xy8pO1xuICAgICAgICAgICAgcGFydHNbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChwYXJ0c1sxXSkgcGFydHNbMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGlmICgkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbdGhpcy5vcHRpb25zLmxvY2FsZV0pIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbGUgYXMgcmVxdWVzdGVkXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbdGhpcy5vcHRpb25zLmxvY2FsZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbcGFydHMuam9pbignLScpXSkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsZSB3aXRoIHNlcCBzZXQgdG8gLSAoaW4gY2FzZSBvcmlnaW5hbCB3YXMgc3BlY2lmaWVkIHdpdGggXylcbiAgICAgICAgICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnMsICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlc1twYXJ0cy5qb2luKCctJyldKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJC5mbi5ib290c3RyYXBUYWJsZS5sb2NhbGVzW3BhcnRzWzBdXSkge1xuICAgICAgICAgICAgICAgIC8vIHNob3J0IGxvY2FsZSBsYW5ndWFnZSBjb2RlIChpLmUuICdlbicpXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbcGFydHNbMF1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdENvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJChbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJvb3RzdHJhcC10YWJsZVwiPicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXRvb2xiYXJcIj48L2Rpdj4nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25WQWxpZ24gPT09ICd0b3AnIHx8IHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAnYm90aCcgP1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtcGFnaW5hdGlvblwiIHN0eWxlPVwiY2xlYXI6IGJvdGg7XCI+PC9kaXY+JyA6XG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWNvbnRhaW5lclwiPicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWhlYWRlclwiPjx0YWJsZT48L3RhYmxlPjwvZGl2PicsXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWJvZHlcIj4nLFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS1sb2FkaW5nXCI+JyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRMb2FkaW5nTWVzc2FnZSgpLFxuICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtZm9vdGVyXCI+PHRhYmxlPjx0cj48L3RyPjwvdGFibGU+PC9kaXY+JyxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduID09PSAnYm90dG9tJyB8fCB0aGlzLm9wdGlvbnMucGFnaW5hdGlvblZBbGlnbiA9PT0gJ2JvdGgnID9cbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXBhZ2luYXRpb25cIj48L2Rpdj4nIDpcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXS5qb2luKCcnKSk7XG5cbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmluc2VydEFmdGVyKHRoaXMuJGVsKTtcbiAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWNvbnRhaW5lcicpO1xuICAgICAgICB0aGlzLiR0YWJsZUhlYWRlciA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtaGVhZGVyJyk7XG4gICAgICAgIHRoaXMuJHRhYmxlQm9keSA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtYm9keScpO1xuICAgICAgICB0aGlzLiR0YWJsZUxvYWRpbmcgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWxvYWRpbmcnKTtcbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIgPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLWZvb3RlcicpO1xuICAgICAgICB0aGlzLiR0b29sYmFyID0gdGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS10b29sYmFyJyk7XG4gICAgICAgIHRoaXMuJHBhZ2luYXRpb24gPSB0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLXBhZ2luYXRpb24nKTtcblxuICAgICAgICB0aGlzLiR0YWJsZUJvZHkuYXBwZW5kKHRoaXMuJGVsKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLmFmdGVyKCc8ZGl2IGNsYXNzPVwiY2xlYXJmaXhcIj48L2Rpdj4nKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcyk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3RhYmxlLXN0cmlwZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJC5pbkFycmF5KCd0YWJsZS1uby1ib3JkZXJlZCcsIHRoaXMub3B0aW9ucy5jbGFzc2VzLnNwbGl0KCcgJykpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVDb250YWluZXIuYWRkQ2xhc3MoJ3RhYmxlLW5vLWJvcmRlcmVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRUYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgY29sdW1ucyA9IFtdLFxuICAgICAgICAgICAgZGF0YSA9IFtdO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlciA9IHRoaXMuJGVsLmZpbmQoJz50aGVhZCcpO1xuICAgICAgICBpZiAoIXRoaXMuJGhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlciA9ICQoJzx0aGVhZD48L3RoZWFkPicpLmFwcGVuZFRvKHRoaXMuJGVsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndHInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBbXTtcblxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIEZpeCAjMjAxNCAtIGdldEZpZWxkSW5kZXggYW5kIGVsc2V3aGVyZSBhc3N1bWUgdGhpcyBpcyBzdHJpbmcsIGNhdXNlcyBpc3N1ZXMgaWYgbm90XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAkKHRoaXMpLmRhdGEoJ2ZpZWxkJykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnZmllbGQnLCAkKHRoaXMpLmRhdGEoJ2ZpZWxkJykgKyAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbHVtbi5wdXNoKCQuZXh0ZW5kKHt9LCB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkKHRoaXMpLmh0bWwoKSxcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJCh0aGlzKS5hdHRyKCdjbGFzcycpLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZVRvb2x0aXA6ICQodGhpcykuYXR0cigndGl0bGUnKSxcbiAgICAgICAgICAgICAgICAgICAgcm93c3BhbjogJCh0aGlzKS5hdHRyKCdyb3dzcGFuJykgPyArJCh0aGlzKS5hdHRyKCdyb3dzcGFuJykgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbHNwYW46ICQodGhpcykuYXR0cignY29sc3BhbicpID8gKyQodGhpcykuYXR0cignY29sc3BhbicpIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfSwgJCh0aGlzKS5kYXRhKCkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoISQuaXNBcnJheSh0aGlzLm9wdGlvbnMuY29sdW1uc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb2x1bW5zID0gW3RoaXMub3B0aW9ucy5jb2x1bW5zXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMuY29sdW1ucyA9ICQuZXh0ZW5kKHRydWUsIFtdLCBjb2x1bW5zLCB0aGlzLm9wdGlvbnMuY29sdW1ucyk7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IFtdO1xuXG4gICAgICAgIHNldEZpZWxkSW5kZXgodGhpcy5vcHRpb25zLmNvbHVtbnMpO1xuICAgICAgICAkLmVhY2godGhpcy5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW5zKSB7XG4gICAgICAgICAgICAkLmVhY2goY29sdW1ucywgZnVuY3Rpb24gKGosIGNvbHVtbikge1xuICAgICAgICAgICAgICAgIGNvbHVtbiA9ICQuZXh0ZW5kKHt9LCBCb290c3RyYXBUYWJsZS5DT0xVTU5fREVGQVVMVFMsIGNvbHVtbik7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbHVtbi5maWVsZEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbHVtbnNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5jb2x1bW5zW2ldW2pdID0gY29sdW1uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIG9wdGlvbnMuZGF0YSBpcyBzZXR0aW5nLCBkbyBub3QgcHJvY2VzcyB0Ym9keSBkYXRhXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtID0gW107XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJz50Ym9keT50cicpLmVhY2goZnVuY3Rpb24gKHkpIHtcbiAgICAgICAgICAgIHZhciByb3cgPSB7fTtcblxuICAgICAgICAgICAgLy8gc2F2ZSB0cidzIGlkLCBjbGFzcyBhbmQgZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIHJvdy5faWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICByb3cuX2NsYXNzID0gJCh0aGlzKS5hdHRyKCdjbGFzcycpO1xuICAgICAgICAgICAgcm93Ll9kYXRhID0gZ2V0UmVhbERhdGFBdHRyKCQodGhpcykuZGF0YSgpKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCc+dGQnKS5lYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgY3NwYW4gPSArJHRoaXMuYXR0cignY29sc3BhbicpIHx8IDEsXG4gICAgICAgICAgICAgICAgICAgIHJzcGFuID0gKyR0aGlzLmF0dHIoJ3Jvd3NwYW4nKSB8fCAxLFxuICAgICAgICAgICAgICAgICAgICB0eCwgdHk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKDsgbVt5XSAmJiBtW3ldW3hdOyB4KyspOyAvL3NraXAgYWxyZWFkeSBvY2N1cGllZCBjZWxscyBpbiBjdXJyZW50IHJvd1xuXG4gICAgICAgICAgICAgICAgZm9yICh0eCA9IHg7IHR4IDwgeCArIGNzcGFuOyB0eCsrKSB7IC8vbWFyayBtYXRyaXggZWxlbWVudHMgb2NjdXBpZWQgYnkgY3VycmVudCBjZWxsIHdpdGggdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHR5ID0geTsgdHkgPCB5ICsgcnNwYW47IHR5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbVt0eV0pIHsgLy9maWxsIG1pc3Npbmcgcm93c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1bdHldID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtW3R5XVt0eF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gdGhhdC5jb2x1bW5zW3hdLmZpZWxkO1xuXG4gICAgICAgICAgICAgICAgcm93W2ZpZWxkXSA9ICQodGhpcykuaHRtbCgpO1xuICAgICAgICAgICAgICAgIC8vIHNhdmUgdGQncyBpZCwgY2xhc3MgYW5kIGRhdGEtKiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ19pZCddID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgIHJvd1snXycgKyBmaWVsZCArICdfY2xhc3MnXSA9ICQodGhpcykuYXR0cignY2xhc3MnKTtcbiAgICAgICAgICAgICAgICByb3dbJ18nICsgZmllbGQgKyAnX3Jvd3NwYW4nXSA9ICQodGhpcykuYXR0cigncm93c3BhbicpO1xuICAgICAgICAgICAgICAgIHJvd1snXycgKyBmaWVsZCArICdfY29sc3BhbiddID0gJCh0aGlzKS5hdHRyKCdjb2xzcGFuJyk7XG4gICAgICAgICAgICAgICAgcm93WydfJyArIGZpZWxkICsgJ190aXRsZSddID0gJCh0aGlzKS5hdHRyKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgIHJvd1snXycgKyBmaWVsZCArICdfZGF0YSddID0gZ2V0UmVhbERhdGFBdHRyKCQodGhpcykuZGF0YSgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YS5wdXNoKHJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCkgdGhpcy5mcm9tSHRtbCA9IHRydWU7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0SGVhZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICB2aXNpYmxlQ29sdW1ucyA9IHt9LFxuICAgICAgICAgICAgaHRtbCA9IFtdO1xuXG4gICAgICAgIHRoaXMuaGVhZGVyID0ge1xuICAgICAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgICAgIHN0eWxlczogW10sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIGZvcm1hdHRlcnM6IFtdLFxuICAgICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICAgIHNvcnRlcnM6IFtdLFxuICAgICAgICAgICAgc29ydE5hbWVzOiBbXSxcbiAgICAgICAgICAgIGNlbGxTdHlsZXM6IFtdLFxuICAgICAgICAgICAgc2VhcmNoYWJsZXM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgJC5lYWNoKHRoaXMub3B0aW9ucy5jb2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sdW1ucykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8dHI+Jyk7XG5cbiAgICAgICAgICAgIGlmIChpID09PSAwICYmICF0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgdGhhdC5vcHRpb25zLmRldGFpbFZpZXcpIHtcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goc3ByaW50ZignPHRoIGNsYXNzPVwiZGV0YWlsXCIgcm93c3Bhbj1cIiVzXCI+PGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+PC90aD4nLFxuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMuY29sdW1ucy5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKGNvbHVtbnMsIGZ1bmN0aW9uIChqLCBjb2x1bW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICcnLFxuICAgICAgICAgICAgICAgICAgICBoYWxpZ24gPSAnJywgLy8gaGVhZGVyIGFsaWduIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgIGFsaWduID0gJycsIC8vIGJvZHkgYWxpZ24gc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NfID0gc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGNvbHVtblsnY2xhc3MnXSksXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyID0gdGhhdC5vcHRpb25zLnNvcnRPcmRlciB8fCBjb2x1bW4ub3JkZXIsXG4gICAgICAgICAgICAgICAgICAgIHVuaXRXaWR0aCA9ICdweCcsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gY29sdW1uLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbi53aWR0aCAhPT0gdW5kZWZpbmVkICYmICghdGhhdC5vcHRpb25zLmNhcmRWaWV3KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbHVtbi53aWR0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ud2lkdGguaW5kZXhPZignJScpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRXaWR0aCA9ICclJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLndpZHRoICYmIHR5cGVvZiBjb2x1bW4ud2lkdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gY29sdW1uLndpZHRoLnJlcGxhY2UoJyUnLCAnJykucmVwbGFjZSgncHgnLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaGFsaWduID0gc3ByaW50ZigndGV4dC1hbGlnbjogJXM7ICcsIGNvbHVtbi5oYWxpZ24gPyBjb2x1bW4uaGFsaWduIDogY29sdW1uLmFsaWduKTtcbiAgICAgICAgICAgICAgICBhbGlnbiA9IHNwcmludGYoJ3RleHQtYWxpZ246ICVzOyAnLCBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgICAgIHN0eWxlID0gc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLCBjb2x1bW4udmFsaWduKTtcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBzcHJpbnRmKCd3aWR0aDogJXM7ICcsIChjb2x1bW4uY2hlY2tib3ggfHwgY29sdW1uLnJhZGlvKSAmJiAhd2lkdGggP1xuICAgICAgICAgICAgICAgICAgICAnMzZweCcgOiAod2lkdGggPyB3aWR0aCArIHVuaXRXaWR0aCA6IHVuZGVmaW5lZCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb2x1bW4uZmllbGRJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuZmllbGRzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuc3R5bGVzW2NvbHVtbi5maWVsZEluZGV4XSA9IGFsaWduICsgc3R5bGU7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNsYXNzZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY2xhc3NfO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5mb3JtYXR0ZXJzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5mb3JtYXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmV2ZW50c1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5zb3J0ZXJzW2NvbHVtbi5maWVsZEluZGV4XSA9IGNvbHVtbi5zb3J0ZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLnNvcnROYW1lc1tjb2x1bW4uZmllbGRJbmRleF0gPSBjb2x1bW4uc29ydE5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNlbGxTdHlsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLmNlbGxTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oZWFkZXIuc2VhcmNoYWJsZXNbY29sdW1uLmZpZWxkSW5kZXhdID0gY29sdW1uLnNlYXJjaGFibGU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb2x1bW4udmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5jYXJkVmlldyAmJiAoIWNvbHVtbi5jYXJkVmlzaWJsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGVDb2x1bW5zW2NvbHVtbi5maWVsZF0gPSBjb2x1bW47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8dGgnICsgc3ByaW50ZignIHRpdGxlPVwiJXNcIicsIGNvbHVtbi50aXRsZVRvb2x0aXApLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW4uY2hlY2tib3ggfHwgY29sdW1uLnJhZGlvID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBjbGFzcz1cImJzLWNoZWNrYm94ICVzXCInLCBjb2x1bW5bJ2NsYXNzJ10gfHwgJycpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzXyxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIHN0eWxlPVwiJXNcIicsIGhhbGlnbiArIHN0eWxlKSxcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJywgY29sdW1uLnJvd3NwYW4pLFxuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgY29sc3Bhbj1cIiVzXCInLCBjb2x1bW4uY29sc3BhbiksXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBkYXRhLWZpZWxkPVwiJXNcIicsIGNvbHVtbi5maWVsZCksXG4gICAgICAgICAgICAgICAgICAgICc+Jyk7XG5cbiAgICAgICAgICAgICAgICBodG1sLnB1c2goc3ByaW50ZignPGRpdiBjbGFzcz1cInRoLWlubmVyICVzXCI+JywgdGhhdC5vcHRpb25zLnNvcnRhYmxlICYmIGNvbHVtbi5zb3J0YWJsZSA/XG4gICAgICAgICAgICAgICAgICAgICdzb3J0YWJsZSBib3RoJyA6ICcnKSk7XG5cbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGhhdC5vcHRpb25zLmVzY2FwZSA/IGVzY2FwZUhUTUwoY29sdW1uLnRpdGxlKSA6IGNvbHVtbi50aXRsZTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4uY2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGF0Lm9wdGlvbnMuc2luZ2xlU2VsZWN0ICYmIHRoYXQub3B0aW9ucy5jaGVja2JveEhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICc8aW5wdXQgbmFtZT1cImJ0U2VsZWN0QWxsXCIgdHlwZT1cImNoZWNrYm94XCIgLz4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLnN0YXRlRmllbGQgPSBjb2x1bW4uZmllbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ucmFkaW8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmhlYWRlci5zdGF0ZUZpZWxkID0gY29sdW1uLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMuc2luZ2xlU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBodG1sLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8L3RoPicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzwvdHI+Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlci5odG1sKGh0bWwuam9pbignJykpO1xuICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmRhdGEodmlzaWJsZUNvbHVtbnNbJCh0aGlzKS5kYXRhKCdmaWVsZCcpXSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRjb250YWluZXIub2ZmKCdjbGljaycsICcudGgtaW5uZXInKS5vbignY2xpY2snLCAnLnRoLWlubmVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5kZXRhaWxWaWV3KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5jbG9zZXN0KCcuYm9vdHN0cmFwLXRhYmxlJylbMF0gIT09IHRoYXQuJGNvbnRhaW5lclswXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNvcnRhYmxlICYmIHRhcmdldC5wYXJlbnQoKS5kYXRhKCkuc29ydGFibGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU29ydChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGhlYWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkub2ZmKCdrZXlwcmVzcycpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zb3J0YWJsZSAmJiAkKHRoaXMpLmRhdGEoKS5zb3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gZXZlbnQua2V5Q29kZSB8fCBldmVudC53aGljaDtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PSAxMykgeyAvL0VudGVyIGtleWNvZGVcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vblNvcnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJvb3RzdHJhcC10YWJsZScpO1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93SGVhZGVyIHx8IHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsIHRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpICsgMSk7XG4gICAgICAgICAgICAvLyBBc3NpZ24gdGhlIGNvcnJlY3Qgc29ydGFibGUgYXJyb3dcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplLmJvb3RzdHJhcC10YWJsZScsICQucHJveHkodGhpcy5yZXNldFdpZHRoLCB0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3RBbGwgPSB0aGlzLiRoZWFkZXIuZmluZCgnW25hbWU9XCJidFNlbGVjdEFsbFwiXScpO1xuICAgICAgICB0aGlzLiRzZWxlY3RBbGwub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9ICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgIHRoYXRbY2hlY2tlZCA/ICdjaGVja0FsbCcgOiAndW5jaGVja0FsbCddKCk7XG4gICAgICAgICAgICAgICAgdGhhdC51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0Rm9vdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93Rm9vdGVyIHx8IHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuc2hvdygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHR5cGU6IGFwcGVuZCAvIHByZXBlbmRcbiAgICAgKi9cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdERhdGEgPSBmdW5jdGlvbiAoZGF0YSwgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2FwcGVuZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5jb25jYXQoZGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3ByZXBlbmQnKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBbXS5jb25jYXQoZGF0YSkuY29uY2F0KHRoaXMuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhIHx8IHRoaXMub3B0aW9ucy5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRml4ICM4MzkgUmVjb3JkcyBkZWxldGVkIHdoZW4gYWRkaW5nIG5ldyByb3cgb24gZmlsdGVyZWQgdGFibGVcbiAgICAgICAgaWYgKHR5cGUgPT09ICdhcHBlbmQnKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhLmNvbmNhdChkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncHJlcGVuZCcpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhID0gW10uY29uY2F0KGRhdGEpLmNvbmNhdCh0aGlzLm9wdGlvbnMuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdFNvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLm9wdGlvbnMuc29ydE5hbWUsXG4gICAgICAgICAgICBvcmRlciA9IHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPT09ICdkZXNjJyA/IC0xIDogMSxcbiAgICAgICAgICAgIGluZGV4ID0gJC5pbkFycmF5KHRoaXMub3B0aW9ucy5zb3J0TmFtZSwgdGhpcy5oZWFkZXIuZmllbGRzKSxcbiAgICAgICAgICAgIHRpbWVvdXRJZCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0ICE9PSAkLm5vb3ApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jdXN0b21Tb3J0LmFwcGx5KHRoaXMsIFt0aGlzLm9wdGlvbnMuc29ydE5hbWUsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXJdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc29ydFN0YWJsZSkge1xuICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLmRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkoJ19wb3NpdGlvbicpKSByb3cuX3Bvc2l0aW9uID0gaTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kYXRhLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5oZWFkZXIuc29ydE5hbWVzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgICAgICBuYW1lID0gdGhhdC5oZWFkZXIuc29ydE5hbWVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGFhID0gZ2V0SXRlbUZpZWxkKGEsIG5hbWUsIHRoYXQub3B0aW9ucy5lc2NhcGUpLFxuICAgICAgICAgICAgICAgICAgICBiYiA9IGdldEl0ZW1GaWVsZChiLCBuYW1lLCB0aGF0Lm9wdGlvbnMuZXNjYXBlKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGF0LmhlYWRlciwgdGhhdC5oZWFkZXIuc29ydGVyc1tpbmRleF0sIFthYSwgYmJdKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZpeCAjMTYxOiB1bmRlZmluZWQgb3IgbnVsbCBzdHJpbmcgc29ydCBidWcuXG4gICAgICAgICAgICAgICAgaWYgKGFhID09PSB1bmRlZmluZWQgfHwgYWEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYWEgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJiID09PSB1bmRlZmluZWQgfHwgYmIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYmIgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLnNvcnRTdGFibGUgJiYgYWEgPT09IGJiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFhID0gYS5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIGJiID0gYi5fcG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSUYgYm90aCB2YWx1ZXMgYXJlIG51bWVyaWMsIGRvIGEgbnVtZXJpYyBjb21wYXJpc29uXG4gICAgICAgICAgICAgICAgaWYgKCQuaXNOdW1lcmljKGFhKSAmJiAkLmlzTnVtZXJpYyhiYikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCBudW1lcmljYWwgdmFsdWVzIGZvcm0gc3RyaW5nIHRvIGZsb2F0LlxuICAgICAgICAgICAgICAgICAgICBhYSA9IHBhcnNlRmxvYXQoYWEpO1xuICAgICAgICAgICAgICAgICAgICBiYiA9IHBhcnNlRmxvYXQoYmIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWEgPCBiYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyICogLTE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhYSA9PT0gYmIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgdmFsdWUgaXMgbm90IGEgc3RyaW5nLCBjb252ZXJ0IHRvIHN0cmluZ1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWEgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGFhID0gYWEudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWEubG9jYWxlQ29tcGFyZShiYikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmRlciAqIC0xO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBvcmRlcjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNvcnRDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKHRoYXQub3B0aW9ucy5zb3J0Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGF0LiRoZWFkZXIuZmluZChzcHJpbnRmKCdbZGF0YS1maWVsZD1cIiVzXCJdJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5zb3J0TmFtZSkuaW5kZXgoKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRlbC5maW5kKHNwcmludGYoJ3RyIHRkOm50aC1jaGlsZCglcyknLCBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3ModGhhdC5vcHRpb25zLnNvcnRDbGFzcyk7XG4gICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUub25Tb3J0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciAkdGhpcyA9IGV2ZW50LnR5cGUgPT09IFwia2V5cHJlc3NcIiA/ICQoZXZlbnQuY3VycmVudFRhcmdldCkgOiAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLFxuICAgICAgICAgICAgJHRoaXNfID0gdGhpcy4kaGVhZGVyLmZpbmQoJ3RoJykuZXEoJHRoaXMuaW5kZXgoKSk7XG5cbiAgICAgICAgdGhpcy4kaGVhZGVyLmFkZCh0aGlzLiRoZWFkZXJfKS5maW5kKCdzcGFuLm9yZGVyJykucmVtb3ZlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3J0TmFtZSA9PT0gJHRoaXMuZGF0YSgnZmllbGQnKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnRPcmRlciA9IHRoaXMub3B0aW9ucy5zb3J0T3JkZXIgPT09ICdhc2MnID8gJ2Rlc2MnIDogJ2FzYyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc29ydE5hbWUgPSAkdGhpcy5kYXRhKCdmaWVsZCcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNvcnRPcmRlciA9ICR0aGlzLmRhdGEoJ29yZGVyJykgPT09ICdhc2MnID8gJ2Rlc2MnIDogJ2FzYyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzb3J0JywgdGhpcy5vcHRpb25zLnNvcnROYW1lLCB0aGlzLm9wdGlvbnMuc29ydE9yZGVyKTtcblxuICAgICAgICAkdGhpcy5hZGQoJHRoaXNfKS5kYXRhKCdvcmRlcicsIHRoaXMub3B0aW9ucy5zb3J0T3JkZXIpO1xuXG4gICAgICAgIC8vIEFzc2lnbiB0aGUgY29ycmVjdCBzb3J0YWJsZSBhcnJvd1xuICAgICAgICB0aGlzLmdldENhcmV0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlcnZlcih0aGlzLm9wdGlvbnMuc2lsZW50U29ydCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRUb29sYmFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW10sXG4gICAgICAgICAgICB0aW1lb3V0SWQgPSAwLFxuICAgICAgICAgICAgJGtlZXBPcGVuLFxuICAgICAgICAgICAgJHNlYXJjaCxcbiAgICAgICAgICAgIHN3aXRjaGFibGVDb3VudCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMuJHRvb2xiYXIuZmluZCgnLmJzLWJhcnMnKS5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCgkKHRoaXMub3B0aW9ucy50b29sYmFyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kdG9vbGJhci5odG1sKCcnKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy50b29sYmFyID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdGhpcy5vcHRpb25zLnRvb2xiYXIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAkKHNwcmludGYoJzxkaXYgY2xhc3M9XCJicy1iYXJzIHB1bGwtJXNcIj48L2Rpdj4nLCB0aGlzLm9wdGlvbnMudG9vbGJhckFsaWduKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy4kdG9vbGJhcilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQodGhpcy5vcHRpb25zLnRvb2xiYXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNob3dDb2x1bW5zLCBzaG93VG9nZ2xlLCBzaG93UmVmcmVzaFxuICAgICAgICBodG1sID0gW3NwcmludGYoJzxkaXYgY2xhc3M9XCJjb2x1bW5zIGNvbHVtbnMtJXMgYnRuLWdyb3VwIHB1bGwtJXNcIj4nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmJ1dHRvbnNBbGlnbiwgdGhpcy5vcHRpb25zLmJ1dHRvbnNBbGlnbildO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmljb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmljb25zID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCwgdGhpcy5vcHRpb25zLmljb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1BhZ2luYXRpb25Td2l0Y2gpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8YnV0dG9uIGNsYXNzPVwiYnRuJyArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIHR5cGU9XCJidXR0b25cIiBuYW1lPVwicGFnaW5hdGlvblN3aXRjaFwiIGFyaWEtbGFiZWw9XCJwYWdpbmF0aW9uIFN3aXRjaFwiIHRpdGxlPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0UGFnaW5hdGlvblN3aXRjaCgpKSxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPicsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLnBhZ2luYXRpb25Td2l0Y2hEb3duKSxcbiAgICAgICAgICAgICAgICAnPC9idXR0b24+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dSZWZyZXNoKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goc3ByaW50ZignPGJ1dHRvbiBjbGFzcz1cImJ0bicgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmJ1dHRvbnNDbGFzcykgK1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCcgYnRuLSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArXG4gICAgICAgICAgICAgICAgICAgICdcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInJlZnJlc2hcIiBhcmlhLWxhYmVsPVwicmVmcmVzaFwiIHRpdGxlPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0UmVmcmVzaCgpKSxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aSBjbGFzcz1cIiVzICVzXCI+PC9pPicsIHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhpcy5vcHRpb25zLmljb25zLnJlZnJlc2gpLFxuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1RvZ2dsZSkge1xuICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzxidXR0b24gY2xhc3M9XCJidG4nICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5idXR0b25zQ2xhc3MpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJ0b2dnbGVcIiBhcmlhLWxhYmVsPVwidG9nZ2xlXCIgdGl0bGU9XCIlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRUb2dnbGUoKSksXG4gICAgICAgICAgICAgICAgc3ByaW50ZignPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy50b2dnbGUpLFxuICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvbHVtbnMpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8ZGl2IGNsYXNzPVwia2VlcC1vcGVuIGJ0bi1ncm91cFwiIHRpdGxlPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0Q29sdW1ucygpKSxcbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cImNvbHVtbnNcIiBjbGFzcz1cImJ0bicgK1xuICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArXG4gICAgICAgICAgICAgICAgc3ByaW50ZignIGJ0bi0lcycsIHRoaXMub3B0aW9ucy5pY29uU2l6ZSkgK1xuICAgICAgICAgICAgICAgICcgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPicsXG4gICAgICAgICAgICAgICAgc3ByaW50ZignPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsIHRoaXMub3B0aW9ucy5pY29ucy5jb2x1bW5zKSxcbiAgICAgICAgICAgICAgICAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+JyxcbiAgICAgICAgICAgICAgICAnPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICAnPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+Jyk7XG5cbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmNvbHVtbnMsIGZ1bmN0aW9uIChpLCBjb2x1bW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLnJhZGlvIHx8IGNvbHVtbi5jaGVja2JveCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5jYXJkVmlldyAmJiAhY29sdW1uLmNhcmRWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGNvbHVtbi52aXNpYmxlID8gJyBjaGVja2VkPVwiY2hlY2tlZFwiJyA6ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5zd2l0Y2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaChzcHJpbnRmKCc8bGkgcm9sZT1cIm1lbnVpdGVtXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWZpZWxkPVwiJXNcIiB2YWx1ZT1cIiVzXCIlcz4gJXM8L2xhYmVsPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+JywgY29sdW1uLmZpZWxkLCBpLCBjaGVja2VkLCBjb2x1bW4udGl0bGUpKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoYWJsZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzwvdWw+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBodG1sLnB1c2goJzwvZGl2PicpO1xuXG4gICAgICAgIC8vIEZpeCAjMTg4OiB0aGlzLnNob3dUb29sYmFyIGlzIGZvciBleHRlbnNpb25zXG4gICAgICAgIGlmICh0aGlzLnNob3dUb29sYmFyIHx8IGh0bWwubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5hcHBlbmQoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dQYWdpbmF0aW9uU3dpdGNoKSB7XG4gICAgICAgICAgICB0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwicGFnaW5hdGlvblN3aXRjaFwiXScpXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMudG9nZ2xlUGFnaW5hdGlvbiwgdGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93UmVmcmVzaCkge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInJlZnJlc2hcIl0nKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLnJlZnJlc2gsIHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd1RvZ2dsZSkge1xuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInRvZ2dsZVwiXScpXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlVmlldygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93Q29sdW1ucykge1xuICAgICAgICAgICAgJGtlZXBPcGVuID0gdGhpcy4kdG9vbGJhci5maW5kKCcua2VlcC1vcGVuJyk7XG5cbiAgICAgICAgICAgIGlmIChzd2l0Y2hhYmxlQ291bnQgPD0gdGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAka2VlcE9wZW4uZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAka2VlcE9wZW4uZmluZCgnbGknKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRrZWVwT3Blbi5maW5kKCdpbnB1dCcpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlQ29sdW1uKCQodGhpcykudmFsKCksICR0aGlzLnByb3AoJ2NoZWNrZWQnKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoYXQudHJpZ2dlcignY29sdW1uLXN3aXRjaCcsICQodGhpcykuZGF0YSgnZmllbGQnKSwgJHRoaXMucHJvcCgnY2hlY2tlZCcpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWFyY2gpIHtcbiAgICAgICAgICAgIGh0bWwgPSBbXTtcbiAgICAgICAgICAgIGh0bWwucHVzaChcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInB1bGwtJyArIHRoaXMub3B0aW9ucy5zZWFyY2hBbGlnbiArICcgc2VhcmNoXCI+JyxcbiAgICAgICAgICAgICAgICBzcHJpbnRmKCc8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2wnICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIGlucHV0LSVzJywgdGhpcy5vcHRpb25zLmljb25TaXplKSArXG4gICAgICAgICAgICAgICAgICAgICdcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiJXNcIj4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0U2VhcmNoKCkpLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgdGhpcy4kdG9vbGJhci5hcHBlbmQoaHRtbC5qb2luKCcnKSk7XG4gICAgICAgICAgICAkc2VhcmNoID0gdGhpcy4kdG9vbGJhci5maW5kKCcuc2VhcmNoIGlucHV0Jyk7XG4gICAgICAgICAgICAkc2VhcmNoLm9mZigna2V5dXAgZHJvcCBibHVyJykub24oJ2tleXVwIGRyb3AgYmx1cicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2VhcmNoT25FbnRlcktleSAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShldmVudC5rZXlDb2RlLCBbMzcsIDM4LCAzOSwgNDBdKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTsgLy8gZG9lc24ndCBtYXR0ZXIgaWYgaXQncyAwXG4gICAgICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub25TZWFyY2goZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0sIHRoYXQub3B0aW9ucy5zZWFyY2hUaW1lT3V0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaXNJRUJyb3dzZXIoKSkge1xuICAgICAgICAgICAgICAgICRzZWFyY2gub2ZmKCdtb3VzZXVwJykub24oJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7IC8vIGRvZXNuJ3QgbWF0dGVyIGlmIGl0J3MgMFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub25TZWFyY2goZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGF0Lm9wdGlvbnMuc2VhcmNoVGltZU91dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uU2VhcmNoID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciB0ZXh0ID0gJC50cmltKCQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkpO1xuXG4gICAgICAgIC8vIHRyaW0gc2VhcmNoIGlucHV0XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudHJpbU9uU2VhcmNoICYmICQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkgIT09IHRleHQpIHtcbiAgICAgICAgICAgICQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHQgPT09IHRoaXMuc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0ID0gdGV4dDtcblxuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdzZWFyY2gnLCB0ZXh0KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uICE9PSAnc2VydmVyJykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21TZWFyY2ggIT09ICQubm9vcCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jdXN0b21TZWFyY2guYXBwbHkodGhpcywgW3RoaXMuc2VhcmNoVGV4dF0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnNlYXJjaFRleHQgJiYgKHRoaXMub3B0aW9ucy5lc2NhcGUgP1xuICAgICAgICAgICAgICAgIGVzY2FwZUhUTUwodGhpcy5zZWFyY2hUZXh0KSA6IHRoaXMuc2VhcmNoVGV4dCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhciBmID0gJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1ucykgPyBudWxsIDogdGhpcy5maWx0ZXJDb2x1bW5zO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmaWx0ZXJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGYgPyAkLmdyZXAodGhpcy5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNBcnJheShmW2tleV0pICYmICQuaW5BcnJheShpdGVtW2tleV0sIGZba2V5XSkgPT09IC0xIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgISQuaXNBcnJheShmW2tleV0pICYmIGl0ZW1ba2V5XSAhPT0gZltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KSA6IHRoaXMub3B0aW9ucy5kYXRhO1xuXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBzID8gJC5ncmVwKHRoaXMuZGF0YSwgZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoYXQuaGVhZGVyLmZpZWxkcy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC5oZWFkZXIuc2VhcmNoYWJsZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9ICQuaXNOdW1lcmljKHRoYXQuaGVhZGVyLmZpZWxkc1tqXSkgPyBwYXJzZUludCh0aGF0LmhlYWRlci5maWVsZHNbal0sIDEwKSA6IHRoYXQuaGVhZGVyLmZpZWxkc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoYXQuY29sdW1uc1tnZXRGaWVsZEluZGV4KHRoYXQuY29sdW1ucywga2V5KV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wcyA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcF9pbmRleCA9IDA7IHByb3BfaW5kZXggPCBwcm9wcy5sZW5ndGg7IHByb3BfaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbcHJvcHNbcHJvcF9pbmRleF1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggIzE0MjogcmVzcGVjdCBzZWFyY2hGb3JhbXR0ZXIgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbiAmJiBjb2x1bW4uc2VhcmNoRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZShjb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFt2YWx1ZSwgaXRlbSwgaV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQub3B0aW9ucy5zdHJpY3RTZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkgPT09IHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlICsgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pIDogdGhpcy5kYXRhO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0UGFnaW5hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXSxcbiAgICAgICAgICAgICRhbGxTZWxlY3RlZCA9IGZhbHNlLFxuICAgICAgICAgICAgaSwgZnJvbSwgdG8sXG4gICAgICAgICAgICAkcGFnZUxpc3QsXG4gICAgICAgICAgICAkZmlyc3QsICRwcmUsXG4gICAgICAgICAgICAkbmV4dCwgJGxhc3QsXG4gICAgICAgICAgICAkbnVtYmVyLFxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpLFxuICAgICAgICAgICAgcGFnZUxpc3QgPSB0aGlzLm9wdGlvbnMucGFnZUxpc3Q7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiAhPT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFJvd3MgPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG90YWxQYWdlcyA9IDA7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudG90YWxSb3dzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLnRvdGFsUm93cztcbiAgICAgICAgICAgICAgICAkYWxsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgICAgICAvLyBGaXggIzY2NyBUYWJsZSB3aXRoIHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgcGFnZXMgYW5kIGEgc2VhcmNoIHRoYXQgbWF0Y2hlcyB0byBvbmUgcGFnZSB0aHJvd3MgZXhjZXB0aW9uXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VMc3QgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBhZ2VMaXN0ID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTGlzdC5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csICcnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJykgOiB0aGlzLm9wdGlvbnMucGFnZUxpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpLnRvTG93ZXJDYXNlKCksIHBhZ2VMc3QpICA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICRhbGxTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRvdGFsUGFnZXMgPSB+figodGhpcy5vcHRpb25zLnRvdGFsUm93cyAtIDEpIC8gdGhpcy5vcHRpb25zLnBhZ2VTaXplKSArIDE7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPiAwICYmIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID4gdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFnZUZyb20gPSAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSArIDE7XG4gICAgICAgIHRoaXMucGFnZVRvID0gdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgKiB0aGlzLm9wdGlvbnMucGFnZVNpemU7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VUbyA+IHRoaXMub3B0aW9ucy50b3RhbFJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZVRvID0gdGhpcy5vcHRpb25zLnRvdGFsUm93cztcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwucHVzaChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHVsbC0nICsgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25EZXRhaWxIQWxpZ24gKyAnIHBhZ2luYXRpb24tZGV0YWlsXCI+JyxcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBhZ2luYXRpb24taW5mb1wiPicsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMub25seUluZm9QYWdpbmF0aW9uID8gdGhpcy5vcHRpb25zLmZvcm1hdERldGFpbFBhZ2luYXRpb24odGhpcy5vcHRpb25zLnRvdGFsUm93cykgOlxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvcm1hdFNob3dpbmdSb3dzKHRoaXMucGFnZUZyb20sIHRoaXMucGFnZVRvLCB0aGlzLm9wdGlvbnMudG90YWxSb3dzKSxcbiAgICAgICAgICAgICc8L3NwYW4+Jyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMub25seUluZm9QYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxzcGFuIGNsYXNzPVwicGFnZS1saXN0XCI+Jyk7XG5cbiAgICAgICAgICAgIHZhciBwYWdlTnVtYmVyID0gW1xuICAgICAgICAgICAgICAgICAgICBzcHJpbnRmKCc8c3BhbiBjbGFzcz1cImJ0bi1ncm91cCAlc1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnaW5hdGlvblZBbGlnbiA9PT0gJ3RvcCcgfHwgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25WQWxpZ24gPT09ICdib3RoJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Ryb3Bkb3duJyA6ICdkcm9wdXAnKSxcbiAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuJyArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuYnV0dG9uc0NsYXNzKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBidG4tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICtcbiAgICAgICAgICAgICAgICAgICAgJyBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwicGFnZS1zaXplXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJGFsbFNlbGVjdGVkID8gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKSA6IHRoaXMub3B0aW9ucy5wYWdlU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAnIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+JyxcbiAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgICAgICc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj4nXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGFnZUxpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzLm9wdGlvbnMucGFnZUxpc3QucmVwbGFjZSgnWycsICcnKS5yZXBsYWNlKCddJywgJycpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csICcnKS5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgcGFnZUxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAkLmVhY2gobGlzdCwgZnVuY3Rpb24gKGksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VMaXN0LnB1c2godmFsdWUudG9VcHBlckNhc2UoKSA9PT0gdGhhdC5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKS50b1VwcGVyQ2FzZSgpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgOiArdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2gocGFnZUxpc3QsIGZ1bmN0aW9uIChpLCBwYWdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGF0Lm9wdGlvbnMuc21hcnREaXNwbGF5IHx8IGkgPT09IDAgfHwgcGFnZUxpc3RbaSAtIDFdIDwgdGhhdC5vcHRpb25zLnRvdGFsUm93cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGFsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBwYWdlID09PSB0aGF0Lm9wdGlvbnMuZm9ybWF0QWxsUm93cygpID8gJyBjbGFzcz1cImFjdGl2ZVwiJyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gcGFnZSA9PT0gdGhhdC5vcHRpb25zLnBhZ2VTaXplID8gJyBjbGFzcz1cImFjdGl2ZVwiJyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIucHVzaChzcHJpbnRmKCc8bGkgcm9sZT1cIm1lbnVpdGVtXCIlcz48YSBocmVmPVwiI1wiPiVzPC9hPjwvbGk+JywgYWN0aXZlLCBwYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwYWdlTnVtYmVyLnB1c2goJzwvdWw+PC9zcGFuPicpO1xuXG4gICAgICAgICAgICBodG1sLnB1c2godGhpcy5vcHRpb25zLmZvcm1hdFJlY29yZHNQZXJQYWdlKHBhZ2VOdW1iZXIuam9pbignJykpKTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC9zcGFuPicpO1xuXG4gICAgICAgICAgICBodG1sLnB1c2goJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwdWxsLScgKyB0aGlzLm9wdGlvbnMucGFnaW5hdGlvbkhBbGlnbiArICcgcGFnaW5hdGlvblwiPicsXG4gICAgICAgICAgICAgICAgJzx1bCBjbGFzcz1cInBhZ2luYXRpb24nICsgc3ByaW50ZignIHBhZ2luYXRpb24tJXMnLCB0aGlzLm9wdGlvbnMuaWNvblNpemUpICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxsaSBjbGFzcz1cInBhZ2UtcHJlXCI+PGEgaHJlZj1cIiNcIj4nICsgdGhpcy5vcHRpb25zLnBhZ2luYXRpb25QcmVUZXh0ICsgJzwvYT48L2xpPicpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzIDwgNSkge1xuICAgICAgICAgICAgICAgIGZyb20gPSAxO1xuICAgICAgICAgICAgICAgIHRvID0gdGhpcy50b3RhbFBhZ2VzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcm9tID0gdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgLSAyO1xuICAgICAgICAgICAgICAgIHRvID0gZnJvbSArIDQ7XG4gICAgICAgICAgICAgICAgaWYgKGZyb20gPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAxO1xuICAgICAgICAgICAgICAgICAgICB0byA9IDU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0byA+IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICAgICB0byA9IHRoaXMudG90YWxQYWdlcztcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9IHRvIC0gNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPj0gNikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGxpIGNsYXNzPVwicGFnZS1maXJzdCcgKyAoMSA9PT0gdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPyAnIGFjdGl2ZScgOiAnJykgKyAnXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiPicsIDEsICc8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2xpPicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZyb20rKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPj0gNCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT0gNCB8fCB0aGlzLnRvdGFsUGFnZXMgPT0gNiB8fCB0aGlzLnRvdGFsUGFnZXMgPT0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbS0tO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8bGkgY2xhc3M9XCJwYWdlLWZpcnN0LXNlcGFyYXRvciBkaXNhYmxlZFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCI+Li4uPC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0by0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxQYWdlcyA+PSA3KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID49ICh0aGlzLnRvdGFsUGFnZXMgLSAyKSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID09IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPj0gKHRoaXMudG90YWxQYWdlcyAtIDIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnRvdGFsUGFnZXMgPj0gNykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPT0gNyB8fCB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA+PSAodGhpcy50b3RhbFBhZ2VzIC0gMykpIHtcbiAgICAgICAgICAgICAgICAgICAgdG8rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IGZyb207IGkgPD0gdG87IGkrKykge1xuICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGxpIGNsYXNzPVwicGFnZS1udW1iZXInICsgKGkgPT09IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID8gJyBhY3RpdmUnIDogJycpICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiPicsIGksICc8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgJzwvbGk+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsUGFnZXMgPj0gOCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA8PSAodGhpcy50b3RhbFBhZ2VzIC0gNCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKCc8bGkgY2xhc3M9XCJwYWdlLWxhc3Qtc2VwYXJhdG9yIGRpc2FibGVkXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiPi4uLjwvYT4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzID49IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPD0gKHRoaXMudG90YWxQYWdlcyAtIDMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaCgnPGxpIGNsYXNzPVwicGFnZS1sYXN0JyArICh0aGlzLnRvdGFsUGFnZXMgPT09IHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID8gJyBhY3RpdmUnIDogJycpICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIj4nLCB0aGlzLnRvdGFsUGFnZXMsICc8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2xpPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbC5wdXNoKFxuICAgICAgICAgICAgICAgICc8bGkgY2xhc3M9XCJwYWdlLW5leHRcIj48YSBocmVmPVwiI1wiPicgKyB0aGlzLm9wdGlvbnMucGFnaW5hdGlvbk5leHRUZXh0ICsgJzwvYT48L2xpPicsXG4gICAgICAgICAgICAgICAgJzwvdWw+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5odG1sKGh0bWwuam9pbignJykpO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLm9ubHlJbmZvUGFnaW5hdGlvbikge1xuICAgICAgICAgICAgJHBhZ2VMaXN0ID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1saXN0IGEnKTtcbiAgICAgICAgICAgICRmaXJzdCA9IHRoaXMuJHBhZ2luYXRpb24uZmluZCgnLnBhZ2UtZmlyc3QnKTtcbiAgICAgICAgICAgICRwcmUgPSB0aGlzLiRwYWdpbmF0aW9uLmZpbmQoJy5wYWdlLXByZScpO1xuICAgICAgICAgICAgJG5leHQgPSB0aGlzLiRwYWdpbmF0aW9uLmZpbmQoJy5wYWdlLW5leHQnKTtcbiAgICAgICAgICAgICRsYXN0ID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1sYXN0Jyk7XG4gICAgICAgICAgICAkbnVtYmVyID0gdGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1udW1iZXInKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zbWFydERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b3RhbFBhZ2VzIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kcGFnaW5hdGlvbi5maW5kKCdkaXYucGFnaW5hdGlvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VMaXN0Lmxlbmd0aCA8IDIgfHwgdGhpcy5vcHRpb25zLnRvdGFsUm93cyA8PSBwYWdlTGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRwYWdpbmF0aW9uLmZpbmQoJ3NwYW4ucGFnZS1saXN0JykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gZGF0YSBpcyBlbXB0eSwgaGlkZSB0aGUgcGFnaW5hdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuJHBhZ2luYXRpb25bdGhpcy5nZXREYXRhKCkubGVuZ3RoID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmF0aW9uTG9vcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcHJlLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT09IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAkbmV4dC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZVNpemUgPSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHBhZ2VMaXN0Lm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTGlzdENoYW5nZSwgdGhpcykpO1xuICAgICAgICAgICAgJGZpcnN0Lm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlRmlyc3QsIHRoaXMpKTtcbiAgICAgICAgICAgICRwcmUub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy5vblBhZ2VQcmUsIHRoaXMpKTtcbiAgICAgICAgICAgICRuZXh0Lm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTmV4dCwgdGhpcykpO1xuICAgICAgICAgICAgJGxhc3Qub2ZmKCdjbGljaycpLm9uKCdjbGljaycsICQucHJveHkodGhpcy5vblBhZ2VMYXN0LCB0aGlzKSk7XG4gICAgICAgICAgICAkbnVtYmVyLm9mZignY2xpY2snKS5vbignY2xpY2snLCAkLnByb3h5KHRoaXMub25QYWdlTnVtYmVyLCB0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZVBhZ2luYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gRml4ICMxNzE6IElFIGRpc2FibGVkIGJ1dHRvbiBjYW4gYmUgY2xpY2tlZCBidWcuXG4gICAgICAgIGlmIChldmVudCAmJiAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5tYWludGFpblNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0Um93cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uID09PSAnc2VydmVyJykge1xuICAgICAgICAgICAgdGhpcy5pbml0U2VydmVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3BhZ2UtY2hhbmdlJywgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIsIHRoaXMub3B0aW9ucy5wYWdlU2l6ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5vblBhZ2VMaXN0Q2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG5cbiAgICAgICAgJHRoaXMucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB0aGlzLm9wdGlvbnMucGFnZVNpemUgPSAkdGhpcy50ZXh0KCkudG9VcHBlckNhc2UoKSA9PT0gdGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKS50b1VwcGVyQ2FzZSgpID9cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgOiArJHRoaXMudGV4dCgpO1xuICAgICAgICB0aGlzLiR0b29sYmFyLmZpbmQoJy5wYWdlLXNpemUnKS50ZXh0KHRoaXMub3B0aW9ucy5wYWdlU2l6ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUub25QYWdlRmlyc3QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSAxO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5vblBhZ2VQcmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCh0aGlzLm9wdGlvbnMucGFnZU51bWJlciAtIDEpID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXItLTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5vblBhZ2VOZXh0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICgodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgKyAxKSA+IHRoaXMub3B0aW9ucy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlcisrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uUGFnZUxhc3QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSB0aGlzLnRvdGFsUGFnZXM7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihldmVudCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm9uUGFnZU51bWJlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPT09ICskKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRleHQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gKyQoZXZlbnQuY3VycmVudFRhcmdldCkudGV4dCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0Um93ID0gZnVuY3Rpb24oaXRlbSwgaSwgZGF0YSwgcGFyZW50RG9tKSB7XG4gICAgICAgIHZhciB0aGF0PXRoaXMsXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBodG1sID0gW10sXG4gICAgICAgICAgICBzdHlsZSA9IHt9LFxuICAgICAgICAgICAgY3NzZXMgPSBbXSxcbiAgICAgICAgICAgIGRhdGFfID0gJycsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzID0ge30sXG4gICAgICAgICAgICBodG1sQXR0cmlidXRlcyA9IFtdO1xuXG4gICAgICAgIGlmICgkLmluQXJyYXkoaXRlbSwgdGhpcy5oaWRkZW5Sb3dzKSA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzdHlsZSA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLnJvd1N0eWxlLCBbaXRlbSwgaV0sIHN0eWxlKTtcblxuICAgICAgICBpZiAoc3R5bGUgJiYgc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBzdHlsZS5jc3MpIHtcbiAgICAgICAgICAgICAgICBjc3Nlcy5wdXNoKGtleSArICc6ICcgKyBzdHlsZS5jc3Nba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhdHRyaWJ1dGVzID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnJvd0F0dHJpYnV0ZXMsIFtpdGVtLCBpXSwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBodG1sQXR0cmlidXRlcy5wdXNoKHNwcmludGYoJyVzPVwiJXNcIicsIGtleSwgZXNjYXBlSFRNTChhdHRyaWJ1dGVzW2tleV0pKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5fZGF0YSAmJiAhJC5pc0VtcHR5T2JqZWN0KGl0ZW0uX2RhdGEpKSB7XG4gICAgICAgICAgICAkLmVhY2goaXRlbS5fZGF0YSwgZnVuY3Rpb24oaywgdikge1xuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBkYXRhLWluZGV4XG4gICAgICAgICAgICAgICAgaWYgKGsgPT09ICdpbmRleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhXyArPSBzcHJpbnRmKCcgZGF0YS0lcz1cIiVzXCInLCBrLCB2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaHRtbC5wdXNoKCc8dHInLFxuICAgICAgICAgICAgc3ByaW50ZignICVzJywgaHRtbEF0dHJpYnV0ZXMuam9pbignICcpKSxcbiAgICAgICAgICAgIHNwcmludGYoJyBpZD1cIiVzXCInLCAkLmlzQXJyYXkoaXRlbSkgPyB1bmRlZmluZWQgOiBpdGVtLl9pZCksXG4gICAgICAgICAgICBzcHJpbnRmKCcgY2xhc3M9XCIlc1wiJywgc3R5bGUuY2xhc3NlcyB8fCAoJC5pc0FycmF5KGl0ZW0pID8gdW5kZWZpbmVkIDogaXRlbS5fY2xhc3MpKSxcbiAgICAgICAgICAgIHNwcmludGYoJyBkYXRhLWluZGV4PVwiJXNcIicsIGkpLFxuICAgICAgICAgICAgc3ByaW50ZignIGRhdGEtdW5pcXVlaWQ9XCIlc1wiJywgaXRlbVt0aGlzLm9wdGlvbnMudW5pcXVlSWRdKSxcbiAgICAgICAgICAgIHNwcmludGYoJyVzJywgZGF0YV8pLFxuICAgICAgICAgICAgJz4nXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgaHRtbC5wdXNoKHNwcmludGYoJzx0ZCBjb2xzcGFuPVwiJXNcIj48ZGl2IGNsYXNzPVwiY2FyZC12aWV3c1wiPicsIHRoaXMuaGVhZGVyLmZpZWxkcy5sZW5ndGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmNhcmRWaWV3ICYmIHRoaXMub3B0aW9ucy5kZXRhaWxWaWV3KSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzx0ZD4nLFxuICAgICAgICAgICAgICAgICc8YSBjbGFzcz1cImRldGFpbC1pY29uXCIgaHJlZj1cIiNcIj4nLFxuICAgICAgICAgICAgICAgIHNwcmludGYoJzxpIGNsYXNzPVwiJXMgJXNcIj48L2k+JywgdGhpcy5vcHRpb25zLmljb25zUHJlZml4LCB0aGlzLm9wdGlvbnMuaWNvbnMuZGV0YWlsT3BlbiksXG4gICAgICAgICAgICAgICAgJzwvYT4nLFxuICAgICAgICAgICAgICAgICc8L3RkPicpO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaGVhZGVyLmZpZWxkcywgZnVuY3Rpb24oaiwgZmllbGQpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gJycsXG4gICAgICAgICAgICAgICAgdmFsdWVfID0gZ2V0SXRlbUZpZWxkKGl0ZW0sIGZpZWxkLCB0aGF0Lm9wdGlvbnMuZXNjYXBlKSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnLFxuICAgICAgICAgICAgICAgIHR5cGUgPSAnJyxcbiAgICAgICAgICAgICAgICBjZWxsU3R5bGUgPSB7fSxcbiAgICAgICAgICAgICAgICBpZF8gPSAnJyxcbiAgICAgICAgICAgICAgICBjbGFzc18gPSB0aGF0LmhlYWRlci5jbGFzc2VzW2pdLFxuICAgICAgICAgICAgICAgIGRhdGFfID0gJycsXG4gICAgICAgICAgICAgICAgcm93c3Bhbl8gPSAnJyxcbiAgICAgICAgICAgICAgICBjb2xzcGFuXyA9ICcnLFxuICAgICAgICAgICAgICAgIHRpdGxlXyA9ICcnLFxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IHRoYXQuY29sdW1uc1tqXTtcblxuICAgICAgICAgICAgaWYgKHRoYXQuZnJvbUh0bWwgJiYgdHlwZW9mIHZhbHVlXyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgKCFjb2x1bW4uY2FyZFZpc2libGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uLmVzY2FwZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlXyA9IGVzY2FwZUhUTUwodmFsdWVfKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3R5bGUgPSBzcHJpbnRmKCdzdHlsZT1cIiVzXCInLCBjc3Nlcy5jb25jYXQodGhhdC5oZWFkZXIuc3R5bGVzW2pdKS5qb2luKCc7ICcpKTtcblxuICAgICAgICAgICAgLy8gaGFuZGxlIHRkJ3MgaWQgYW5kIGNsYXNzXG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfaWQnXSkge1xuICAgICAgICAgICAgICAgIGlkXyA9IHNwcmludGYoJyBpZD1cIiVzXCInLCBpdGVtWydfJyArIGZpZWxkICsgJ19pZCddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtWydfJyArIGZpZWxkICsgJ19jbGFzcyddKSB7XG4gICAgICAgICAgICAgICAgY2xhc3NfID0gc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGl0ZW1bJ18nICsgZmllbGQgKyAnX2NsYXNzJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW1bJ18nICsgZmllbGQgKyAnX3Jvd3NwYW4nXSkge1xuICAgICAgICAgICAgICAgIHJvd3NwYW5fID0gc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJywgaXRlbVsnXycgKyBmaWVsZCArICdfcm93c3BhbiddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtWydfJyArIGZpZWxkICsgJ19jb2xzcGFuJ10pIHtcbiAgICAgICAgICAgICAgICBjb2xzcGFuXyA9IHNwcmludGYoJyBjb2xzcGFuPVwiJXNcIicsIGl0ZW1bJ18nICsgZmllbGQgKyAnX2NvbHNwYW4nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfdGl0bGUnXSkge1xuICAgICAgICAgICAgICAgIHRpdGxlXyA9IHNwcmludGYoJyB0aXRsZT1cIiVzXCInLCBpdGVtWydfJyArIGZpZWxkICsgJ190aXRsZSddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNlbGxTdHlsZSA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoYXQuaGVhZGVyLFxuICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmNlbGxTdHlsZXNbal0sIFt2YWx1ZV8sIGl0ZW0sIGksIGZpZWxkXSwgY2VsbFN0eWxlKTtcbiAgICAgICAgICAgIGlmIChjZWxsU3R5bGUuY2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIGNsYXNzXyA9IHNwcmludGYoJyBjbGFzcz1cIiVzXCInLCBjZWxsU3R5bGUuY2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2VsbFN0eWxlLmNzcykge1xuICAgICAgICAgICAgICAgIHZhciBjc3Nlc18gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2VsbFN0eWxlLmNzcykge1xuICAgICAgICAgICAgICAgICAgICBjc3Nlc18ucHVzaChrZXkgKyAnOiAnICsgY2VsbFN0eWxlLmNzc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3R5bGUgPSBzcHJpbnRmKCdzdHlsZT1cIiVzXCInLCBjc3Nlc18uY29uY2F0KHRoYXQuaGVhZGVyLnN0eWxlc1tqXSkuam9pbignOyAnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gY2FsY3VsYXRlT2JqZWN0VmFsdWUoY29sdW1uLFxuICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0sIFt2YWx1ZV8sIGl0ZW0sIGldLCB2YWx1ZV8pO1xuXG4gICAgICAgICAgICBpZiAoaXRlbVsnXycgKyBmaWVsZCArICdfZGF0YSddICYmICEkLmlzRW1wdHlPYmplY3QoaXRlbVsnXycgKyBmaWVsZCArICdfZGF0YSddKSkge1xuICAgICAgICAgICAgICAgICQuZWFjaChpdGVtWydfJyArIGZpZWxkICsgJ19kYXRhJ10sIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIGRhdGEtaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPT09ICdpbmRleCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkYXRhXyArPSBzcHJpbnRmKCcgZGF0YS0lcz1cIiVzXCInLCBrLCB2KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbHVtbi5jaGVja2JveCB8fCBjb2x1bW4ucmFkaW8pIHtcbiAgICAgICAgICAgICAgICB0eXBlID0gY29sdW1uLmNoZWNrYm94ID8gJ2NoZWNrYm94JyA6IHR5cGU7XG4gICAgICAgICAgICAgICAgdHlwZSA9IGNvbHVtbi5yYWRpbyA/ICdyYWRpbycgOiB0eXBlO1xuXG4gICAgICAgICAgICAgICAgdGV4dCA9IFtzcHJpbnRmKHRoYXQub3B0aW9ucy5jYXJkVmlldyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNhcmQtdmlldyAlc1wiPicgOiAnPHRkIGNsYXNzPVwiYnMtY2hlY2tib3ggJXNcIj4nLCBjb2x1bW5bJ2NsYXNzJ10gfHwgJycpLFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0JyArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBkYXRhLWluZGV4PVwiJXNcIicsIGkpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIG5hbWU9XCIlc1wiJywgdGhhdC5vcHRpb25zLnNlbGVjdEl0ZW1OYW1lKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyB0eXBlPVwiJXNcIicsIHR5cGUpICtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW50ZignIHZhbHVlPVwiJXNcIicsIGl0ZW1bdGhhdC5vcHRpb25zLmlkRmllbGRdKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBjaGVja2VkPVwiJXNcIicsIHZhbHVlID09PSB0cnVlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVfIHx8IHZhbHVlICYmIHZhbHVlLmNoZWNrZWQpID8gJ2NoZWNrZWQnIDogdW5kZWZpbmVkKSArXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJyBkaXNhYmxlZD1cIiVzXCInLCAhY29sdW1uLmNoZWNrYm94RW5hYmxlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlICYmIHZhbHVlLmRpc2FibGVkKSA/ICdkaXNhYmxlZCcgOiB1bmRlZmluZWQpICtcbiAgICAgICAgICAgICAgICAgICAgJyAvPicsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuaGVhZGVyLmZvcm1hdHRlcnNbal0gJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5jYXJkVmlldyA/ICc8L2Rpdj4nIDogJzwvdGQ+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICBpdGVtW3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gdmFsdWUgPT09IHRydWUgfHwgKHZhbHVlICYmIHZhbHVlLmNoZWNrZWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT09IG51bGwgP1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm9wdGlvbnMudW5kZWZpbmVkVGV4dCA6IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRoYXQub3B0aW9ucy5jYXJkVmlldyA/IFsnPGRpdiBjbGFzcz1cImNhcmQtdmlld1wiPicsXG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5zaG93SGVhZGVyID8gc3ByaW50ZignPHNwYW4gY2xhc3M9XCJ0aXRsZVwiICVzPiVzPC9zcGFuPicsIHN0eWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvcGVydHlGcm9tT3RoZXIodGhhdC5jb2x1bW5zLCAnZmllbGQnLCAndGl0bGUnLCBmaWVsZCkpIDogJycsXG4gICAgICAgICAgICAgICAgICAgIHNwcmludGYoJzxzcGFuIGNsYXNzPVwidmFsdWVcIj4lczwvc3Bhbj4nLCB2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKSA6IFtzcHJpbnRmKCc8dGQlcyAlcyAlcyAlcyAlcyAlcyAlcz4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfLCBjbGFzc18sIHN0eWxlLCBkYXRhXywgcm93c3Bhbl8sIGNvbHNwYW5fLCB0aXRsZV8pLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgJzwvdGQ+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBIaWRlIGVtcHR5IGRhdGEgb24gQ2FyZCB2aWV3IHdoZW4gc21hcnREaXNwbGF5IGlzIHNldCB0byB0cnVlLlxuICAgICAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgdGhhdC5vcHRpb25zLnNtYXJ0RGlzcGxheSAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2hvdWxkIHNldCBhIHBsYWNlaG9sZGVyIGZvciBldmVudCBiaW5kaW5nIGNvcnJlY3QgZmllbGRJbmRleFxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJzxkaXYgY2xhc3M9XCJjYXJkLXZpZXdcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaHRtbC5wdXNoKHRleHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICBodG1sLnB1c2goJzwvZGl2PjwvdGQ+Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaHRtbC5wdXNoKCc8L3RyPicpO1xuXG4gICAgICAgIHJldHVybiBodG1sLmpvaW4oJyAnKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRCb2R5ID0gZnVuY3Rpb24gKGZpeGVkU2Nyb2xsKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXSxcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldERhdGEoKTtcblxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3ByZS1ib2R5JywgZGF0YSk7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9IHRoaXMuJGVsLmZpbmQoJz50Ym9keScpO1xuICAgICAgICBpZiAoIXRoaXMuJGJvZHkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLiRib2R5ID0gJCgnPHRib2R5PjwvdGJvZHk+JykuYXBwZW5kVG8odGhpcy4kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9GaXggIzM4OSBCb290c3RyYXAtdGFibGUtZmxhdEpTT04gaXMgbm90IHdvcmtpbmdcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmF0aW9uIHx8IHRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicpIHtcbiAgICAgICAgICAgIHRoaXMucGFnZUZyb20gPSAxO1xuICAgICAgICAgICAgdGhpcy5wYWdlVG8gPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0ckZyYWdtZW50cyA9ICQoZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcbiAgICAgICAgdmFyIGhhc1RyO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnBhZ2VGcm9tIC0gMTsgaSA8IHRoaXMucGFnZVRvOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZGF0YVtpXTtcbiAgICAgICAgICAgIHZhciB0ciA9IHRoaXMuaW5pdFJvdyhpdGVtLCBpLCBkYXRhLCB0ckZyYWdtZW50cyk7XG4gICAgICAgICAgICBoYXNUciA9IGhhc1RyIHx8ICEhdHI7XG4gICAgICAgICAgICBpZiAodHImJnRyIT09dHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRyRnJhZ21lbnRzLmFwcGVuZCh0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG93IG5vIHJlY29yZHNcbiAgICAgICAgaWYgKCFoYXNUcikge1xuICAgICAgICAgICAgdHJGcmFnbWVudHMuYXBwZW5kKCc8dHIgY2xhc3M9XCJuby1yZWNvcmRzLWZvdW5kXCI+JyArXG4gICAgICAgICAgICAgICAgc3ByaW50ZignPHRkIGNvbHNwYW49XCIlc1wiPiVzPC90ZD4nLFxuICAgICAgICAgICAgICAgIHRoaXMuJGhlYWRlci5maW5kKCd0aCcpLmxlbmd0aCxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9ybWF0Tm9NYXRjaGVzKCkpICtcbiAgICAgICAgICAgICAgICAnPC90cj4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGJvZHkuaHRtbCh0ckZyYWdtZW50cyk7XG5cbiAgICAgICAgaWYgKCFmaXhlZFNjcm9sbCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbygwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsaWNrIHRvIHNlbGVjdCBieSBjb2x1bW5cbiAgICAgICAgdGhpcy4kYm9keS5maW5kKCc+IHRyW2RhdGEtaW5kZXhdID4gdGQnKS5vZmYoJ2NsaWNrIGRibGNsaWNrJykub24oJ2NsaWNrIGRibGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICR0ciA9ICR0ZC5wYXJlbnQoKSxcbiAgICAgICAgICAgICAgICBpdGVtID0gdGhhdC5kYXRhWyR0ci5kYXRhKCdpbmRleCcpXSxcbiAgICAgICAgICAgICAgICBpbmRleCA9ICR0ZFswXS5jZWxsSW5kZXgsXG4gICAgICAgICAgICAgICAgZmllbGRzID0gdGhhdC5nZXRWaXNpYmxlRmllbGRzKCksXG4gICAgICAgICAgICAgICAgZmllbGQgPSBmaWVsZHNbdGhhdC5vcHRpb25zLmRldGFpbFZpZXcgJiYgIXRoYXQub3B0aW9ucy5jYXJkVmlldyA/IGluZGV4IC0gMSA6IGluZGV4XSxcbiAgICAgICAgICAgICAgICBjb2x1bW4gPSB0aGF0LmNvbHVtbnNbZ2V0RmllbGRJbmRleCh0aGF0LmNvbHVtbnMsIGZpZWxkKV0sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXRJdGVtRmllbGQoaXRlbSwgZmllbGQsIHRoYXQub3B0aW9ucy5lc2NhcGUpO1xuXG4gICAgICAgICAgICBpZiAoJHRkLmZpbmQoJy5kZXRhaWwtaWNvbicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC50cmlnZ2VyKGUudHlwZSA9PT0gJ2NsaWNrJyA/ICdjbGljay1jZWxsJyA6ICdkYmwtY2xpY2stY2VsbCcsIGZpZWxkLCB2YWx1ZSwgaXRlbSwgJHRkKTtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcihlLnR5cGUgPT09ICdjbGljaycgPyAnY2xpY2stcm93JyA6ICdkYmwtY2xpY2stcm93JywgaXRlbSwgJHRyLCBmaWVsZCk7XG5cbiAgICAgICAgICAgIC8vIGlmIGNsaWNrIHRvIHNlbGVjdCAtIHRoZW4gdHJpZ2dlciB0aGUgY2hlY2tib3gvcmFkaW8gY2xpY2tcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09ICdjbGljaycgJiYgdGhhdC5vcHRpb25zLmNsaWNrVG9TZWxlY3QgJiYgY29sdW1uLmNsaWNrVG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGVjdEl0ZW0gPSAkdHIuZmluZChzcHJpbnRmKCdbbmFtZT1cIiVzXCJdJywgdGhhdC5vcHRpb25zLnNlbGVjdEl0ZW1OYW1lKSk7XG4gICAgICAgICAgICAgICAgaWYgKCRzZWxlY3RJdGVtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0SXRlbVswXS5jbGljaygpOyAvLyAjMTQ0OiAudHJpZ2dlcignY2xpY2snKSBidWdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPiB0cltkYXRhLWluZGV4XSA+IHRkID4gLmRldGFpbC1pY29uJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRyID0gJHRoaXMucGFyZW50KCkucGFyZW50KCksXG4gICAgICAgICAgICAgICAgaW5kZXggPSAkdHIuZGF0YSgnaW5kZXgnKSxcbiAgICAgICAgICAgICAgICByb3cgPSBkYXRhW2luZGV4XTsgLy8gRml4ICM5ODAgRGV0YWlsIHZpZXcsIHdoZW4gc2VhcmNoaW5nLCByZXR1cm5zIHdyb25nIHJvd1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgYW5kIHVwZGF0ZVxuICAgICAgICAgICAgaWYgKCR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCdpJykuYXR0cignY2xhc3MnLCBzcHJpbnRmKCclcyAlcycsIHRoYXQub3B0aW9ucy5pY29uc1ByZWZpeCwgdGhhdC5vcHRpb25zLmljb25zLmRldGFpbE9wZW4pKTtcbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2NvbGxhcHNlLXJvdycsIGluZGV4LCByb3cpO1xuICAgICAgICAgICAgICAgICR0ci5uZXh0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ2knKS5hdHRyKCdjbGFzcycsIHNwcmludGYoJyVzICVzJywgdGhhdC5vcHRpb25zLmljb25zUHJlZml4LCB0aGF0Lm9wdGlvbnMuaWNvbnMuZGV0YWlsQ2xvc2UpKTtcbiAgICAgICAgICAgICAgICAkdHIuYWZ0ZXIoc3ByaW50ZignPHRyIGNsYXNzPVwiZGV0YWlsLXZpZXdcIj48dGQgY29sc3Bhbj1cIiVzXCI+PC90ZD48L3RyPicsICR0ci5maW5kKCd0ZCcpLmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICR0ci5uZXh0KCkuZmluZCgndGQnKTtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoYXQub3B0aW9ucywgdGhhdC5vcHRpb25zLmRldGFpbEZvcm1hdHRlciwgW2luZGV4LCByb3csICRlbGVtZW50XSwgJycpO1xuICAgICAgICAgICAgICAgIGlmKCRlbGVtZW50Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hcHBlbmQoY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoYXQudHJpZ2dlcignZXhwYW5kLXJvdycsIGluZGV4LCByb3csICRlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoYXQucmVzZXRWaWV3KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0gPSB0aGlzLiRib2R5LmZpbmQoc3ByaW50ZignW25hbWU9XCIlc1wiXScsIHRoaXMub3B0aW9ucy5zZWxlY3RJdGVtTmFtZSkpO1xuICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAkdGhpcy5wcm9wKCdjaGVja2VkJyksXG4gICAgICAgICAgICAgICAgcm93ID0gdGhhdC5kYXRhWyR0aGlzLmRhdGEoJ2luZGV4JyldO1xuXG4gICAgICAgICAgICBpZiAodGhhdC5vcHRpb25zLm1haW50YWluU2VsZWN0ZWQgJiYgJCh0aGlzKS5pcygnOnJhZGlvJykpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2godGhhdC5vcHRpb25zLmRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93W3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJvd1t0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9IGNoZWNrZWQ7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2luZ2xlU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kc2VsZWN0SXRlbS5ub3QodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZGF0YVskKHRoaXMpLmRhdGEoJ2luZGV4JyldW3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhhdC4kc2VsZWN0SXRlbS5maWx0ZXIoJzpjaGVja2VkJykubm90KHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoYXQudXBkYXRlU2VsZWN0ZWQoKTtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrJyA6ICd1bmNoZWNrJywgcm93LCAkdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmhlYWRlci5ldmVudHMsIGZ1bmN0aW9uIChpLCBldmVudHMpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZml4IGJ1ZywgaWYgZXZlbnRzIGlzIGRlZmluZWQgd2l0aCBuYW1lc3BhY2VcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGV2ZW50cyA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsIGV2ZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaWVsZCA9IHRoYXQuaGVhZGVyLmZpZWxkc1tpXSxcbiAgICAgICAgICAgICAgICBmaWVsZEluZGV4ID0gJC5pbkFycmF5KGZpZWxkLCB0aGF0LmdldFZpc2libGVGaWVsZHMoKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhdGhhdC5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAgICAgZmllbGRJbmRleCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kYm9keS5maW5kKCc+dHI6bm90KC5uby1yZWNvcmRzLWZvdW5kKScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRyID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZCA9ICR0ci5maW5kKHRoYXQub3B0aW9ucy5jYXJkVmlldyA/ICcuY2FyZC12aWV3JyA6ICd0ZCcpLmVxKGZpZWxkSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBrZXkuaW5kZXhPZignICcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IGtleS5zdWJzdHJpbmcoMCwgaW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWwgPSBrZXkuc3Vic3RyaW5nKGluZGV4ICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jID0gZXZlbnRzW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgJHRkLmZpbmQoZWwpLm9mZihuYW1lKS5vbihuYW1lLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJHRyLmRhdGEoJ2luZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93ID0gdGhhdC5kYXRhW2luZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJvd1tmaWVsZF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMuYXBwbHkodGhpcywgW2UsIHZhbHVlLCByb3csIGluZGV4XSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkKCk7XG4gICAgICAgIHRoaXMucmVzZXRWaWV3KCk7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyKCdwb3N0LWJvZHknLCBkYXRhKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluaXRTZXJ2ZXIgPSBmdW5jdGlvbiAoc2lsZW50LCBxdWVyeSwgdXJsKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGRhdGEgPSB7fSxcbiAgICAgICAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXh0OiB0aGlzLnNlYXJjaFRleHQsXG4gICAgICAgICAgICAgICAgc29ydE5hbWU6IHRoaXMub3B0aW9ucy5zb3J0TmFtZSxcbiAgICAgICAgICAgICAgICBzb3J0T3JkZXI6IHRoaXMub3B0aW9ucy5zb3J0T3JkZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1ZXN0O1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgcGFyYW1zLnBhZ2VTaXplID0gdGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpID9cbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxSb3dzIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplO1xuICAgICAgICAgICAgcGFyYW1zLnBhZ2VOdW1iZXIgPSB0aGlzLm9wdGlvbnMucGFnZU51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHVybCB8fCB0aGlzLm9wdGlvbnMudXJsKSAmJiAhdGhpcy5vcHRpb25zLmFqYXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucXVlcnlQYXJhbXNUeXBlID09PSAnbGltaXQnKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoOiBwYXJhbXMuc2VhcmNoVGV4dCxcbiAgICAgICAgICAgICAgICBzb3J0OiBwYXJhbXMuc29ydE5hbWUsXG4gICAgICAgICAgICAgICAgb3JkZXI6IHBhcmFtcy5zb3J0T3JkZXJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5vZmZzZXQgPSB0aGlzLm9wdGlvbnMucGFnZVNpemUgPT09IHRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCkgP1xuICAgICAgICAgICAgICAgICAgICAwIDogdGhpcy5vcHRpb25zLnBhZ2VTaXplICogKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyIC0gMSk7XG4gICAgICAgICAgICAgICAgcGFyYW1zLmxpbWl0ID0gdGhpcy5vcHRpb25zLnBhZ2VTaXplID09PSB0aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpID9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRvdGFsUm93cyA6IHRoaXMub3B0aW9ucy5wYWdlU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKCQuaXNFbXB0eU9iamVjdCh0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsKSkpIHtcbiAgICAgICAgICAgIHBhcmFtcy5maWx0ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsLCBudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZSh0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5xdWVyeVBhcmFtcywgW3BhcmFtc10sIGRhdGEpO1xuXG4gICAgICAgICQuZXh0ZW5kKGRhdGEsIHF1ZXJ5IHx8IHt9KTtcblxuICAgICAgICAvLyBmYWxzZSB0byBzdG9wIHJlcXVlc3RcbiAgICAgICAgaWYgKGRhdGEgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0ID0gJC5leHRlbmQoe30sIGNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsIHRoaXMub3B0aW9ucy5hamF4T3B0aW9ucyksIHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5tZXRob2QsXG4gICAgICAgICAgICB1cmw6ICB1cmwgfHwgdGhpcy5vcHRpb25zLnVybCxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMub3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nICYmIHRoaXMub3B0aW9ucy5tZXRob2QgPT09ICdwb3N0JyA/XG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBkYXRhLFxuICAgICAgICAgICAgY2FjaGU6IHRoaXMub3B0aW9ucy5jYWNoZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiB0aGlzLm9wdGlvbnMuY29udGVudFR5cGUsXG4gICAgICAgICAgICBkYXRhVHlwZTogdGhpcy5vcHRpb25zLmRhdGFUeXBlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgIHJlcyA9IGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoYXQub3B0aW9ucywgdGhhdC5vcHRpb25zLnJlc3BvbnNlSGFuZGxlciwgW3Jlc10sIHJlcyk7XG5cbiAgICAgICAgICAgICAgICB0aGF0LmxvYWQocmVzKTtcbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2xvYWQtc3VjY2VzcycsIHJlcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFzaWxlbnQpIHRoYXQuJHRhYmxlTG9hZGluZy5oaWRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRyaWdnZXIoJ2xvYWQtZXJyb3InLCByZXMuc3RhdHVzLCByZXMpO1xuICAgICAgICAgICAgICAgIGlmICghc2lsZW50KSB0aGF0LiR0YWJsZUxvYWRpbmcuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFqYXgpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMsIHRoaXMub3B0aW9ucy5hamF4LCBbcmVxdWVzdF0sIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3hociAmJiB0aGlzLl94aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3hoci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5feGhyID0gJC5hamF4KHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5pbml0U2VhcmNoVGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zZWFyY2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2VhcmNoVGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHNlYXJjaCA9IHRoaXMuJHRvb2xiYXIuZmluZCgnLnNlYXJjaCBpbnB1dCcpO1xuICAgICAgICAgICAgICAgICRzZWFyY2gudmFsKHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VhcmNoKHtjdXJyZW50VGFyZ2V0OiAkc2VhcmNofSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldENhcmV0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuJGhlYWRlci5maW5kKCd0aCcpLCBmdW5jdGlvbiAoaSwgdGgpIHtcbiAgICAgICAgICAgICQodGgpLmZpbmQoJy5zb3J0YWJsZScpLnJlbW92ZUNsYXNzKCdkZXNjIGFzYycpLmFkZENsYXNzKCQodGgpLmRhdGEoJ2ZpZWxkJykgPT09IHRoYXQub3B0aW9ucy5zb3J0TmFtZSA/IHRoYXQub3B0aW9ucy5zb3J0T3JkZXIgOiAnYm90aCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2hlY2tBbGwgPSB0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKS5sZW5ndGggJiZcbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLmxlbmd0aCA9PT1cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0QWxsLmFkZCh0aGlzLiRzZWxlY3RBbGxfKS5wcm9wKCdjaGVja2VkJywgY2hlY2tBbGwpO1xuXG4gICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0uZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ3RyJylbJCh0aGlzKS5wcm9wKCdjaGVja2VkJykgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudXBkYXRlUm93cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0uZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LmRhdGFbJCh0aGlzKS5kYXRhKCdpbmRleCcpXVt0aGF0LmhlYWRlci5zdGF0ZUZpZWxkXSA9ICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlc2V0Um93cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmRhdGEsIGZ1bmN0aW9uIChpLCByb3cpIHtcbiAgICAgICAgICAgIHRoYXQuJHNlbGVjdEFsbC5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgdGhhdC4kc2VsZWN0SXRlbS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHRoYXQuaGVhZGVyLnN0YXRlRmllbGQpIHtcbiAgICAgICAgICAgICAgICByb3dbdGhhdC5oZWFkZXIuc3RhdGVGaWVsZF0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5pdEhpZGRlblJvd3MoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgbmFtZSArPSAnLmJzLnRhYmxlJztcbiAgICAgICAgdGhpcy5vcHRpb25zW0Jvb3RzdHJhcFRhYmxlLkVWRU5UU1tuYW1lXV0uYXBwbHkodGhpcy5vcHRpb25zLCBhcmdzKTtcbiAgICAgICAgdGhpcy4kZWwudHJpZ2dlcigkLkV2ZW50KG5hbWUpLCBhcmdzKTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMub25BbGwobmFtZSwgYXJncyk7XG4gICAgICAgIHRoaXMuJGVsLnRyaWdnZXIoJC5FdmVudCgnYWxsLmJzLnRhYmxlJyksIFtuYW1lLCBhcmdzXSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZXNldEhlYWRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZml4ICM2MTogdGhlIGhpZGRlbiB0YWJsZSByZXNldCBoZWFkZXIgYnVnLlxuICAgICAgICAvLyBmaXggYnVnOiBnZXQgJGVsLmNzcygnd2lkdGgnKSBlcnJvciBzb21ldGltZSAoaGVpZ2h0ID0gNTAwKVxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWRfKTtcbiAgICAgICAgdGhpcy50aW1lb3V0SWRfID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuZml0SGVhZGVyLCB0aGlzKSwgdGhpcy4kZWwuaXMoJzpoaWRkZW4nKSA/IDEwMCA6IDApO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZml0SGVhZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBmaXhlZEJvZHksXG4gICAgICAgICAgICBzY3JvbGxXaWR0aCxcbiAgICAgICAgICAgIGZvY3VzZWQsXG4gICAgICAgICAgICBmb2N1c2VkVGVtcDtcblxuICAgICAgICBpZiAodGhhdC4kZWwuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAgICAgdGhhdC50aW1lb3V0SWRfID0gc2V0VGltZW91dCgkLnByb3h5KHRoYXQuZml0SGVhZGVyLCB0aGF0KSwgMTAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmaXhlZEJvZHkgPSB0aGlzLiR0YWJsZUJvZHkuZ2V0KDApO1xuXG4gICAgICAgIHNjcm9sbFdpZHRoID0gZml4ZWRCb2R5LnNjcm9sbFdpZHRoID4gZml4ZWRCb2R5LmNsaWVudFdpZHRoICYmXG4gICAgICAgIGZpeGVkQm9keS5zY3JvbGxIZWlnaHQgPiBmaXhlZEJvZHkuY2xpZW50SGVpZ2h0ICsgdGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCkgP1xuICAgICAgICAgICAgZ2V0U2Nyb2xsQmFyV2lkdGgoKSA6IDA7XG5cbiAgICAgICAgdGhpcy4kZWwuY3NzKCdtYXJnaW4tdG9wJywgLXRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpKTtcblxuICAgICAgICBmb2N1c2VkID0gJCgnOmZvY3VzJyk7XG4gICAgICAgIGlmIChmb2N1c2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciAkdGggPSBmb2N1c2VkLnBhcmVudHMoJ3RoJyk7XG4gICAgICAgICAgICBpZiAoJHRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUZpZWxkID0gJHRoLmF0dHIoJ2RhdGEtZmllbGQnKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YUZpZWxkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRoZWFkZXJUaCA9IHRoaXMuJGhlYWRlci5maW5kKFwiW2RhdGEtZmllbGQ9J1wiICsgZGF0YUZpZWxkICsgXCInXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRoZWFkZXJUaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaGVhZGVyVGguZmluZChcIjppbnB1dFwiKS5hZGRDbGFzcyhcImZvY3VzLXRlbXBcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRoZWFkZXJfID0gdGhpcy4kaGVhZGVyLmNsb25lKHRydWUsIHRydWUpO1xuICAgICAgICB0aGlzLiRzZWxlY3RBbGxfID0gdGhpcy4kaGVhZGVyXy5maW5kKCdbbmFtZT1cImJ0U2VsZWN0QWxsXCJdJyk7XG4gICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLmNzcyh7XG4gICAgICAgICAgICAnbWFyZ2luLXJpZ2h0Jzogc2Nyb2xsV2lkdGhcbiAgICAgICAgfSkuZmluZCgndGFibGUnKS5jc3MoJ3dpZHRoJywgdGhpcy4kZWwub3V0ZXJXaWR0aCgpKVxuICAgICAgICAgICAgLmh0bWwoJycpLmF0dHIoJ2NsYXNzJywgdGhpcy4kZWwuYXR0cignY2xhc3MnKSlcbiAgICAgICAgICAgIC5hcHBlbmQodGhpcy4kaGVhZGVyXyk7XG5cblxuICAgICAgICBmb2N1c2VkVGVtcCA9ICQoJy5mb2N1cy10ZW1wOnZpc2libGU6ZXEoMCknKTtcbiAgICAgICAgaWYgKGZvY3VzZWRUZW1wLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvY3VzZWRUZW1wLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgnLmZvY3VzLXRlbXAnKS5yZW1vdmVDbGFzcygnZm9jdXMtdGVtcCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZml4IGJ1ZzogJC5kYXRhKCkgaXMgbm90IHdvcmtpbmcgYXMgZXhwZWN0ZWQgYWZ0ZXIgJC5hcHBlbmQoKVxuICAgICAgICB0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICB0aGF0LiRoZWFkZXJfLmZpbmQoc3ByaW50ZigndGhbZGF0YS1maWVsZD1cIiVzXCJdJywgJCh0aGlzKS5kYXRhKCdmaWVsZCcpKSkuZGF0YSgkKHRoaXMpLmRhdGEoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB2aXNpYmxlRmllbGRzID0gdGhpcy5nZXRWaXNpYmxlRmllbGRzKCksXG4gICAgICAgICAgICAkdGhzID0gdGhpcy4kaGVhZGVyXy5maW5kKCd0aCcpO1xuXG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnPnRyOmZpcnN0LWNoaWxkOm5vdCgubm8tcmVjb3Jkcy1mb3VuZCkgPiAqJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuZGV0YWlsVmlldyAmJiAhdGhhdC5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kaGVhZGVyXy5maW5kKCd0aC5kZXRhaWwnKS5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgkdGhpcy5pbm5lcldpZHRoKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmRleCA9IGkgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgJHRoID0gdGhhdC4kaGVhZGVyXy5maW5kKHNwcmludGYoJ3RoW2RhdGEtZmllbGQ9XCIlc1wiXScsIHZpc2libGVGaWVsZHNbaW5kZXhdKSk7XG4gICAgICAgICAgICBpZiAoJHRoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAkdGggPSAkKCR0aHNbJHRoaXNbMF0uY2VsbEluZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aC5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgkdGhpcy5pbm5lcldpZHRoKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaG9yaXpvbnRhbCBzY3JvbGwgZXZlbnRcbiAgICAgICAgLy8gVE9ETzogaXQncyBwcm9iYWJseSBiZXR0ZXIgaW1wcm92aW5nIHRoZSBsYXlvdXQgdGhhbiBiaW5kaW5nIHRvIHNjcm9sbCBldmVudFxuICAgICAgICB0aGlzLiR0YWJsZUJvZHkub2ZmKCdzY3JvbGwnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kdGFibGVIZWFkZXIuc2Nyb2xsTGVmdCgkKHRoaXMpLnNjcm9sbExlZnQoKSk7XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuc2hvd0Zvb3RlciAmJiAhdGhhdC5vcHRpb25zLmNhcmRWaWV3KSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kdGFibGVGb290ZXIuc2Nyb2xsTGVmdCgkKHRoaXMpLnNjcm9sbExlZnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGF0LnRyaWdnZXIoJ3Bvc3QtaGVhZGVyJyk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZXNldEZvb3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgZGF0YSA9IHRoYXQuZ2V0RGF0YSgpLFxuICAgICAgICAgICAgaHRtbCA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dGb290ZXIgfHwgdGhpcy5vcHRpb25zLmNhcmRWaWV3KSB7IC8vZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY2FyZFZpZXcgJiYgdGhpcy5vcHRpb25zLmRldGFpbFZpZXcpIHtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkPjxkaXYgY2xhc3M9XCJ0aC1pbm5lclwiPiZuYnNwOzwvZGl2PjxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PjwvdGQ+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAkLmVhY2godGhpcy5jb2x1bW5zLCBmdW5jdGlvbiAoaSwgY29sdW1uKSB7XG4gICAgICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgICAgIGZhbGlnbiA9ICcnLCAvLyBmb290ZXIgYWxpZ24gc3R5bGVcbiAgICAgICAgICAgICAgICB2YWxpZ24gPSAnJyxcbiAgICAgICAgICAgICAgICBjc3NlcyA9IFtdLFxuICAgICAgICAgICAgICAgIHN0eWxlID0ge30sXG4gICAgICAgICAgICAgICAgY2xhc3NfID0gc3ByaW50ZignIGNsYXNzPVwiJXNcIicsIGNvbHVtblsnY2xhc3MnXSk7XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGF0Lm9wdGlvbnMuY2FyZFZpZXcgJiYgKCFjb2x1bW4uY2FyZFZpc2libGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmYWxpZ24gPSBzcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJywgY29sdW1uLmZhbGlnbiA/IGNvbHVtbi5mYWxpZ24gOiBjb2x1bW4uYWxpZ24pO1xuICAgICAgICAgICAgdmFsaWduID0gc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLCBjb2x1bW4udmFsaWduKTtcblxuICAgICAgICAgICAgc3R5bGUgPSBjYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLCB0aGF0Lm9wdGlvbnMuZm9vdGVyU3R5bGUpO1xuXG4gICAgICAgICAgICBpZiAoc3R5bGUgJiYgc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrZXkgaW4gc3R5bGUuY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzc2VzLnB1c2goa2V5ICsgJzogJyArIHN0eWxlLmNzc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPHRkJywgY2xhc3NfLCBzcHJpbnRmKCcgc3R5bGU9XCIlc1wiJywgZmFsaWduICsgdmFsaWduICsgY3NzZXMuY29uY2F0KCkuam9pbignOyAnKSksICc+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJ0aC1pbm5lclwiPicpO1xuXG4gICAgICAgICAgICBodG1sLnB1c2goY2FsY3VsYXRlT2JqZWN0VmFsdWUoY29sdW1uLCBjb2x1bW4uZm9vdGVyRm9ybWF0dGVyLCBbZGF0YV0sICcmbmJzcDsnKSB8fCAnJm5ic3A7Jyk7XG5cbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICBodG1sLnB1c2goJzxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PicpO1xuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2Rpdj4nKTtcbiAgICAgICAgICAgIGh0bWwucHVzaCgnPC90ZD4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuZmluZCgndHInKS5odG1sKGh0bWwuam9pbignJykpO1xuICAgICAgICB0aGlzLiR0YWJsZUZvb3Rlci5zaG93KCk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRGb290ZXJfKTtcbiAgICAgICAgdGhpcy50aW1lb3V0Rm9vdGVyXyA9IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmZpdEZvb3RlciwgdGhpcyksXG4gICAgICAgICAgICB0aGlzLiRlbC5pcygnOmhpZGRlbicpID8gMTAwIDogMCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5maXRGb290ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICRmb290ZXJUZCxcbiAgICAgICAgICAgIGVsV2lkdGgsXG4gICAgICAgICAgICBzY3JvbGxXaWR0aDtcblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0Rm9vdGVyXyk7XG4gICAgICAgIGlmICh0aGlzLiRlbC5pcygnOmhpZGRlbicpKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRGb290ZXJfID0gc2V0VGltZW91dCgkLnByb3h5KHRoaXMuZml0Rm9vdGVyLCB0aGlzKSwgMTAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsV2lkdGggPSB0aGlzLiRlbC5jc3MoJ3dpZHRoJyk7XG4gICAgICAgIHNjcm9sbFdpZHRoID0gZWxXaWR0aCA+IHRoaXMuJHRhYmxlQm9keS53aWR0aCgpID8gZ2V0U2Nyb2xsQmFyV2lkdGgoKSA6IDA7XG5cbiAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuY3NzKHtcbiAgICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiBzY3JvbGxXaWR0aFxuICAgICAgICB9KS5maW5kKCd0YWJsZScpLmNzcygnd2lkdGgnLCBlbFdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgdGhpcy4kZWwuYXR0cignY2xhc3MnKSk7XG5cbiAgICAgICAgJGZvb3RlclRkID0gdGhpcy4kdGFibGVGb290ZXIuZmluZCgndGQnKTtcblxuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJz50cjpmaXJzdC1jaGlsZDpub3QoLm5vLXJlY29yZHMtZm91bmQpID4gKicpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICRmb290ZXJUZC5lcShpKS5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgkdGhpcy5pbm5lcldpZHRoKCkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRvZ2dsZUNvbHVtbiA9IGZ1bmN0aW9uIChpbmRleCwgY2hlY2tlZCwgbmVlZFVwZGF0ZSkge1xuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2x1bW5zW2luZGV4XS52aXNpYmxlID0gY2hlY2tlZDtcbiAgICAgICAgdGhpcy5pbml0SGVhZGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkoKTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gdGhpcy4kdG9vbGJhci5maW5kKCcua2VlcC1vcGVuIGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChuZWVkVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgJGl0ZW1zLmZpbHRlcihzcHJpbnRmKCdbdmFsdWU9XCIlc1wiXScsIGluZGV4KSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPD0gdGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldFZpc2libGVGaWVsZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHZpc2libGVGaWVsZHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5oZWFkZXIuZmllbGRzLCBmdW5jdGlvbiAoaiwgZmllbGQpIHtcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGF0LmNvbHVtbnNbZ2V0RmllbGRJbmRleCh0aGF0LmNvbHVtbnMsIGZpZWxkKV07XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpYmxlRmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHZpc2libGVGaWVsZHM7XG4gICAgfTtcblxuICAgIC8vIFBVQkxJQyBGVU5DVElPTiBERUZJTklUSU9OXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZXNldFZpZXcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBwYWRkaW5nID0gMDtcblxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5oZWlnaHQgPSBwYXJhbXMuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0QWxsLnByb3AoJ2NoZWNrZWQnLCB0aGlzLiRzZWxlY3RJdGVtLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdEl0ZW0ubGVuZ3RoID09PSB0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgdG9vbGJhckhlaWdodCA9IHRoaXMuJHRvb2xiYXIub3V0ZXJIZWlnaHQodHJ1ZSksXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbkhlaWdodCA9IHRoaXMuJHBhZ2luYXRpb24ub3V0ZXJIZWlnaHQodHJ1ZSksXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5vcHRpb25zLmhlaWdodCAtIHRvb2xiYXJIZWlnaHQgLSBwYWdpbmF0aW9uSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLiR0YWJsZUNvbnRhaW5lci5jc3MoJ2hlaWdodCcsIGhlaWdodCArICdweCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYXJkVmlldykge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBlbGVtZW50IGNzc1xuICAgICAgICAgICAgdGhpcy4kZWwuY3NzKCdtYXJnaW4tdG9wJywgJzAnKTtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nLCAnMCcpO1xuICAgICAgICAgICAgdGhpcy4kdGFibGVGb290ZXIuaGlkZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGVhZGVyICYmIHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlSGVhZGVyLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMucmVzZXRIZWFkZXIoKTtcbiAgICAgICAgICAgIHBhZGRpbmcgKz0gdGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiR0YWJsZUhlYWRlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3Bvc3QtaGVhZGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dGb290ZXIpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRGb290ZXIoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZyArPSB0aGlzLiR0YWJsZUZvb3Rlci5vdXRlckhlaWdodCgpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2lnbiB0aGUgY29ycmVjdCBzb3J0YWJsZSBhcnJvd1xuICAgICAgICB0aGlzLmdldENhcmV0KCk7XG4gICAgICAgIHRoaXMuJHRhYmxlQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nLCBwYWRkaW5nICsgJ3B4Jyk7XG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzZXQtdmlldycpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uICh1c2VDdXJyZW50UGFnZSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc2VhcmNoVGV4dCB8fCAhJC5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1ucykgfHwgISQuaXNFbXB0eU9iamVjdCh0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsKSkgP1xuICAgICAgICAgICAgKHVzZUN1cnJlbnRQYWdlID8gdGhpcy5kYXRhLnNsaWNlKHRoaXMucGFnZUZyb20gLSAxLCB0aGlzLnBhZ2VUbykgOiB0aGlzLmRhdGEpIDpcbiAgICAgICAgICAgICh1c2VDdXJyZW50UGFnZSA/IHRoaXMub3B0aW9ucy5kYXRhLnNsaWNlKHRoaXMucGFnZUZyb20gLSAxLCB0aGlzLnBhZ2VUbykgOiB0aGlzLm9wdGlvbnMuZGF0YSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIGZpeGVkU2Nyb2xsID0gZmFsc2U7XG5cbiAgICAgICAgLy8gIzQzMTogc3VwcG9ydCBwYWdpbmF0aW9uXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudG90YWxSb3dzID0gZGF0YVt0aGlzLm9wdGlvbnMudG90YWxGaWVsZF07XG4gICAgICAgICAgICBmaXhlZFNjcm9sbCA9IGRhdGEuZml4ZWRTY3JvbGw7XG4gICAgICAgICAgICBkYXRhID0gZGF0YVt0aGlzLm9wdGlvbnMuZGF0YUZpZWxkXTtcbiAgICAgICAgfSBlbHNlIGlmICghJC5pc0FycmF5KGRhdGEpKSB7IC8vIHN1cHBvcnQgZml4ZWRTY3JvbGxcbiAgICAgICAgICAgIGZpeGVkU2Nyb2xsID0gZGF0YS5maXhlZFNjcm9sbDtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXREYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KGZpeGVkU2Nyb2xsKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMuaW5pdERhdGEoZGF0YSwgJ2FwcGVuZCcpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5wcmVwZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pbml0RGF0YShkYXRhLCAncHJlcGVuZCcpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRTb3J0KCk7XG4gICAgICAgIHRoaXMuaW5pdEJvZHkodHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICBpLCByb3c7XG5cbiAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWVzJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLm9wdGlvbnMuZGF0YVtpXTtcblxuICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkocGFyYW1zLmZpZWxkKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShyb3dbcGFyYW1zLmZpZWxkXSwgcGFyYW1zLnZhbHVlcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50b3RhbFJvd3MgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGVuID09PSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSgwLCB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRSb3dCeVVuaXF1ZUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciB1bmlxdWVJZCA9IHRoaXMub3B0aW9ucy51bmlxdWVJZCxcbiAgICAgICAgICAgIGxlbiA9IHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCxcbiAgICAgICAgICAgIGRhdGFSb3cgPSBudWxsLFxuICAgICAgICAgICAgaSwgcm93LCByb3dVbmlxdWVJZDtcblxuICAgICAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgcm93ID0gdGhpcy5vcHRpb25zLmRhdGFbaV07XG5cbiAgICAgICAgICAgIGlmIChyb3cuaGFzT3duUHJvcGVydHkodW5pcXVlSWQpKSB7IC8vIHVuaXF1ZUlkIGlzIGEgY29sdW1uXG4gICAgICAgICAgICAgICAgcm93VW5pcXVlSWQgPSByb3dbdW5pcXVlSWRdO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHJvdy5fZGF0YS5oYXNPd25Qcm9wZXJ0eSh1bmlxdWVJZCkpIHsgLy8gdW5pcXVlSWQgaXMgYSByb3cgZGF0YSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIHJvd1VuaXF1ZUlkID0gcm93Ll9kYXRhW3VuaXF1ZUlkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm93VW5pcXVlSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWQgPSBpZC50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygcm93VW5pcXVlSWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKChOdW1iZXIocm93VW5pcXVlSWQpID09PSByb3dVbmlxdWVJZCkgJiYgKHJvd1VuaXF1ZUlkICUgMSA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBwYXJzZUludChpZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgocm93VW5pcXVlSWQgPT09IE51bWJlcihyb3dVbmlxdWVJZCkpICYmIChyb3dVbmlxdWVJZCAhPT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBwYXJzZUZsb2F0KGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dVbmlxdWVJZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICBkYXRhUm93ID0gcm93O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFSb3c7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5yZW1vdmVCeVVuaXF1ZUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBsZW4gPSB0aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGgsXG4gICAgICAgICAgICByb3cgPSB0aGlzLmdldFJvd0J5VW5pcXVlSWQoaWQpO1xuXG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSh0aGlzLm9wdGlvbnMuZGF0YS5pbmRleE9mKHJvdyksIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlbiA9PT0gdGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudXBkYXRlQnlVbmlxdWVJZCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsUGFyYW1zID0gJC5pc0FycmF5KHBhcmFtcykgPyBwYXJhbXMgOiBbIHBhcmFtcyBdO1xuXG4gICAgICAgICQuZWFjaChhbGxQYXJhbXMsIGZ1bmN0aW9uKGksIHBhcmFtcykge1xuICAgICAgICAgICAgdmFyIHJvd0lkO1xuXG4gICAgICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaWQnKSB8fCAhcGFyYW1zLmhhc093blByb3BlcnR5KCdyb3cnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcm93SWQgPSAkLmluQXJyYXkodGhhdC5nZXRSb3dCeVVuaXF1ZUlkKHBhcmFtcy5pZCksIHRoYXQub3B0aW9ucy5kYXRhKTtcblxuICAgICAgICAgICAgaWYgKHJvd0lkID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQuZXh0ZW5kKHRoYXQub3B0aW9ucy5kYXRhW3Jvd0lkXSwgcGFyYW1zLnJvdyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmluc2VydFJvdyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2luZGV4JykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgncm93JykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEuc3BsaWNlKHBhcmFtcy5pbmRleCwgMCwgcGFyYW1zLnJvdyk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuICAgICAgICB0aGlzLmluaXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdFNvcnQoKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVwZGF0ZVJvdyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgYWxsUGFyYW1zID0gJC5pc0FycmF5KHBhcmFtcykgPyBwYXJhbXMgOiBbIHBhcmFtcyBdO1xuXG4gICAgICAgICQuZWFjaChhbGxQYXJhbXMsIGZ1bmN0aW9uKGksIHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKCFwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2luZGV4JykgfHwgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgncm93JykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmV4dGVuZCh0aGF0Lm9wdGlvbnMuZGF0YVtwYXJhbXMuaW5kZXhdLCBwYXJhbXMucm93KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaW5pdEhpZGRlblJvd3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuUm93cyA9IFtdO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2hvd1JvdyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy50b2dnbGVSb3cocGFyYW1zLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmhpZGVSb3cgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlUm93KHBhcmFtcywgZmFsc2UpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUudG9nZ2xlUm93ID0gZnVuY3Rpb24gKHBhcmFtcywgdmlzaWJsZSkge1xuICAgICAgICB2YXIgcm93LCBpbmRleDtcblxuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KCdpbmRleCcpKSB7XG4gICAgICAgICAgICByb3cgPSB0aGlzLmdldERhdGEoKVtwYXJhbXMuaW5kZXhdO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndW5pcXVlSWQnKSkge1xuICAgICAgICAgICAgcm93ID0gdGhpcy5nZXRSb3dCeVVuaXF1ZUlkKHBhcmFtcy51bmlxdWVJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5kZXggPSAkLmluQXJyYXkocm93LCB0aGlzLmhpZGRlblJvd3MpO1xuXG4gICAgICAgIGlmICghdmlzaWJsZSAmJiBpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZGVuUm93cy5wdXNoKHJvdyk7XG4gICAgICAgIH0gZWxzZSBpZiAodmlzaWJsZSAmJiBpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGRlblJvd3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0SGlkZGVuUm93cyA9IGZ1bmN0aW9uIChzaG93KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLmdldERhdGEoKSxcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcblxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGksIHJvdykge1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheShyb3csIHRoYXQuaGlkZGVuUm93cykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oaWRkZW5Sb3dzID0gcm93cztcbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5tZXJnZUNlbGxzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJvdyA9IG9wdGlvbnMuaW5kZXgsXG4gICAgICAgICAgICBjb2wgPSAkLmluQXJyYXkob3B0aW9ucy5maWVsZCwgdGhpcy5nZXRWaXNpYmxlRmllbGRzKCkpLFxuICAgICAgICAgICAgcm93c3BhbiA9IG9wdGlvbnMucm93c3BhbiB8fCAxLFxuICAgICAgICAgICAgY29sc3BhbiA9IG9wdGlvbnMuY29sc3BhbiB8fCAxLFxuICAgICAgICAgICAgaSwgaixcbiAgICAgICAgICAgICR0ciA9IHRoaXMuJGJvZHkuZmluZCgnPnRyJyksXG4gICAgICAgICAgICAkdGQ7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZXRhaWxWaWV3ICYmICF0aGlzLm9wdGlvbnMuY2FyZFZpZXcpIHtcbiAgICAgICAgICAgIGNvbCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRkID0gJHRyLmVxKHJvdykuZmluZCgnPnRkJykuZXEoY29sKTtcblxuICAgICAgICBpZiAocm93IDwgMCB8fCBjb2wgPCAwIHx8IHJvdyA+PSB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSByb3c7IGkgPCByb3cgKyByb3dzcGFuOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IGNvbDsgaiA8IGNvbCArIGNvbHNwYW47IGorKykge1xuICAgICAgICAgICAgICAgICR0ci5lcShpKS5maW5kKCc+dGQnKS5lcShqKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkdGQuYXR0cigncm93c3BhbicsIHJvd3NwYW4pLmF0dHIoJ2NvbHNwYW4nLCBjb2xzcGFuKS5zaG93KCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS51cGRhdGVDZWxsID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBpZiAoIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSB8fFxuICAgICAgICAgICAgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnZmllbGQnKSB8fFxuICAgICAgICAgICAgIXBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVtwYXJhbXMuaW5kZXhdW3BhcmFtcy5maWVsZF0gPSBwYXJhbXMudmFsdWU7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5yZWluaXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U29ydCgpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldFNlbGVjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gJC5ncmVwKHRoaXMub3B0aW9ucy5kYXRhLCBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICAvLyBmaXggIzI0MjQ6IGZyb20gaHRtbCB3aXRoIGNoZWNrYm94XG4gICAgICAgICAgICByZXR1cm4gcm93W3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdID09PSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmdldEFsbFNlbGVjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gJC5ncmVwKHRoaXMub3B0aW9ucy5kYXRhLCBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gcm93W3RoYXQuaGVhZGVyLnN0YXRlRmllbGRdO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrQWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNoZWNrQWxsXyh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVuY2hlY2tBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tBbGxfKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrSW52ZXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciByb3dzID0gdGhhdC4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJyk7XG4gICAgICAgIHZhciBjaGVja2VkID0gcm93cy5maWx0ZXIoJzpjaGVja2VkJyk7XG4gICAgICAgIHJvd3MuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsICEkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGF0LnVwZGF0ZVJvd3MoKTtcbiAgICAgICAgdGhhdC51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICB0aGF0LnRyaWdnZXIoJ3VuY2hlY2stc29tZScsIGNoZWNrZWQpO1xuICAgICAgICBjaGVja2VkID0gdGhhdC5nZXRTZWxlY3Rpb25zKCk7XG4gICAgICAgIHRoYXQudHJpZ2dlcignY2hlY2stc29tZScsIGNoZWNrZWQpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY2hlY2tBbGxfID0gZnVuY3Rpb24gKGNoZWNrZWQpIHtcbiAgICAgICAgdmFyIHJvd3M7XG4gICAgICAgIGlmICghY2hlY2tlZCkge1xuICAgICAgICAgICAgcm93cyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHNlbGVjdEFsbC5hZGQodGhpcy4kc2VsZWN0QWxsXykucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICB0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKS5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xuICAgICAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICAgICAgcm93cyA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrLWFsbCcgOiAndW5jaGVjay1hbGwnLCByb3dzKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHRoaXMuY2hlY2tfKHRydWUsIGluZGV4KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnVuY2hlY2sgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5jaGVja18oZmFsc2UsIGluZGV4KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmNoZWNrXyA9IGZ1bmN0aW9uIChjaGVja2VkLCBpbmRleCkge1xuICAgICAgICB2YXIgJGVsID0gdGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoc3ByaW50ZignW2RhdGEtaW5kZXg9XCIlc1wiXScsIGluZGV4KSkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICB0aGlzLmRhdGFbaW5kZXhdW3RoaXMuaGVhZGVyLnN0YXRlRmllbGRdID0gY2hlY2tlZDtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICB0aGlzLnRyaWdnZXIoY2hlY2tlZCA/ICdjaGVjaycgOiAndW5jaGVjaycsIHRoaXMuZGF0YVtpbmRleF0sICRlbCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jaGVja0J5ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB0aGlzLmNoZWNrQnlfKHRydWUsIG9iaik7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS51bmNoZWNrQnkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHRoaXMuY2hlY2tCeV8oZmFsc2UsIG9iaik7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5jaGVja0J5XyA9IGZ1bmN0aW9uIChjaGVja2VkLCBvYmopIHtcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykgfHwgIW9iai5oYXNPd25Qcm9wZXJ0eSgndmFsdWVzJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHJvd3MgPSBbXTtcbiAgICAgICAgJC5lYWNoKHRoaXMub3B0aW9ucy5kYXRhLCBmdW5jdGlvbiAoaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgaWYgKCFyb3cuaGFzT3duUHJvcGVydHkob2JqLmZpZWxkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkocm93W29iai5maWVsZF0sIG9iai52YWx1ZXMpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciAkZWwgPSB0aGF0LiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHNwcmludGYoJ1tkYXRhLWluZGV4PVwiJXNcIl0nLCBpbmRleCkpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgICByb3dbdGhhdC5oZWFkZXIuc3RhdGVGaWVsZF0gPSBjaGVja2VkO1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIHRoYXQudHJpZ2dlcihjaGVja2VkID8gJ2NoZWNrJyA6ICd1bmNoZWNrJywgcm93LCAkZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZCgpO1xuICAgICAgICB0aGlzLnRyaWdnZXIoY2hlY2tlZCA/ICdjaGVjay1zb21lJyA6ICd1bmNoZWNrLXNvbWUnLCByb3dzKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJGVsLmluc2VydEJlZm9yZSh0aGlzLiRjb250YWluZXIpO1xuICAgICAgICAkKHRoaXMub3B0aW9ucy50b29sYmFyKS5pbnNlcnRCZWZvcmUodGhpcy4kZWwpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIubmV4dCgpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy4kZWxfLmh0bWwoKSlcbiAgICAgICAgICAgIC5jc3MoJ21hcmdpbi10b3AnLCAnMCcpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCB0aGlzLiRlbF8uYXR0cignY2xhc3MnKSB8fCAnJyk7IC8vIHJlc2V0IHRoZSBjbGFzc1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2hvd0xvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJHRhYmxlTG9hZGluZy5zaG93KCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5oaWRlTG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kdGFibGVMb2FkaW5nLmhpZGUoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnRvZ2dsZVBhZ2luYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uID0gIXRoaXMub3B0aW9ucy5wYWdpbmF0aW9uO1xuICAgICAgICB2YXIgYnV0dG9uID0gdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIl0gaScpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luYXRpb24pIHtcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKFwiY2xhc3NcIiwgdGhpcy5vcHRpb25zLmljb25zUHJlZml4ICsgXCIgXCIgKyB0aGlzLm9wdGlvbnMuaWNvbnMucGFnaW5hdGlvblN3aXRjaERvd24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnV0dG9uLmF0dHIoXCJjbGFzc1wiLCB0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXggKyBcIiBcIiArIHRoaXMub3B0aW9ucy5pY29ucy5wYWdpbmF0aW9uU3dpdGNoVXApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMudXJsKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudXJsID0gcGFyYW1zLnVybDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5wYWdlTnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlciA9IHBhcmFtcy5wYWdlTnVtYmVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLnBhZ2VTaXplKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZVNpemUgPSBwYXJhbXMucGFnZVNpemU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U2VydmVyKHBhcmFtcyAmJiBwYXJhbXMuc2lsZW50LFxuICAgICAgICAgICAgcGFyYW1zICYmIHBhcmFtcy5xdWVyeSwgcGFyYW1zICYmIHBhcmFtcy51cmwpO1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3JlZnJlc2gnLCBwYXJhbXMpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUucmVzZXRXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93SGVhZGVyICYmIHRoaXMub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuZml0SGVhZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93Rm9vdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmZpdEZvb3RlcigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5zaG93Q29sdW1uID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29sdW1uKGdldEZpZWxkSW5kZXgodGhpcy5jb2x1bW5zLCBmaWVsZCksIHRydWUsIHRydWUpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuaGlkZUNvbHVtbiA9IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICB0aGlzLnRvZ2dsZUNvbHVtbihnZXRGaWVsZEluZGV4KHRoaXMuY29sdW1ucywgZmllbGQpLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRIaWRkZW5Db2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJC5ncmVwKHRoaXMuY29sdW1ucywgZnVuY3Rpb24gKGNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuICFjb2x1bW4udmlzaWJsZTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRWaXNpYmxlQ29sdW1ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQuZ3JlcCh0aGlzLmNvbHVtbnMsIGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4udmlzaWJsZTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS50b2dnbGVBbGxDb2x1bW5zID0gZnVuY3Rpb24gKHZpc2libGUpIHtcbiAgICAgICAgJC5lYWNoKHRoaXMuY29sdW1ucywgZnVuY3Rpb24gKGksIGNvbHVtbikge1xuICAgICAgICAgICAgdGhpcy5jb2x1bW5zW2ldLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMuaW5pdFBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5pbml0Qm9keSgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKSB7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gdGhpcy4kdG9vbGJhci5maW5kKCcua2VlcC1vcGVuIGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmICgkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA8PSB0aGlzLm9wdGlvbnMubWluaW11bUNvdW50Q29sdW1ucykge1xuICAgICAgICAgICAgICAgICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2hvd0FsbENvbHVtbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQWxsQ29sdW1ucyh0cnVlKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmhpZGVBbGxDb2x1bW5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRvZ2dsZUFsbENvbHVtbnMoZmFsc2UpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuZmlsdGVyQnkgPSBmdW5jdGlvbiAoY29sdW1ucykge1xuICAgICAgICB0aGlzLmZpbHRlckNvbHVtbnMgPSAkLmlzRW1wdHlPYmplY3QoY29sdW1ucykgPyB7fSA6IGNvbHVtbnM7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyID0gMTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuc2Nyb2xsVG8gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09ICdib3R0b20nID8gdGhpcy4kdGFibGVCb2R5WzBdLnNjcm9sbEhlaWdodCA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlQm9keS5zY3JvbGxUb3AodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kdGFibGVCb2R5LnNjcm9sbFRvcCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5nZXRTY3JvbGxQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG8oKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnNlbGVjdFBhZ2UgPSBmdW5jdGlvbiAocGFnZSkge1xuICAgICAgICBpZiAocGFnZSA+IDAgJiYgcGFnZSA8PSB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPSBwYWdlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnByZXZQYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPiAxKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucGFnZU51bWJlci0tO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLm5leHRQYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIgPCB0aGlzLm9wdGlvbnMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIrKztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS50b2dnbGVWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuY2FyZFZpZXcgPSAhdGhpcy5vcHRpb25zLmNhcmRWaWV3O1xuICAgICAgICB0aGlzLmluaXRIZWFkZXIoKTtcbiAgICAgICAgLy8gRml4ZWQgcmVtb3ZlIHRvb2xiYXIgd2hlbiBjbGljayBjYXJkVmlldyBidXR0b24uXG4gICAgICAgIC8vdGhhdC5pbml0VG9vbGJhcigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndG9nZ2xlJywgdGhpcy5vcHRpb25zLmNhcmRWaWV3KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlZnJlc2hPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgLy9JZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCB0aGVuIGF2b2lkIHRoZSBjYWxsIG9mIGRlc3Ryb3kgLyBpbml0IG1ldGhvZHNcbiAgICAgICAgaWYgKGNvbXBhcmVPYmplY3RzKHRoaXMub3B0aW9ucywgb3B0aW9ucywgdHJ1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3JlZnJlc2gtb3B0aW9ucycsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLnJlc2V0U2VhcmNoID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgdmFyICRzZWFyY2ggPSB0aGlzLiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKTtcbiAgICAgICAgJHNlYXJjaC52YWwodGV4dCB8fCAnJyk7XG4gICAgICAgIHRoaXMub25TZWFyY2goe2N1cnJlbnRUYXJnZXQ6ICRzZWFyY2h9KTtcbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmV4cGFuZFJvd18gPSBmdW5jdGlvbiAoZXhwYW5kLCBpbmRleCkge1xuICAgICAgICB2YXIgJHRyID0gdGhpcy4kYm9keS5maW5kKHNwcmludGYoJz4gdHJbZGF0YS1pbmRleD1cIiVzXCJdJywgaW5kZXgpKTtcbiAgICAgICAgaWYgKCR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykgPT09IChleHBhbmQgPyBmYWxzZSA6IHRydWUpKSB7XG4gICAgICAgICAgICAkdHIuZmluZCgnPiB0ZCA+IC5kZXRhaWwtaWNvbicpLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgQm9vdHN0cmFwVGFibGUucHJvdG90eXBlLmV4cGFuZFJvdyA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLmV4cGFuZFJvd18odHJ1ZSwgaW5kZXgpO1xuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY29sbGFwc2VSb3cgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5leHBhbmRSb3dfKGZhbHNlLCBpbmRleCk7XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS5leHBhbmRBbGxSb3dzID0gZnVuY3Rpb24gKGlzU3ViVGFibGUpIHtcbiAgICAgICAgaWYgKGlzU3ViVGFibGUpIHtcbiAgICAgICAgICAgIHZhciAkdHIgPSB0aGlzLiRib2R5LmZpbmQoc3ByaW50ZignPiB0cltkYXRhLWluZGV4PVwiJXNcIl0nLCAwKSksXG4gICAgICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZGV0YWlsSWNvbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgZXhlY3V0ZUludGVydmFsID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgaWRJbnRlcnZhbCA9IC0xO1xuXG4gICAgICAgICAgICBpZiAoISR0ci5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykpIHtcbiAgICAgICAgICAgICAgICAkdHIuZmluZCgnPiB0ZCA+IC5kZXRhaWwtaWNvbicpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhlY3V0ZUludGVydmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoISR0ci5uZXh0KCkubmV4dCgpLmlzKCd0ci5kZXRhaWwtdmlldycpKSB7XG4gICAgICAgICAgICAgICAgJHRyLm5leHQoKS5maW5kKFwiLmRldGFpbC1pY29uXCIpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhlY3V0ZUludGVydmFsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4ZWN1dGVJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWxJY29uID0gdGhhdC4kYm9keS5maW5kKFwidHIuZGV0YWlsLXZpZXdcIikubGFzdCgpLmZpbmQoXCIuZGV0YWlsLWljb25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGV0YWlsSWNvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsSWNvbi5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGlkSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGlkSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0cnMgPSB0aGlzLiRib2R5LmNoaWxkcmVuKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kUm93Xyh0cnVlLCAkKHRyc1tpXSkuZGF0YShcImluZGV4XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBCb290c3RyYXBUYWJsZS5wcm90b3R5cGUuY29sbGFwc2VBbGxSb3dzID0gZnVuY3Rpb24gKGlzU3ViVGFibGUpIHtcbiAgICAgICAgaWYgKGlzU3ViVGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kUm93XyhmYWxzZSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdHJzID0gdGhpcy4kYm9keS5jaGlsZHJlbigpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZFJvd18oZmFsc2UsICQodHJzW2ldKS5kYXRhKFwiaW5kZXhcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEJvb3RzdHJhcFRhYmxlLnByb3RvdHlwZS51cGRhdGVGb3JtYXRUZXh0ID0gZnVuY3Rpb24gKG5hbWUsIHRleHQpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc1tzcHJpbnRmKCdmb3JtYXQlcycsIG5hbWUpXSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1tzcHJpbnRmKCdmb3JtYXQlcycsIG5hbWUpXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNbc3ByaW50ZignZm9ybWF0JXMnLCBuYW1lKV0gPSB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdFRvb2xiYXIoKTtcbiAgICAgICAgdGhpcy5pbml0UGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLmluaXRCb2R5KCk7XG4gICAgfTtcblxuICAgIC8vIEJPT1RTVFJBUCBUQUJMRSBQTFVHSU4gREVGSU5JVElPTlxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICB2YXIgYWxsb3dlZE1ldGhvZHMgPSBbXG4gICAgICAgICdnZXRPcHRpb25zJyxcbiAgICAgICAgJ2dldFNlbGVjdGlvbnMnLCAnZ2V0QWxsU2VsZWN0aW9ucycsICdnZXREYXRhJyxcbiAgICAgICAgJ2xvYWQnLCAnYXBwZW5kJywgJ3ByZXBlbmQnLCAncmVtb3ZlJywgJ3JlbW92ZUFsbCcsXG4gICAgICAgICdpbnNlcnRSb3cnLCAndXBkYXRlUm93JywgJ3VwZGF0ZUNlbGwnLCAndXBkYXRlQnlVbmlxdWVJZCcsICdyZW1vdmVCeVVuaXF1ZUlkJyxcbiAgICAgICAgJ2dldFJvd0J5VW5pcXVlSWQnLCAnc2hvd1JvdycsICdoaWRlUm93JywgJ2dldEhpZGRlblJvd3MnLFxuICAgICAgICAnbWVyZ2VDZWxscycsXG4gICAgICAgICdjaGVja0FsbCcsICd1bmNoZWNrQWxsJywgJ2NoZWNrSW52ZXJ0JyxcbiAgICAgICAgJ2NoZWNrJywgJ3VuY2hlY2snLFxuICAgICAgICAnY2hlY2tCeScsICd1bmNoZWNrQnknLFxuICAgICAgICAncmVmcmVzaCcsXG4gICAgICAgICdyZXNldFZpZXcnLFxuICAgICAgICAncmVzZXRXaWR0aCcsXG4gICAgICAgICdkZXN0cm95JyxcbiAgICAgICAgJ3Nob3dMb2FkaW5nJywgJ2hpZGVMb2FkaW5nJyxcbiAgICAgICAgJ3Nob3dDb2x1bW4nLCAnaGlkZUNvbHVtbicsICdnZXRIaWRkZW5Db2x1bW5zJywgJ2dldFZpc2libGVDb2x1bW5zJyxcbiAgICAgICAgJ3Nob3dBbGxDb2x1bW5zJywgJ2hpZGVBbGxDb2x1bW5zJyxcbiAgICAgICAgJ2ZpbHRlckJ5JyxcbiAgICAgICAgJ3Njcm9sbFRvJyxcbiAgICAgICAgJ2dldFNjcm9sbFBvc2l0aW9uJyxcbiAgICAgICAgJ3NlbGVjdFBhZ2UnLCAncHJldlBhZ2UnLCAnbmV4dFBhZ2UnLFxuICAgICAgICAndG9nZ2xlUGFnaW5hdGlvbicsXG4gICAgICAgICd0b2dnbGVWaWV3JyxcbiAgICAgICAgJ3JlZnJlc2hPcHRpb25zJyxcbiAgICAgICAgJ3Jlc2V0U2VhcmNoJyxcbiAgICAgICAgJ2V4cGFuZFJvdycsICdjb2xsYXBzZVJvdycsICdleHBhbmRBbGxSb3dzJywgJ2NvbGxhcHNlQWxsUm93cycsXG4gICAgICAgICd1cGRhdGVGb3JtYXRUZXh0J1xuICAgIF07XG5cbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnYm9vdHN0cmFwLnRhYmxlJyksXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBCb290c3RyYXBUYWJsZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygb3B0aW9uID09PSAnb2JqZWN0JyAmJiBvcHRpb24pO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KG9wdGlvbiwgYWxsb3dlZE1ldGhvZHMpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1ldGhvZDogXCIgKyBvcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgYXJncyk7XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlRGF0YSgnYm9vdHN0cmFwLnRhYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5kYXRhKCdib290c3RyYXAudGFibGUnLCAoZGF0YSA9IG5ldyBCb290c3RyYXBUYWJsZSh0aGlzLCBvcHRpb25zKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5Db25zdHJ1Y3RvciA9IEJvb3RzdHJhcFRhYmxlO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMgPSBCb290c3RyYXBUYWJsZS5ERUZBVUxUUztcbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLmNvbHVtbkRlZmF1bHRzID0gQm9vdHN0cmFwVGFibGUuQ09MVU1OX0RFRkFVTFRTO1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcyA9IEJvb3RzdHJhcFRhYmxlLkxPQ0FMRVM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS5tZXRob2RzID0gYWxsb3dlZE1ldGhvZHM7XG4gICAgJC5mbi5ib290c3RyYXBUYWJsZS51dGlscyA9IHtcbiAgICAgICAgc3ByaW50Zjogc3ByaW50ZixcbiAgICAgICAgZ2V0RmllbGRJbmRleDogZ2V0RmllbGRJbmRleCxcbiAgICAgICAgY29tcGFyZU9iamVjdHM6IGNvbXBhcmVPYmplY3RzLFxuICAgICAgICBjYWxjdWxhdGVPYmplY3RWYWx1ZTogY2FsY3VsYXRlT2JqZWN0VmFsdWUsXG4gICAgICAgIGdldEl0ZW1GaWVsZDogZ2V0SXRlbUZpZWxkLFxuICAgICAgICBvYmplY3RLZXlzOiBvYmplY3RLZXlzLFxuICAgICAgICBpc0lFQnJvd3NlcjogaXNJRUJyb3dzZXJcbiAgICB9O1xuXG4gICAgLy8gQk9PVFNUUkFQIFRBQkxFIElOSVRcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRhYmxlXCJdJykuYm9vdHN0cmFwVGFibGUoKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAtdGFibGUvZGlzdC9ib290c3RyYXAtdGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=