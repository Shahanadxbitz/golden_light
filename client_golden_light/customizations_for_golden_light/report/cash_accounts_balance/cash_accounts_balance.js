// Copyright (c) 2022, Peniel Technology LLC and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Cash Accounts Balance"] = {
	"filters": [

		{
			"fieldname": "company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"reqd": 1,
			"default": frappe.defaults.get_user_default("Company")
		},

		{
			"fieldname": "account",
			"label": __("Account"),
			"fieldtype": "Link",
			"options": "Account",
			"reqd": 1,
			"default": '1100-1300 - Cash and Cash Equivalents - GL'
		},
		{
			"fieldname": "from_date",
			"fieldtype": "Date",
			"default": frappe.datetime.year_start(),
			"hidden": 1,
		},
		{
			"fieldname": "to_date",
			"label": __("Balance Date"),
			"fieldtype": "Date",
			"reqd": 1,
			"default": frappe.datetime.get_today(),
		},
		{
			fieldname: "include_suppliers",
			label: __("Include Suppliers"),
			fieldtype: "MultiSelectList",
			get_data(data) {
				return frappe.db.get_link_options("Supplier", data);
			},
		}
	],
	onload(report) {
		report.set_filter_value("include_suppliers", ["مكتب رمضاني للصرافة", "شركة الصراف للصرافة"]);
	},
	formatter: function(value, row, column, data, default_formatter) {
		if (data && column.fieldname=="account") {
			column.link_onclick = "open_general_ledger(" + JSON.stringify(data) + ")";
		}

		value = default_formatter(value, row, column, data);
		return value;
	},
};


function open_general_ledger(data) {
	if (!data.account) return;

	if(data["party_type"]) {
		frappe.route_options = {
			party_type: data["party_type"],
			party: data.account,
			from_date: frappe.datetime.year_start(),
			to_date: frappe.query_report.get_filter_value("to_date"),
		};
	} else {
		frappe.route_options = {
			account: data.account,
			from_date: frappe.datetime.year_start(),
			to_date: frappe.query_report.get_filter_value("to_date"),
		};
	}
	frappe.set_route("query-report", "General Ledger");
}
