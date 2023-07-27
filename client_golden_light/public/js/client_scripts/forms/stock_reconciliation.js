frappe.ui.form.on('Stock Reconciliation', {
	refresh(frm) {
		if(frm.is_new()) {
		    frm.set_value('purpose', 'Stock Reconciliation');
		}

		if(!frappe.user.has_role('System Manager')) {
		    frm.set_df_property('purpose', 'read_only', 1);
		}

	}
});
