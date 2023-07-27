frappe.ui.form.on('Journal Entry', {
    setup(frm) {
		frm.set_df_property('voucher_type',  'read_only',  frappe.user.has_role("System Manager") ? 0 : 1);
	},
	refresh(frm) {
		frm.set_df_property('voucher_type',  'read_only',  frappe.user.has_role("System Manager") ? 0 : 1);
	}
})
