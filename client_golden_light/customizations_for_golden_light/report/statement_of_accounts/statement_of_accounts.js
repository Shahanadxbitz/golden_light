// Copyright (c) 2022, Peniel Technology LLC and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Statement of Accounts"] = {
	"filters": [
        {
            label: __("Party Type"),
            fieldname: "party_type",
            fieldtype: "Link",
            options: "DocType",
            get_query() {
                return {
                    filters : { name: ['in', ['Customer', 'Supplier']] },
                }
            },
            reqd: 1,
			on_change() {
				frappe.query_reports["Statement of Accounts"].filters[1].options = this.value;
			}
        },
        {
            label: __("Party"),
            fieldname: "party",
            fieldtype: "Link",
            reqd: 1,
        },
        {
            label: __("From"),
            fieldname: "from_date",
            fieldtype: "Date",
            default: frappe.datetime.add_days(frappe.datetime.get_today(), -30),
            reqd: 1,
        },
        {
            label: __("To"),
            fieldname: "to_date",
            fieldtype: "Date",
            default: frappe.datetime.get_today(),
            reqd: 1,
        },
        {
            label: __("Cost Center"),
            fieldname: "cost_center",
            fieldtype: "Link",
            options: "Cost Center",
        }
	],
    onload(report) {

        // report summary value height
        const style = document.createElement('style');

        document.head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(`
            .report-summary {
                justify-content: center;
            }
            .report-summary .summary-item .summary-value {
                overflow: initial !important;
            }
        `));

    }
};
