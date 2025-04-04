# Common Web Widgets (OM) Module

This Odoo module provides common web widgets for reuse across different modules.

## Widgets Included

*   **Years Widget (`years_widget`)**: A field widget for selecting a year, intended for use with `Date` fields where only the year is relevant.

## How to Use

1.  **Add Dependency:** In the `__manifest__.py` file of the module where you want to use a widget from this library, add `'om_web_widgets'` to the `depends` list.

    ```python
    'depends': ['base', 'web', 'om_web_widgets'],
    ```

2.  **Use in XML Views:** In your XML view definition (form, list, etc.), specify the widget attribute on the field tag.

    *   **For the Years Widget:** Use `widget="years_widget"` on a `Date` field.

        ```xml
        <field name="your_date_field" widget="years_widget"/>
        ```

3.  **Install/Update Modules:**
    *   Make sure the `om_web_widgets` module is installed in your Odoo instance.
    *   Update the module where you added the dependency and used the widget.

## Example (Years Widget)

If you have a model with a date field like `foundation_date` and you only care about the year:

**Python Model (`your_module/models/your_model.py`):**
```python
from odoo import models, fields

class YourModel(models.Model):
    _name = 'your.model'
    _description = 'Your Model'

    name = fields.Char('Name')
    foundation_date = fields.Date('Foundation Date')
```

**XML View (`your_module/views/your_model_view.xml`):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <record id="your_model_form_view" model="ir.ui.view">
        <field name="name">your.model.form</field>
        <field name="model">your.model</field>
        <field name="arch" type="xml">
            <form>
                <sheet>
                    <group>
                        <field name="name"/>
                        <field name="foundation_date" widget="years_widget"/>
                    </group>
                </sheet>
            </form>
        </field>
    </record>
</odoo>
```

**Manifest (`your_module/__manifest__.py`):**
```python
{
    # ... other manifest data
    'depends': ['base', 'web', 'om_web_widgets'],
    'data': [
        'views/your_model_view.xml',
        # ... other data files
    ],
    # ...
}
```

## Notes

*   The Years Widget currently stores the date as `YYYY-01-01` in the database.
*   The XML template for the Years Widget is currently embedded within its JavaScript file (`static/src/js/years_widget.js`) due to loading issues with external templates in the development environment. 