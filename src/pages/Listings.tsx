
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, MapPin, Clock, DollarSign, User, Phone, Calendar, Home, Briefcase, ShoppingBag, Users, Trophy } from "lucide-react";

const Listings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const listings = [
    // Housing Listings
    {
      id: 1,
      category: "housing",
      type: "Apartment",
      title: "Modern 2BR Apartment Near Campus",
      description: "Fully furnished apartment with all amenities, walking distance to university",
      price: "$800-900/month",
      location: "University District",
      contact: "(555) 123-4567",
      postedBy: "Campus Living LLC",
      postedDate: "2 days ago",
      features: ["Furnished", "Parking", "Laundry", "Internet Included"]
    },
    {
      id: 2,
      category: "housing", 
      type: "Shared Room",
      title: "Shared Room in Student House",
      description: "Looking for responsible student to share house with 3 others",
      price: "$450/month",
      location: "Downtown",
      contact: "(555) 234-5678",
      postedBy: "Sarah M.",
      postedDate: "1 week ago",
      features: ["Utilities Included", "Kitchen Access", "Study Room", "Bike Storage"]
    },
    // Job Listings
    {
      id: 3,
      category: "jobs",
      type: "Part-time",
      title: "Barista Position - Coffee Shop",
      description: "Flexible hours, perfect for students. Experience preferred but will train.",
      price: "$13-15/hour",
      location: "Campus Area",
      contact: "(555) 345-6789",
      postedBy: "Campus Coffee Co.",
      postedDate: "3 days ago",
      features: ["Flexible Hours", "Employee Discounts", "Tips", "Training Provided"]
    },
    {
      id: 4,
      category: "jobs",
      type: "Campus Job",
      title: "Library Assistant",
      description: "Help students with research and manage library resources",
      price: "$12-14/hour",
      location: "Main Library",
      contact: "Apply through student portal",
      postedBy: "University Library",
      postedDate: "1 day ago",
      features: ["On-Campus", "Study Time", "Academic Environment", "Resume Builder"]
    },
    // Goods for Sale
    {
      id: 5,
      category: "goods",
      type: "For Sale",
      title: "Textbooks - Engineering Bundle",
      description: "Complete set of engineering textbooks, excellent condition",
      price: "$200 (originally $800)",
      location: "Campus Pickup",
      contact: "(555) 456-7890",
      postedBy: "Mike K.",
      postedDate: "5 days ago",
      features: ["Like New", "No Highlighting", "All Editions Current", "Bundle Deal"]
    },
    {
      id: 6,
      category: "goods",
      type: "Free",
      title: "Free Furniture - Moving Sale",
      description: "Desk, chair, and bookshelf. Must pick up by weekend.",
      price: "Free",
      location: "Off-Campus Housing",
      contact: "(555) 567-8901",
      postedBy: "Jessica L.",
      postedDate: "1 day ago",
      features: ["Free", "Good Condition", "Must Pick Up", "This Weekend Only"]
    },
    // Activities & Events
    {
      id: 7,
      category: "activities",
      type: "Recreation",
      title: "Gym Membership Transfer",
      description: "6-month gym membership, 3 months remaining at discounted rate",
      price: "$150 (originally $300)",
      location: "Fitness Plus Gym",
      contact: "(555) 678-9012",
      postedBy: "Alex R.",
      postedDate: "4 days ago",
      features: ["3 Months Left", "All Access", "Transfer Fee Paid", "Great Deal"]
    },
    {
      id: 8,
      category: "activities",
      type: "Event",
      title: "Study Group - Organic Chemistry",
      description: "Weekly study sessions for Organic Chemistry, all welcome",
      price: "Free",
      location: "Student Center",
      contact: "studygroup@email.com",
      postedBy: "Chemistry Student Union",
      postedDate: "2 days ago",
      features: ["Weekly Meetings", "All Levels", "Free", "Peer Support"]
    }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || listing.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "housing": return Home;
      case "jobs": return Briefcase;
      case "goods": return ShoppingBag;
      case "activities": return Trophy;
      default: return Users;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "housing": return "bg-blue-100 text-blue-800";
      case "jobs": return "bg-green-100 text-green-800";
      case "goods": return "bg-purple-100 text-purple-800";
      case "activities": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
                <h1 className="text-2xl font-bold">Campus Listings</h1>
                <p className="text-gray-600">Housing, jobs, goods, and activities near campus</p>
              </div>
            </div>
            <Button onClick={() => navigate("/listing-dashboard")}>
              Post a Listing
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="goods">Goods</SelectItem>
                <SelectItem value="activities">Activities</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Campus">On Campus</SelectItem>
                <SelectItem value="University">University District</SelectItem>
                <SelectItem value="Downtown">Downtown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
