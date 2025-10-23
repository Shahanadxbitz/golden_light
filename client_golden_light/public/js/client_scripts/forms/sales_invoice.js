frappe.ui.form.on('Sales Invoice', {
    refresh(frm) {
        filter_items(frm);
        if(!frappe.user.has_role("Accounts Manager")) {
            // frm.get_field('set_warehouse').$input.parents('.form-section').hide();
            // frm.set_df_property("update_stock", "hidden", 1);
        }

        frm.set_df_property("rounding_adjustment", "hidden", 1);
        frm.set_df_property("rounded_total", "hidden", 1);
        frm.set_df_property("total_net_weight", "hidden", 1);
        frm.set_df_property("disable_rounded_total", "hidden", 1);
    },
    setup(frm) {
        filter_items(frm);
    },
    async before_save(frm) {
        await update_customer_balance(frm);
    },
    onload_post_render: filter_items,
    async customer(frm) {
        filter_items(frm);
        if(frm.doc.customer == "نقدي بيع وشراء") {
		    frm.set_value("is_pos", 1);
            frm.set_df_property("cash_customer_contact_details", "hidden", 0);
            frm.set_df_property("customer", "read_only", 1);
		}

		// get customer balance
		// const { message: balance } = await frappe.call("erpnext.accounts.utils.get_balance_on", {
		// 	date: frm.doc.posting_date,
		// 	party_type: "Customer",
		// 	party: frm.doc.customer,
		// });

		// frm.set_value("previous_outstanding", balance || 0);
    },
    // onload (frm) {

    //     $("[data-fieldname=company_trn]").hide();

    //     filter_items(frm);
    //     setTimeout(() => {
    //         $(".form-links").hide();
    //     }, 10);
    // },
    validate(frm) {
        // if (frm.doc.update_stock != 1){
        //     console.log("yes")
        //     frappe.throw(__("Kindly check update stock above items table"))
        // }

        validated = true;
        for (const item of frm.doc.items) {
            if(item.rate == 0) {
                validated = false;
                frappe.msgprint("Rate cannot be zero.");
            }
        }
		// frm.set_value('current_outstanding', frm.doc.outstanding_amount + frm.doc.previous_outstanding);


        frappe.validated = validated;
    },
});
async function update_customer_balance(frm) {
    if (!frm.doc.customer) return;

    const { message: balance } = await frappe.call({
        method: "erpnext.accounts.utils.get_balance_on",
        args: {
            date: frm.doc.posting_date,
            party_type: "Customer",
            party: frm.doc.customer
        }
    });

    const prev = balance || 0;
    frm.set_value("previous_outstanding", prev);
    frm.set_value("current_outstanding", (frm.doc.outstanding_amount || 0) + prev);
}
function filter_items(frm) {
    frm.fields_dict.items.grid.get_field('item_code').get_query = function(doc, cdt, cdn) {

        if(!doc || !cdt || !cdn) {
            return
        }

        const row = locals[cdt][cdn];
        const filters = [
            ['has_variants', '=', 0]
        ];

        if (row.group)
            filters.push(['item_group', '=', row.group]);

        if (row.item_category)
            filters.push(['item_category', '=', row.item_category]);

        return { filters };
    };
}

frappe.ui.form.on('Sales Invoice Item', {
	item_code: get_item_cost,
	warehouse: get_item_cost,
})

async function get_item_cost(frm, cdt, cdn) {

	const row = locals[cdt][cdn];
	const item = row.item_code;
	const warehouse = row.warehouse;

	try {
		const { message: item_cost } = await frappe.call("get-item-cost", { item, warehouse });
		row.item_cost = item_cost;
		frm.refresh_field('items');
	} catch(e) {
		frappe.msgprint("Error fetching item cost" + e.message);
	}

}
