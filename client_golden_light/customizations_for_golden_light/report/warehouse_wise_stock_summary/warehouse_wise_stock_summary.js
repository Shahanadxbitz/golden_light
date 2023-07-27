// Copyright (c) 2022, Peniel Technology LLC and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Warehouse wise Stock Summary"] = {
	"filters": [
		{
			"fieldname": "item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item Group"
		},

		{
			"fieldname": "item_category",
			"label": __("Item Category"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item Category"
		},
		{
			"fieldname": "item_code",
			"label": __("Item"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item"
		},

		{
			"fieldname": "brand",
			"label": __("Brand"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Brand"
		},

		{
			"fieldname": "warehouse",
			"label": __("Warehouse"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Warehouse"
		},
		{
			"fieldname": "filter_total_zero_qty",
			"label": __("Filter Total Zero Qty"),
			"fieldtype": "Check",
			"default": 1
		},
	]
}
