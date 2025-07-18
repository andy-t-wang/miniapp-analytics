"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

interface WorldMapProps {
  countryData: Map<string, { unique: number; total: number; name: string }>;
  onCountryClick: (countryName: string) => void;
  selectedCountry?: string | null;
}

interface GeoProperties {
  name?: string;
  NAME?: string;
  ISO_A2?: string;
  ISO_A3?: string;
  ADM0_A3?: string;
}

interface GeographyFeature {
  rsmKey: string;
  properties: GeoProperties;
}

// Using 50m resolution for better detail and to ensure all countries are included
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Map country names to ISO codes
const countryNameToISO: Record<string, string> = {
  // A
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  "Antigua and Barbuda": "AG",
  Argentina: "AR",
  Armenia: "AM",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  // B
  Bahamas: "BS",
  "The Bahamas": "BS",
  Bahrain: "BH",
  Bangladesh: "BD",
  Barbados: "BB",
  Belarus: "BY",
  Belgium: "BE",
  Belize: "BZ",
  Benin: "BJ",
  Bhutan: "BT",
  Bolivia: "BO",
  "Bosnia and Herzegovina": "BA",
  Botswana: "BW",
  Brazil: "BR",
  Brunei: "BN",
  Bulgaria: "BG",
  "Burkina Faso": "BF",
  Burundi: "BI",
  Cambodia: "KH",
  Cameroon: "CM",
  Canada: "CA",
  "Cape Verde": "CV",
  "Cabo Verde": "CV",
  "Central African Republic": "CF",
  "Central African Rep.": "CF",
  Chad: "TD",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Comoros: "KM",
  Congo: "CG",
  "Republic of the Congo": "CG",
  "Democratic Republic of the Congo": "CD",
  "Dem. Rep. Congo": "CD",
  DRC: "CD",
  "Costa Rica": "CR",
  Croatia: "HR",
  Cuba: "CU",
  Cyprus: "CY",
  "Czech Republic": "CZ",
  Czechia: "CZ",
  // D
  Denmark: "DK",
  Djibouti: "DJ",
  Dominica: "DM",
  "Dominican Republic": "DO",
  // E
  Ecuador: "EC",
  Egypt: "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eq. Guinea": "GQ",
  Eritrea: "ER",
  Estonia: "EE",
  Eswatini: "SZ",
  Swaziland: "SZ",
  Ethiopia: "ET",
  // F
  Fiji: "FJ",
  Finland: "FI",
  France: "FR",
  // G
  Gabon: "GA",
  Gambia: "GM",
  "The Gambia": "GM",
  Georgia: "GE",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Greenland: "GL",
  Grenada: "GD",
  Guatemala: "GT",
  Guinea: "GN",
  "Guinea-Bissau": "GW",
  "Guinea Bissau": "GW",
  Guyana: "GY",
  // H
  Haiti: "HT",
  Honduras: "HN",
  Hungary: "HU",
  // I
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  "Ivory Coast": "CI",
  "Côte d'Ivoire": "CI",
  // J
  Jamaica: "JM",
  Japan: "JP",
  Jordan: "JO",
  // K
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kiribati: "KI",
  Kosovo: "XK",
  Kuwait: "KW",
  Kyrgyzstan: "KG",
  // L
  Laos: "LA",
  Latvia: "LV",
  Lebanon: "LB",
  Lesotho: "LS",
  Liberia: "LR",
  Libya: "LY",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Luxembourg: "LU",
  // M
  Madagascar: "MG",
  Malawi: "MW",
  Malaysia: "MY",
  Maldives: "MV",
  Mali: "ML",
  Malta: "MT",
  "Marshall Islands": "MH",
  Mauritania: "MR",
  Mauritius: "MU",
  Mexico: "MX",
  Micronesia: "FM",
  Moldova: "MD",
  Monaco: "MC",
  Mongolia: "MN",
  Montenegro: "ME",
  Morocco: "MA",
  Mozambique: "MZ",
  Myanmar: "MM",
  Burma: "MM",
  // N
  Namibia: "NA",
  Nauru: "NR",
  Nepal: "NP",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Nicaragua: "NI",
  Niger: "NE",
  Nigeria: "NG",
  "North Korea": "KP",
  "North Macedonia": "MK",
  Macedonia: "MK",
  Norway: "NO",
  // O
  Oman: "OM",
  // P
  Pakistan: "PK",
  Palau: "PW",
  Palestine: "PS",
  Panama: "PA",
  "Papua New Guinea": "PG",
  Paraguay: "PY",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  // Q
  Qatar: "QA",
  // R
  Romania: "RO",
  Russia: "RU",
  Rwanda: "RW",
  // S
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  Samoa: "WS",
  "San Marino": "SM",
  "Sao Tome and Principe": "ST",
  "São Tomé and Príncipe": "ST",
  "Saudi Arabia": "SA",
  Senegal: "SN",
  Serbia: "RS",
  Seychelles: "SC",
  "Sierra Leone": "SL",
  Singapore: "SG",
  Slovakia: "SK",
  Slovenia: "SI",
  "Solomon Islands": "SB",
  Somalia: "SO",
  Somaliland: "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  "S. Sudan": "SS",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sudan: "SD",
  "Republic of Sudan": "SD",
  Suriname: "SR",
  Sweden: "SE",
  Switzerland: "CH",
  Syria: "SY",
  // T
  Taiwan: "TW",
  Tajikistan: "TJ",
  Tanzania: "TZ",
  Thailand: "TH",
  "Timor-Leste": "TL",
  "East Timor": "TL",
  Togo: "TG",
  Tonga: "TO",
  "Trinidad and Tobago": "TT",
  Tunisia: "TN",
  Turkey: "TR",
  Turkmenistan: "TM",
  Tuvalu: "TV",
  // U
  Uganda: "UG",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "United States of America": "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  // V
  Vanuatu: "VU",
  Vatican: "VA",
  "Vatican City": "VA",
  Venezuela: "VE",
  Vietnam: "VN",
  // Y
  Yemen: "YE",
  // Z
  Zambia: "ZM",
  Zimbabwe: "ZW",
  // Additional territories and regions
  "Western Sahara": "EH",
  "W. Sahara": "EH",
  "French Southern and Antarctic Lands": "TF",
  "Fr. S. Antarctic Lands": "TF",
  "Falkland Islands": "FK",
  "Falkland Is.": "FK",
  "New Caledonia": "NC",
  "French Polynesia": "PF",
  Mayotte: "YT",
  Reunion: "RE",
  Réunion: "RE",
  Guadeloupe: "GP",
  Martinique: "MQ",
  "French Guiana": "GF",
  Curaçao: "CW",
  Aruba: "AW",
  "Sint Maarten": "SX",
  "Caribbean Netherlands": "BQ",
  Bonaire: "BQ",
  "Turks and Caicos Islands": "TC",
  "British Virgin Islands": "VG",
  "US Virgin Islands": "VI",
  "Puerto Rico": "PR",
  Bermuda: "BM",
  "Cayman Islands": "KY",
  "Isle of Man": "IM",
  Jersey: "JE",
  Guernsey: "GG",
  Gibraltar: "GI",
  "Faroe Islands": "FO",
  "Hong Kong": "HK",
  Macao: "MO",
  Macau: "MO",
  "Northern Cyprus": "CY",
  "N. Cyprus": "CY",
  "Cook Islands": "CK",
  Niue: "NU",
  Tokelau: "TK",
  "American Samoa": "AS",
  Guam: "GU",
  "Northern Mariana Islands": "MP",
  "Norfolk Island": "NF",
  "Christmas Island": "CX",
  "Cocos Islands": "CC",
  "Heard Island": "HM",
  Antarctica: "AQ",
};

