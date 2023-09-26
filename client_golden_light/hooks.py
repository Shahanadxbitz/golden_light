from . import __version__ as app_version

app_name = "client_golden_light"
app_title = "Customizations for Golden Light"
app_publisher = "Peniel Technology LLC"
app_description = "Golden Light"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "developer@penieltech.com"
app_license = "Proprietary"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/client_golden_light/css/client_golden_light.css"
# app_include_js = "/assets/client_golden_light/js/client_golden_light.js"

# include js, css files in header of web template
# web_include_css = "/assets/client_golden_light/css/client_golden_light.css"
# web_include_js = "/assets/client_golden_light/js/client_golden_light.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "client_golden_light/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}


doctype_js = {
    "Quotation": "public/js/client_scripts/forms/quotation.js",
    "Sales Order": "public/js/client_scripts/forms/sales_order.js",
    "Sales Invoice": "public/js/client_scripts/forms/sales_invoice.js",
    "Delivery Note": "public/js/client_scripts/forms/delivery_note.js",
    "Purchase Order": "public/js/client_scripts/forms/purchase_order.js",
    "Purchase Invoice": "public/js/client_scripts/forms/purchase_invoice.js",
    "Purchase Receipt": "public/js/client_scripts/forms/purchase_receipt.js",
    "Landed Cost Voucher": "public/js/client_scripts/forms/landed_cost_voucher.js",
    "Stock Entry": "public/js/client_scripts/forms/stock_entry.js",
    "Stock Reconciliation": "public/js/client_scripts/forms/stock_reconciliation.js",
    "Material Request": "public/js/client_scripts/forms/material_request.js",
    "Journal Entry": "public/js/client_scripts/forms/journal_entry.js",
    "Payment Entry": "public/js/client_scripts/forms/payment_entry.js",
    "Payment Reconciliation": "public/js/client_scripts/forms/payment_reconciliation.js",
}

doctype_list_js = {
    "Item": "public/js/client_scripts/list/item.js",
    "Customer": "public/js/client_scripts/list/customer.js",
    "Supplier": "public/js/client_scripts/list/supplier.js",
    "Payment Entry": "public/js/client_scripts/list/payment_entry.js",
}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

before_install = "client_golden_light.install.before_install"
# after_install = "client_golden_light.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "client_golden_light.uninstall.before_uninstall"
# after_uninstall = "client_golden_light.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "client_golden_light.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"client_golden_light.tasks.all"
# 	],
# 	"daily": [
# 		"client_golden_light.tasks.daily"
# 	],
# 	"hourly": [
# 		"client_golden_light.tasks.hourly"
# 	],
# 	"weekly": [
# 		"client_golden_light.tasks.weekly"
# 	]
# 	"monthly": [
# 		"client_golden_light.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "client_golden_light.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "client_golden_light.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "client_golden_light.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
    {
        "doctype": "{doctype_1}",
        "filter_by": "{filter_by}",
        "redact_fields": ["{field_1}", "{field_2}"],
        "partial": 1,
    },
    {
        "doctype": "{doctype_2}",
        "filter_by": "{filter_by}",
        "partial": 1,
    },
    {
        "doctype": "{doctype_3}",
        "strict": False,
    },
    {"doctype": "{doctype_4}"},
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"client_golden_light.auth.validate"
# ]

# Translation
# --------------------------------

# Make link fields search translated document names for these DocTypes
# Recommended only for DocTypes which have limited documents with untranslated names
# For example: Role, Gender, etc.
# translated_search_doctypes = []


fixtures = [
    {
        "doctype": "Role",
        "filters": {
            "name": ["in", ["Invoice User", "Partner"]],
        },
    },
    {
        "doctype": "Custom DocPerm",
        "filters": {
            "role": ["in", ["Invoice User", "Partner"]],
        },
    },
]

# Jinja Methods
# ---------------
jenv = {
    "methods": [
        "get_items:client_golden_light.jinja.methods.get_items",
        "get_party_details:erpnext.accounts.doctype.payment_entry.payment_entry.get_party_details",
        "get_int:client_golden_light.jinja.methods.get_int",
    ],
}
fixtures = [

	{
		"dt":"Property Setter",
		"filters": [
			[
				"name", "in", [
					'Sales Invoice-language-default'
				]
			]
		]
	}
]

permission_query_conditions = {
	"Stock Entry": "client_golden_light.warehouse_permissions.se_list_permission"
}