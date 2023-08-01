frappe.ui.form.on('Payment Entry', {

	party(frm) {
		// show currency conversion rate when non-default currency
		if(frm.doc.paid_to_account_currency != frm.doc.paid_from_account_currency) {
		    frm.set_df_property('paid_amount', 'read_only', 1);
		    if(frm.doc.target_exchange_rate > 0)
		        frm.set_value('received_amount', frm.doc.paid_amount / frm.doc.target_exchange_rate);
		}
	},
    refresh(frm) {
        frm.set_query('party_type', function() {
            return {
                filters: [['Name', 'in', ['Customer', 'Supplier', 'Employee']]]
            }
        })
    },

	mode_of_payment(frm) {

		// show currency conversion rate when non-default currency
		if(frm.doc.paid_to_account_currency != frm.doc.paid_from_account_currency) {
		    frm.set_df_property('paid_amount', 'read_only', 1);
		    if(frm.doc.target_exchange_rate > 0)
		        frm.set_value('received_amount', frm.doc.paid_amount / frm.doc.target_exchange_rate);
		}
	},


	received_amount(frm) {
	    frm.set_value('paid_amount', frm.doc.received_amount * frm.doc.target_exchange_rate);
	},

})
