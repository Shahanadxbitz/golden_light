frappe.ui.form.on('Landed Cost Voucher', {
	refresh(frm) {
		frm.set_query("expense_account", "taxes", function(doc, cdt, cdn) {
            return{
            	filters: [
            		['Account', 'account_type', 'in', 'Expenses Included In Valuation'],
            		['Account', 'is_group', '=', 0],
            	]
            }
        });
	}
})
