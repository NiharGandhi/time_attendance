import React from "react";
import TimezoneSelect from "react-timezone-select";

const TimeZonePicker = ({ selectedTimezone, setSelectedTimezone, disabled }: any) => {
    return (
        <div>
            <div style={{ textAlign: "left" }}>
                <TimezoneSelect
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                    isDisabled={disabled}
                />
            </div>
        </div>
    );
};

export default TimeZonePicker;
