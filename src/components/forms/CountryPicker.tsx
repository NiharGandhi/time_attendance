import React, { useEffect, useState } from "react";
import Select from 'react-select';

export const CountrySelect = ({ selectedCountry, setSelectedCountry, disabled }: any) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch(
            "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        )
            .then((response) => response.json())
            .then((data) => {
                setCountries(data.countries);
                setSelectedCountry(data.userSelectValue);
            });
    }, []);
    return (
        <Select
            options={countries}
            value={selectedCountry}
            onChange={(selectedOption) => setSelectedCountry(selectedOption)}
            isDisabled={disabled}
        />
    );
};
