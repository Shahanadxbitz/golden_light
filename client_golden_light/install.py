import frappe


def before_install():
    frappe.delete_doc("Module Def", "Golden Light", force=1)
    frappe.delete_doc("Module Def", "Golden Light Partner", force=1)
    frappe.delete_doc("Module Def", "Sahel Jeddah", force=1)
