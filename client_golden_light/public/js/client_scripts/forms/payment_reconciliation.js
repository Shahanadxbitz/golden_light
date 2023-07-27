frappe.ui.form.on('Payment Reconciliation', {
	refresh(frm) {
		frm.set_query('party_type', function() {
			return {
				filters: [['Name', 'in', ['Customer', 'Supplier', 'Employee']]],
			}
		})
	}
});
