import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [subRegions, setSubRegions] = useState([]);
  const [selectedSubRegion, setSelectedSubRegion] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the data from the REST API
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        // Extract unique regions from the data
        const uniqueRegions = [...new Set(data.map(country => country.region))];
        setRegions(uniqueRegions);
        setData(data);
      });
  }, []);

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setSelectedRegion(selectedRegion);

    // Filter sub-regions based on the selected region
    const filteredSubRegions = [...new Set(data
      .filter(country => country.region === selectedRegion)
      .map(country => country.subregion)
    )];
    setSubRegions(filteredSubRegions);
    setSelectedSubRegion('');
    setCountries([]);
    setSelectedCountry('');
    setCountryDetails(null);
  };

  const handleSubRegionChange = (e) => {
    const selectedSubRegion = e.target.value;
    setSelectedSubRegion(selectedSubRegion);

    // Filter countries based on the selected sub-region
    const filteredCountries = data.filter(country => country.region === selectedRegion && country.subregion === selectedSubRegion)
      .map(country => country.name.common);
    setCountries(filteredCountries);
    setSelectedCountry('');
    setCountryDetails(null);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setSelectedCountry(selectedCountry);

    // Find the selected country object
    const selectedCountryDetails = data.find(country => country.name.common === selectedCountry);
    setCountryDetails(selectedCountryDetails);
  };

  return (
    <div>
      <div>
        <label htmlFor="regionSelect">Region:</label>
        <select id="regionSelect" value={selectedRegion} onChange={handleRegionChange}>
          <option value="">Select Region</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div>
          <label htmlFor="subRegionSelect">Sub Region:</label>
          <select id="subRegionSelect" value={selectedSubRegion} onChange={handleSubRegionChange}>
            <option value="">Select Sub Region</option>
            {subRegions.map(subRegion => (
              <option key={subRegion} value={subRegion}>{subRegion}</option>
            ))}
          </select>
        </div>
      )}

      {selectedSubRegion && (
        <div>
          <label htmlFor="countrySelect">Country:</label>
          <select id="countrySelect" value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      )}
      
      {countryDetails && (
        <div className="table-container">
        <h2>Country Details</h2>
        <table className="country-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Sub Region</th>
              <th>Country Name</th>
              <th>Capital</th>
              <th>Population</th>
              <th>Languages</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedRegion}</td>
              <td>{selectedSubRegion}</td>
              <td>{selectedCountry}</td>
              <td>{countryDetails.capital}</td>
              <td>{countryDetails.population}</td>
              <td>{Object.values(countryDetails.languages).join(' | ')}</td>
            </tr>
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default App;
