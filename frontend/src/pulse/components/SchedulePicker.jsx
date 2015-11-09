import React, { Component, PropTypes } from "react";

import Select from "metabase/components/Select.jsx";

import { capitalize } from "metabase/lib/formatting";

import _ from "underscore";

const HOUR_OPTIONS = _.times(12, (n) => (
    { name: (n === 0 ? 12 : n)+":00", value: n }
));

const AM_PM_OPTIONS = [
    { name: "AM", value: 0 },
    { name: "PM", value: 1 }
];

const DAY_OF_WEEK_OPTIONS = [
    { name: "Sunday", value: "sun" },
    { name: "Monday", value: "mon" },
    { name: "Tuesday", value: "tue" },
    { name: "Wednesday", value: "wed" },
    { name: "Thursday", value: "thu" },
    { name: "Friday", value: "fri" },
    { name: "Saturday", value: "sat" }
];

export default class SchedulePicker extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
        channelSpec: PropTypes.object.isRequired,
        onPropertyChange: PropTypes.func.isRequired
    };

    renderDayPicker(c) {
        return (
            <span className="mt1">
                <span className="h4 text-bold mx1">on</span>
                <Select
                    value={_.find(DAY_OF_WEEK_OPTIONS, (o) => o.value === c.schedule_details.day_of_week)}
                    options={DAY_OF_WEEK_OPTIONS}
                    optionNameFn={o => o.name}
                    optionValueFn={o => o.value}
                    onChange={(o) => this.props.onPropertyChange("schedule_details", { ...c.schedule_details, day_of_week: o }) }
                />
            </span>
        );
    }

    renderHourPicker(c) {
        let hourOfDay = isNaN(c.schedule_details.hour_of_day) ? 8 : c.schedule_details.hour_of_day;
        let hour = hourOfDay % 12;
        let amPm = hourOfDay >= 12 ? 1 : 0;
        return (
            <div className="mt1">
                <span className="h4 text-bold mr1">at</span>
                <Select
                    className="mr1"
                    value={_.find(HOUR_OPTIONS, (o) => o.value === hour)}
                    options={HOUR_OPTIONS}
                    optionNameFn={o => o.name}
                    optionValueFn={o => o.value}
                    onChange={(o) => this.props.onPropertyChange("schedule_details", { ...c.schedule_details, hour_of_day: o + amPm * 12 }) }
                />
                <Select
                    value={_.find(AM_PM_OPTIONS, (o) => o.value === amPm)}
                    options={AM_PM_OPTIONS}
                    optionNameFn={o => o.name}
                    optionValueFn={o => o.value}
                    onChange={(o) => this.props.onPropertyChange("schedule_details", { ...c.schedule_details, hour_of_day: hour + o * 12 }) }
                />
            </div>
        );
    }

    render() {
        let { channel, channelSpec } = this.props;
        return (
            <div className="mt1">
                <span className="h4 text-bold mr1">Sent</span>
                <Select
                    className="h4 text-bold"
                    value={channel.schedule_type}
                    options={channelSpec.schedules}
                    optionNameFn={o => capitalize(o)}
                    optionValueFn={o => o}
                    onChange={(o) => this.props.onPropertyChange("schedule_type", o)}
                />
                { channel.schedule_type === "weekly" &&
                    this.renderDayPicker(channel)
                }
                { (channel.schedule_type === "daily" || channel.schedule_type === "weekly") &&
                    this.renderHourPicker(channel)
                }
            </div>
        );
    }
}
