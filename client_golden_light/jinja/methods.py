import frappe
from frappe import _


def get_items(doctype, docname):
    doc = frappe.get_doc(doctype, docname)

    if not doc.items:
        frappe.throw(_("No items in {}").format(doctype))

    items = {}
    idx = 1
    for row in doc.items:

        if row.description in items:
            items[row.description]["qty"] += row.qty
        else:
            items[row.description] = {
                "idx": idx,
                "item_code": row.item_code,
                "description": row.description,
                "qty": row.qty,
                "uom": row.uom or row.stock_uom,
                "rate": row.rate,
            }
            idx += 1

    return items


def get_int(value):
    return int(value) if value % 1 == 0 else value