// The geography only has names, but data uses ISO codes
function getCountryDataKey(geo: GeographyFeature): string {
  const name = geo.properties.name || geo.properties.NAME || "";

  // First try to get ISO code from mapping
  if (countryNameToISO[name]) {
    return countryNameToISO[name];
  }

  // Then try ISO codes from geography properties
  if (geo.properties.ISO_A2) {
    return geo.properties.ISO_A2;
  }

  if (geo.properties.ISO_A3) {
    // Convert ISO3 to ISO2 if needed - for now just return the name
    return name;
  }

  // Fallback to the name itself
  return name;
}

export default function WorldMap({
  countryData,
  onCountryClick,
  selectedCountry,
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(
    null
  );

  return (
    <div className="relative bg-white touch-pan-x touch-pan-y touch-pinch-zoom">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20],
        }}
        width={1000}
        height={400}
        style={{ 
          width: "100%", 
          height: "100%", 
          maxWidth: "100%",
          minHeight: "300px"
        }}
      >
        <ZoomableGroup 
          zoom={1}
          minZoom={0.5}
          maxZoom={8}
          filterZoomEvent={(evt) => {
            // Allow all zoom events including touch gestures
            return true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: GeographyFeature[] }) => {
              const sanctionedCountries = ["CN", "RU"];

              const result = geographies.map((geo: GeographyFeature) => {
                const geoName =
                  geo.properties.name || geo.properties.NAME || "";
                const dataKey = getCountryDataKey(geo);
                const data = countryData.get(dataKey);
                const isSelected = selectedCountry === dataKey;
                const isSanctioned = sanctionedCountries.includes(dataKey);

                // Color based on user activity level or sanctioned status
                let fillColor = "#d1d5db"; // same gray for countries with no data as sanctioned countries
                if (isSanctioned) {
                  fillColor = "#d1d5db"; // gray for sanctioned countries
                } else if (data) {
                  const uniqueUsers = data.unique;
                  if (uniqueUsers > 1000000) {
                    fillColor = "#1e3a8a"; // dark blue for 1M+ users
                  } else if (uniqueUsers > 500000) {
                    fillColor = "#1e40af"; // blue for 500K-1M users
                  } else if (uniqueUsers > 100000) {
                    fillColor = "#2563eb"; // medium blue for 100K-500K users
                  } else if (uniqueUsers > 50000) {
                    fillColor = "#3b82f6"; // light blue for 50K-100K users
                  } else {
                    fillColor = "#dbeafe"; // very light blue for <50K users
                  }
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={isSelected ? "#2563eb" : "#d1d5db"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        fill: isSanctioned
                          ? "#9ca3af"
                          : data
                          ? "#1d4ed8"
                          : "#e5e7eb",
                        outline: "none",
                        cursor: isSanctioned
                          ? "not-allowed"
                          : data
                          ? "pointer"
                          : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      if (data && !isSanctioned) {
                        setHoveredCountry(dataKey);
                        setHoveredCountryName(geoName);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                      setHoveredCountryName(null);
                    }}
                    onClick={() => {
                      if (data && !isSanctioned) {
                        onCountryClick(dataKey);
                      }
                    }}
                  />
                );
              });

              return result;
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hoveredCountry && countryData.get(hoveredCountry) && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white rounded-lg shadow-lg p-2 sm:p-3 pointer-events-none border border-gray-200 max-w-xs">
          <div className="font-medium text-gray-900 text-sm sm:text-base">
            {hoveredCountryName ||
              countryData.get(hoveredCountry)!.name ||
              hoveredCountry}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {countryData.get(hoveredCountry)!.unique.toLocaleString()} unique
            users
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {countryData.get(hoveredCountry)!.total.toLocaleString()} total
            opens
          </div>
        </div>
      )}
    </div>
  );
}
