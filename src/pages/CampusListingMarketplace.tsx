
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Select from 'react-select';
import { ArrowLeft } from "lucide-react";
import { Country, State, City } from 'country-state-city';

type OptionType = { label: string; value: string };

// Sample university/major data (linked by country/state/city)
const universityData = [
    { countryCode: 'US', stateCode: 'CA', city: 'Stanford', university: 'Stanford University', major: 'Computer Science' },
    { countryCode: 'US', stateCode: 'CA', city: 'Stanford', university: 'Stanford University', major: 'Mechanical Engineering' },
    { countryCode: 'US', stateCode: 'MA', city: 'Cambridge', university: 'MIT', major: 'Physics' },
    { countryCode: 'CA', stateCode: 'ON', city: 'Toronto', university: 'University of Toronto', major: 'Biology' },
];

const CampusListingMarketplace = () => {
    const navigate = useNavigate();

    const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
    const [selectedState, setSelectedState] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);
    const [selectedUniversity, setSelectedUniversity] = useState<OptionType | null>(null);
    const [selectedMajor, setSelectedMajor] = useState<OptionType | null>(null);

    const getCountryOptions = (): OptionType[] => {
        return Country.getAllCountries().map(c => ({
            label: c.name,
            value: c.isoCode,
        }));
    };

    const getStateOptions = (countryCode: string): OptionType[] => {
        return State.getStatesOfCountry(countryCode).map(s => ({
            label: s.name,
            value: s.isoCode,
        }));
    };

    const getCityOptions = (countryCode: string, stateCode: string): OptionType[] => {
        return City.getCitiesOfState(countryCode, stateCode).map(city => ({
            label: city.name,
            value: city.name,
        }));
    };

    const getUniversityOptions = (): OptionType[] => {
        return Array.from(
            new Set(
                universityData
                    .filter(
                        u =>
                            u.countryCode === selectedCountry?.value &&
                            u.stateCode === selectedState?.value &&
                            u.city === selectedCity?.value
                    )
                    .map(u => u.university)
            )
        ).map(name => ({ label: name, value: name }));
    };

    const getMajorOptions = (): OptionType[] => {
        return Array.from(
            new Set(
                universityData
                    .filter(u => u.university === selectedUniversity?.value)
                    .map(u => u.major)
            )
        ).map(name => ({ label: name, value: name }));
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
            <header className="bg-white/90 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Start your campus journey</h1>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <Select
                            placeholder="Select Country"
                            value={selectedCountry}
                            onChange={val => {
                                setSelectedCountry(val);
                                setSelectedState(null);
                                setSelectedCity(null);
                                setSelectedUniversity(null);
                                setSelectedMajor(null);
                            }}
                            options={getCountryOptions()}
                        />

                        <Select
                            placeholder="Select State"
                            value={selectedState}
                            onChange={val => {
                                setSelectedState(val);
                                setSelectedCity(null);
                                setSelectedUniversity(null);
                                setSelectedMajor(null);
                            }}
                            options={selectedCountry ? getStateOptions(selectedCountry.value) : []}
                            isDisabled={!selectedCountry}
                        />

                        <Select
                            placeholder="Select City"
                            value={selectedCity}
                            onChange={val => {
                                setSelectedCity(val);
                                setSelectedUniversity(null);
                                setSelectedMajor(null);
                            }}
                            options={
                                selectedCountry && selectedState
                                    ? getCityOptions(selectedCountry.value, selectedState.value)
                                    : []
                            }
                            isDisabled={!selectedState}
                        />

                        <Select
                            placeholder="Select University"
                            value={selectedUniversity}
                            onChange={val => {
                                setSelectedUniversity(val);
                                setSelectedMajor(null);
                            }}
                            options={getUniversityOptions()}
                            isDisabled={!selectedCity}
                        />

                        <Select
                            placeholder="Select Major"
                            value={selectedMajor}
                            onChange={setSelectedMajor}
                            options={getMajorOptions()}
                            isDisabled={!selectedUniversity}
                        />
                    </div>

                    {/* Listings Grid */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const CategoryIcon = getCategoryIcon(listing.category);
              return (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CategoryIcon className="h-4 w-4" />
                          <Badge className={getCategoryColor(listing.category)}>
                            {listing.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {listing.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-green-600">
                        {listing.price}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {listing.postedDate}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {listing.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {listing.postedBy}
                      </div>
                      {listing.contact.includes("(") && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {listing.contact}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {listing.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div> */}
                </div>
            </div>
        </div>
    );
};

export default CampusListingMarketplace;
