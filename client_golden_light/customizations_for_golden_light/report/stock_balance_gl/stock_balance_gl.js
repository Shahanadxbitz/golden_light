// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors and contributors
// For license information, please see license.txt

frappe.query_reports["Stock Balance GL"] = {
	"filters": [
		{
			"fieldname": "company",
			"label": __("Company"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Company",
			"default": frappe.defaults.get_default("company")
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"width": "80",
			"reqd": 1,
			"default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"width": "80",
			"reqd": 1,
			"default": frappe.datetime.get_today()
		},
		{
			"fieldname": "brand",
			"label": __("Brand"),
			"fieldtype": "Link",
			"options": "Brand",
		},
		{
			"fieldname": "warehouse_group",
			"label": __("Warehouse Group"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Warehouse",
			get_query() {
				return {
					filters: {
						is_group: 1,
						name: ['!=', "All Warehouses - GL"],
					}
				};
			}
		},
		{
			"fieldname": "warehouse",
			"label": __("Warehouse"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Warehouse",
			get_query: () => {
				let warehouse_group = frappe.query_report.get_filter_value("warehouse_group");
				let company = frappe.query_report.get_filter_value("company");

				return {
					filters: {
						is_group: 0,
						...warehouse_group && { parent_warehouse: warehouse_group },
						...company && {company},
					}
				};
			}
		},
		{
			"fieldname": "item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item Group"
		},
        {
            "fieldname": "item_category",
            "label": __("Item Category 1"),
            "fieldtype": "Link",
            "options": "Item Category",
        },
        {
            "fieldname": "item_category_2",
            "label": __("Item Category 2"),
            "fieldtype": "Link",
            "options": "Item Category 2",
        },
		{
			"fieldname": "item_code",
			"label": __("Item"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item",
			"get_query": function() {
				return {
					query: "erpnext.controllers.queries.item_query",
				};
			}
		},
		{
			"fieldname":"include_uom",
			"label": __("Include UOM"),
			"fieldtype": "Link",
			"options": "UOM"
		},
		{
			"fieldname": "show_variant_attributes",
			"label": __("Show Variant Attributes"),
			"fieldtype": "Check"
		},
		{
			"fieldname": 'show_stock_ageing_data',
			"label": __('Show Stock Ageing Data'),
			"fieldtype": 'Check'
		},
	],

	"formatter": function (value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);

		if (column.fieldname == "out_qty" && data && data.out_qty > 0) {
			value = "<span style='color:red'>" + value + "</span>";
		}
		else if (column.fieldname == "in_qty" && data && data.in_qty > 0) {
			value = "<span style='color:green'>" + value + "</span>";
		}

		return value;
	}
};
