
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

const LocalBusinesses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const businesses = [
    {
      id: 1,
      name: "Campus Coffee & More",
      category: "Food & Beverage",
      address: "123 College Ave",
      phone: "(555) 123-4567",
      hours: "6:00 AM - 10:00 PM",
      hiring: true,
      positions: ["Barista", "Cashier"],
      pay: "$13-15/hour",
      description: "Popular coffee shop near campus, often hiring students"
    },
    {
      id: 2,
      name: "University Bookstore",
      category: "Retail",
      address: "456 Campus Blvd",
      phone: "(555) 234-5678",
      hours: "8:00 AM - 8:00 PM",
      hiring: true,
      positions: ["Sales Associate", "Stock Clerk"],
      pay: "$12-14/hour",
      description: "Textbooks, supplies, and university merchandise"
    },
    {
      id: 3,
      name: "Pizza Palace",
      category: "Restaurant",
      address: "789 Student St",
      phone: "(555) 345-6789",
      hours: "11:00 AM - 12:00 AM",
      hiring: true,
      positions: ["Delivery Driver", "Cook"],
      pay: "$14-18/hour + tips",
      description: "Late-night pizza delivery, flexible student schedules"
    },
    {
      id: 4,
      name: "Tech Repair Hub",
      category: "Technology",
      address: "321 Innovation Way",
      phone: "(555) 456-7890",
      hours: "10:00 AM - 7:00 PM",
      hiring: false,
      positions: [],
      pay: "",
      description: "Computer and phone repair services"
    },
    {
      id: 5,
      name: "Fitness Plus Gym",
      category: "Health & Fitness",
      address: "654 Wellness Rd",
      phone: "(555) 567-8901",
      hours: "5:00 AM - 11:00 PM",
      hiring: true,
      positions: ["Front Desk", "Personal Trainer"],
      pay: "$13-20/hour",
      description: "Modern gym with student discounts available"
    }
  ];

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold">Local Business Directory</h1>
                <p className="text-gray-600">Find local businesses and employment opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Businesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="relative">
                {business.hiring && (
                  <Badge className="absolute top-4 right-4 bg-green-600">
                    Now Hiring
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline">{business.category}</Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{business.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {business.address}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {business.phone}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {business.hours}
                    </div>
                  </div>

                  {business.hiring && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">Open Positions:</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {business.positions.map((position, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {position}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-green-700">Pay: {business.pay}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalBusinesses;
