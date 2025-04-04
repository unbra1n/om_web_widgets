/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, xml } from "@odoo/owl";
import { _lt } from "@web/core/l10n/translation";
// No explicit DateTime import

class YearsWidget extends Component {
    // Embed the XML template directly
    static template = xml`
        <div class="o_field_widget o_field_date o_field_years_widget" t-att-class="props.className">
            <div class="o_datepicker">
                <div class="o_datepicker_input_container">
                    <div class="o_datepicker_input">
                        <input 
                            type="text" 
                            class="o_input" 
                            t-att-value="formattedValue"
                            readonly="readonly"
                            t-on-click="() => this.openPopover()"/>
                        <span class="o_datepicker_button" title="Open Calendar" t-on-click="() => this.openPopover()"/>
                    </div>
                    <span t-if="props.value and !props.readonly" class="fa fa-times o_datepicker_clear" title="Clear" role="button" t-on-click.stop="() => this.clearValue()"/>
                 </div>
            </div>
            <div class="o_datepicker_popover" t-att-class="{ 'o_hidden': !state.isOpen }">
                <div class="o_datepicker_header">
                    <div class="o_datepicker_buttons">
                        <button class="o_datepicker_button o_datepicker_decade_previous" title="Previous Decade" type="button" t-on-click="() => this.previousDecade()">«</button>
                        <button class="o_datepicker_button o_datepicker_previous" title="Previous Year" type="button" t-on-click="() => this.previousYear()">‹</button>
                        <span class="o_datepicker_title" t-esc="state.currentYear"/>
                        <button class="o_datepicker_button o_datepicker_next" title="Next Year" type="button" t-on-click="() => this.nextYear()">›</button>
                        <button class="o_datepicker_button o_datepicker_decade_next" title="Next Decade" type="button" t-on-click="() => this.nextDecade()">»</button>
                    </div>
                     <button class="btn btn-sm btn-secondary o_datepicker_today" title="Go to Today's Year" t-on-click="() => this.goToToday()">
                        Today
                    </button>
                </div>
                <div class="o_datepicker_content">
                    <div class="o_datepicker_year">
                        <t t-foreach="years" t-as="year" t-key="year">
                            <button type="button" 
                                    class="o_datepicker_button"
                                    t-att-class="{
                                        'o_selected': year === selectedYear,
                                        'o_year_today': year === currentRealYear
                                    }" 
                                    t-on-click="() => this.selectYear(year)">
                                <t t-esc="year"/>
                            </button>
                        </t>
                    </div>
                </div>
            </div>
        </div>
    `;

    static props = {
        ...standardFieldProps,
    };

    setup() {
        let initialYear = new Date().getFullYear();
        if (this.props.value && typeof this.props.value === 'object' && this.props.value.year) {
            const year = this.props.value.year;
            if (!isNaN(year)) {
                 initialYear = year;
            }
        }
        this.state = {
            isOpen: false,
            currentYear: initialYear,
        };
    }

    get currentRealYear() {
        return new Date().getFullYear();
    }

    get years() {
        const current = !isNaN(this.state.currentYear) ? this.state.currentYear : this.currentRealYear;
        return Array.from(
            { length: 61 },
            (_, i) => current - 30 + i
        );
    }

    get selectedYear() {
        if (this.props.value && typeof this.props.value === 'object' && this.props.value.year) {
             const year = this.props.value.year;
             return !isNaN(year) ? year : null;
        }
        return null;
    }

    get formattedValue() {
         return this.selectedYear ? String(this.selectedYear) : '';
    }

    selectYear(year) {
        try {
            const date = luxon.DateTime.local(year, 1, 1);
            this.props.update(date);
        } catch (e) {
            console.error("Error creating/updating date:", e);
        }
        this.state.isOpen = false;
        this.render();
    }

    clearValue() {
        this.props.update(false); // Update field to false
        this.state.isOpen = false; // Close popover if open
        // No need to call render explicitly, props update should trigger it
    }

    goToToday() {
        this.state.currentYear = this.currentRealYear;
        this.render();
    }

    openPopover() {
        if (!this.props.readonly) {
            this.state.isOpen = true;
            this.state.currentYear = this.selectedYear || this.currentRealYear;
            this.render();
        }
    }

    previousYear() {
        this.state.currentYear--;
        this.render();
    }

    nextYear() {
        this.state.currentYear++;
        this.render();
    }

    previousDecade() {
        this.state.currentYear -= 10;
        this.render();
    }

    nextDecade() {
        this.state.currentYear += 10;
        this.render();
    }
}

// Keep static properties and registration AFTER the class definition
YearsWidget.displayName = _lt("Year");
YearsWidget.supportedTypes = ["date"];

registry.category("fields").add("years_widget", YearsWidget); 