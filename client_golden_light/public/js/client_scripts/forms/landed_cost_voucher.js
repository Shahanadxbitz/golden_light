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


frappe.ui.form.on('Landed Cost Purchase Receipt', {
	receipt_document(frm,cdt,cdn) {
		const document = locals[cdt][cdn]
		if (document.receipt_document_type == "Purchase Receipt"){
			console.log("ppp")
			frappe.db.get_value("Purchase Receipt",{'name':document.receipt_document}, ["supplier_delivery_note"], (r) => {
				frappe.model.set_value(cdt,cdn,"delivery_note",r.supplier_delivery_note)
			})
		}
	}
})
