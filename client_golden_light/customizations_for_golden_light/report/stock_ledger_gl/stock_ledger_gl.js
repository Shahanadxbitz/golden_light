// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.query_reports["Stock Ledger GL"] = {
	"filters": [
		{
			"fieldname":"company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"default": frappe.defaults.get_user_default("Company"),
			"reqd": 1
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			"reqd": 1
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1
		},
		{
			"fieldname":"brand",
			"label": __("Brand"),
			"fieldtype": "Link",
			"options": "Brand"
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
			"fieldname":"warehouse",
			"label": __("Warehouse"),
			"fieldtype": "Link",
			"options": "Warehouse",
			"get_query": function() {
				let warehouse_group = frappe.query_report.get_filter_value("warehouse_group");
				const company = frappe.query_report.get_filter_value('company');
				return {
					filters: {
						is_group: 0,
						...warehouse_group && { parent_warehouse: warehouse_group },
						'company': company
					}
				}
			}
		},
		{
			"fieldname":"item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"options": "Item Group"
		},
		{
			"fieldname":"item_category",
			"label": __("Item Category 1"),
			"fieldtype": "Link",
			"options": "Item Category"
		},
		{
			"fieldname":"item_category_2",
			"label": __("Item Category 2"),
			"fieldtype": "Link",
			"options": "Item Category 2"
		},
		{
			"fieldname":"item_code",
			"label": __("Item"),
			"fieldtype": "Link",
			"options": "Item",
			"get_query": function() {
				return {
					query: "erpnext.controllers.queries.item_query"
				}
			}
		},
		{
			"fieldname":"include_uom",
			"label": __("Include UOM"),
			"fieldtype": "Link",
			"options": "UOM"
		},
		{
			"fieldname":"voucher_no",
			"label": __("Voucher #"),
			"fieldtype": "Data"
		},
		{
			"fieldname":"batch_no",
			"label": __("Batch No"),
			"fieldtype": "Link",
			"options": "Batch"
		},
		{
			"fieldname":"project",
			"label": __("Project"),
			"fieldtype": "Link",
			"options": "Project"
		},
	],
	"formatter": function (value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		if (column.fieldname == "out_qty" && data && data.out_qty < 0) {
			value = "<span style='color:red'>" + value + "</span>";
		}
		else if (column.fieldname == "in_qty" && data && data.in_qty > 0) {
			value = "<span style='color:green'>" + value + "</span>";
		}

		return value;
	},
}
