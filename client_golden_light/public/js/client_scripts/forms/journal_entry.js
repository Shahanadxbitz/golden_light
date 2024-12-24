frappe.ui.form.on('Journal Entry', {
    setup(frm) {
        frm.set_df_property('voucher_type', 'read_only', has_permission_to_edit() ? 0 : 1);
    },
    refresh(frm) {
        frm.set_df_property('voucher_type', 'read_only', has_permission_to_edit() ? 0 : 1);
    }
});

function has_permission_to_edit() {
    return frappe.user.has_role('System Manager') || frappe.user.has_role('Entry Type');
}
