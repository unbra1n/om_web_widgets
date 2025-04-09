/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, xml, useRef, onWillUnmount } from "@odoo/owl";
import { _lt } from "@web/core/l10n/translation";

// Пример с встроенным шаблоном XML в статическое свойство `template`.
class YearsWidget extends Component {
    static template = xml`
        <div t-ref="root" class="o_field_widget o_field_date o_field_years_widget" t-att-class="props.className">
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
                </div>
            </div>
            <div class="o_datepicker_popover" t-att-class="{ 'o_hidden': !state.isOpen }">
                <div class="o_datepicker_header">
                    <div class="o_datepicker_buttons">
                        <button class="o_datepicker_button o_datepicker_range_previous" title="Previous 30 Years" type="button" t-on-click="() => this.previousRange()">
                            <i class="fa fa-chevron-left"/>
                        </button>
                        <span class="o_datepicker_title" t-esc="displayedRange"/>
                        <button class="o_datepicker_button o_datepicker_range_next" title="Next 30 Years" type="button" t-on-click="() => this.nextRange()">
                            <i class="fa fa-chevron-right"/>
                        </button>
                    </div>
                     <button class="btn btn-sm btn-secondary o_datepicker_today" title="Go to Today's Year" t-on-click="() => this.goToToday()">
                        Today
                    </button>
                </div>
                <div class="o_datepicker_content">
                    <div class="o_datepicker_year">
                        <!--
                            Здесь мы добавляем класс .o_year_today, если year === текущий год,
                            и .o_selected, если year === выбранный в поле год
                        -->
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
        this.root = useRef("root");
        this._onClickAway = this._onClickAway.bind(this);

        // Определяем начальный "центральный" год (или из значения поля, или текущий)
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

        onWillUnmount(() => {
            document.removeEventListener("click", this._onClickAway, true);
        });
    }

    _onClickAway(event) {
        if (this.root.el && !this.root.el.contains(event.target)) {
            this.closePopover();
        }
    }

    // Год "сейчас" (по системной дате)
    get currentRealYear() {
        return new Date().getFullYear();
    }

    // Список годов для отображения (например, 30 лет вокруг выбранного)
    get years() {
        const current = !isNaN(this.state.currentYear) ? this.state.currentYear : this.currentRealYear;
        const startYear = current - 14;
        return Array.from({ length: 30 }, (_, i) => startYear + i);
    }

    // Для строки "XXXX - YYYY"
    get displayedRange() {
        const current = !isNaN(this.state.currentYear) ? this.state.currentYear : this.currentRealYear;
        const startYear = current - 14;
        const endYear = startYear + 29;
        return `${startYear} - ${endYear}`;
    }

    // Текущий выбранный год (из значения поля)
    get selectedYear() {
        if (this.props.value && typeof this.props.value === 'object' && this.props.value.year) {
             const year = this.props.value.year;
             return !isNaN(year) ? year : null;
        }
        return null;
    }

    // Форматированное значение в инпуте
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
        this.closePopover();
    }

    goToToday() {
        this.state.currentYear = this.currentRealYear;
        this.render();
    }

    openPopover() {
        if (!this.props.readonly) {
            this.state.isOpen = !this.state.isOpen;
            if (this.state.isOpen) {
                this.state.currentYear = this.selectedYear || this.currentRealYear;
                document.addEventListener("click", this._onClickAway, true);
            } else {
                document.removeEventListener("click", this._onClickAway, true);
            }
            this.render();
        }
    }

    closePopover() {
        if (this.state.isOpen) {
            this.state.isOpen = false;
            document.removeEventListener("click", this._onClickAway, true);
            this.render();
        }
    }

    // Навигация по "блокам" лет (пред/след 30 лет)
    previousRange() {
        this.state.currentYear -= 30;
        this.render();
    }

    nextRange() {
        this.state.currentYear += 30;
        this.render();
    }
}

YearsWidget.displayName = _lt("Year");
YearsWidget.supportedTypes = ["date"];

// Регистрируем виджет
registry.category("fields").add("years_widget", YearsWidget);
