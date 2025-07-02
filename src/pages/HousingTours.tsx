
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, MapPin, DollarSign, Users, Home } from "lucide-react";

const HousingTours = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const housingOptions = [
    {
      id: 1,
      name: "University Gardens Apartments",
      type: "off-campus",
      rent: "$700-900/month",
      distance: "0.5 miles from campus",
      amenities: ["Pool", "Gym", "Parking", "Laundry"],
      bedrooms: "1-2 BR",
      image: "/placeholder.svg",
      available: "Immediate",
      tourSlots: ["Today 2:00 PM", "Tomorrow 10:00 AM", "Tomorrow 3:00 PM"]
    },
    {
      id: 2,
      name: "Student Co-op House",
      type: "shared",
      rent: "$450-650/month",
      distance: "0.3 miles from campus",
      amenities: ["Kitchen", "Common Area", "Bike Storage", "Study Room"],
      bedrooms: "Shared rooms",
      image: "/placeholder.svg",
      available: "Fall 2024",
      tourSlots: ["Today 4:00 PM", "Tomorrow 11:00 AM"]
    },
    {
      id: 3,
      name: "Campus View Condos",
      type: "off-campus",
      rent: "$800-1200/month",
      distance: "0.7 miles from campus",
      amenities: ["Balcony", "AC", "Parking", "Pet-friendly"],
      bedrooms: "1-3 BR",
      image: "/placeholder.svg",
      available: "Spring 2024",
      tourSlots: ["Tomorrow 9:00 AM", "Tomorrow 2:00 PM"]
    }
  ];

  const filteredHousing = selectedType === "all" 
    ? housingOptions 
    : housingOptions.filter(option => option.type === selectedType);

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
                <h1 className="text-2xl font-bold">Housing Tours</h1>
                <p className="text-gray-600">Schedule tours of off-campus housing options</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button 
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
            >
              All Housing
            </Button>
            <Button 
              variant={selectedType === "off-campus" ? "default" : "outline"}
              onClick={() => setSelectedType("off-campus")}
            >
              Off-Campus Apartments
            </Button>
            <Button 
              variant={selectedType === "shared" ? "default" : "outline"}
              onClick={() => setSelectedType("shared")}
            >
              Shared Housing
            </Button>
          </div>

          {/* Housing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHousing.map((housing) => (
              <Card key={housing.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={housing.image} 
                    alt={housing.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900">
                    {housing.rent}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{housing.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {housing.distance}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{housing.bedrooms}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available:</span>
                    <Badge variant="outline">{housing.available}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {housing.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Tour Times:</p>
                    <div className="space-y-1">
                      {housing.tourSlots.map((slot, index) => (
                        <Button key={index} variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Schedule Virtual Tour
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingTours;
