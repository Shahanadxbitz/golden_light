frappe.ui.form.on('Sales Order', {
    refresh: filter_items,
    setup: filter_items,
    customer(frm) {
        filter_items(frm);
        if(frm.doc.customer == "CUST-00004") {
            frm.set_df_property("cash_customer_contact_details", "hidden", 0)
        }
    },
    // onload (frm) {
    //     filter_items(frm);
    //     setTimeout(() => {

    //         $(".form-links").hide();
    //     }, 10);
    // },

    validate(frm) {
        validated = true;
        for (const item of frm.doc.items) {
            if(item.rate == 0) {
                validated = false;
                frappe.msgprint("Rate cannot be zero.");
            }
        }

        frappe.validated = validated;
    },
});



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
