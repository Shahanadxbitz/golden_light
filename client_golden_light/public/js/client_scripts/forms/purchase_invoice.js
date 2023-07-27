frappe.ui.form.on('Purchase Invoice', {
    refresh: filter_items,
    setup: filter_items,
    onload_post_render: filter_items,
    supplier(frm) {
        filter_items(frm);
        if(frm.doc.supplier == "نقدي بيع وشراء") {
            frm.set_value("is_paid", 1);
            frm.set_df_property("supplier", "read_only", 1);
        }
    },
    onload (frm) {

        $("[data-fieldname=tax_id]").hide();

        filter_items(frm);
        setTimeout(() => {

            $(".form-links").hide();
        }, 10);
		$("[data-fieldname=supplied_items]").parent().closest('.form-section').hide();
    },
    validate(frm) {
		frm.set_value({
            supplier_warehouse: '',
            rejected_warehouse: '',
            set_from_warehouse: '',
        });

        for(const item of frm.doc.items) {
            item.from_warehouse = "";
            item.rejected_warehouse = "";
        }

        frm.refresh_field('items');

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
