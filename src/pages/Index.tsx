import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Video, Users, Clock, MapPin, Star, Home, Briefcase, ShoppingBag, Trophy } from "lucide-react";
import { TourCard } from "@/components/TourCard";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [showAuth, setShowAuth] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const featuredTours = [
    {
      id: 1,
      title: "Complete Stanford Campus Experience",
      university: "Stanford University",
      guide: {
        name: "Sarah Chen",
        major: "Computer Science",
        year: "Junior",
        rating: 4.9,
        avatar: "/placeholder.svg",
        languages: ["English", "Mandarin"],
        country: "USA",
        specialties: ["Engineering", "Research"]
      },
      duration: 90,
      price: 25,
      description: "Comprehensive tour covering academics, student life, and research facilities",
      image: "/placeholder.svg",
      tags: ["Engineering", "Research", "Campus Life"],
      availableSlots: ["Today 2:00 PM", "Today 4:30 PM", "Tomorrow 10:00 AM"]
    },
    {
      id: 2,
      title: "MIT Engineering Focus Tour",
      university: "MIT",
      guide: {
        name: "Alex Rodriguez",
        major: "Mechanical Engineering",
        year: "Senior",
        rating: 4.8,
        avatar: "/placeholder.svg",
        languages: ["English", "Spanish"],
        country: "Mexico",
        specialties: ["Engineering", "Labs"]
      },
      duration: 75,
      price: 30,
      description: "Deep dive into MIT's engineering programs and labs",
      image: "/placeholder.svg",
      tags: ["Engineering", "Labs", "Research"],
      availableSlots: ["Today 3:00 PM", "Tomorrow 9:00 AM", "Tomorrow 2:00 PM"]
    },
    {
      id: 3,
      title: "Harvard Liberal Arts Experience",
      university: "Harvard University",
      guide: {
        name: "Emma Thompson",
        major: "English Literature",
        year: "Sophomore",
        rating: 4.9,
        avatar: "/placeholder.svg",
        languages: ["English", "French"],
        country: "USA",
        specialties: ["Liberal Arts", "History"]
      },
      duration: 60,
      price: 35,
      description: "Explore Harvard's renowned liberal arts programs and historic campus",
      image: "/placeholder.svg",
      tags: ["Liberal Arts", "History", "Academics"],
      availableSlots: ["Today 1:00 PM", "Today 5:00 PM", "Tomorrow 11:00 AM"]
    },
    {
      id: 4,
      title: "UC Berkeley Innovation Tour",
      university: "UC Berkeley",
      guide: {
        name: "Priya Patel",
        major: "Business Administration",
        year: "Junior",
        rating: 4.7,
        avatar: "/placeholder.svg",
        languages: ["English", "Hindi"],
        country: "India",
        specialties: ["Business", "Innovation"]
      },
      duration: 85,
      price: 28,
      description: "Explore Berkeley's entrepreneurship programs and innovation hubs",
      image: "/placeholder.svg",
      tags: ["Business", "Innovation", "Entrepreneurship"],
      availableSlots: ["Today 4:00 PM", "Tomorrow 1:00 PM", "Tomorrow 3:00 PM"]
    }
  ];

  const universities = ["Stanford University", "MIT", "Harvard University", "UC Berkeley", "UCLA"];
  const languages = ["English", "Spanish", "Mandarin", "French", "German", "Hindi"];
  const majors = ["Computer Science", "Engineering", "Business", "Liberal Arts", "Sciences", "Medicine"];

  const filteredTours = featuredTours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.guide.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === "all" || tour.university === selectedUniversity;
    const matchesDuration = selectedDuration === "all" || 
                           (selectedDuration === "short" && tour.duration <= 60) ||
                           (selectedDuration === "medium" && tour.duration > 60 && tour.duration <= 90) ||
                           (selectedDuration === "long" && tour.duration > 90);
    const matchesLanguage = selectedLanguage === "all" || 
                           tour.guide.languages.some(lang => lang.toLowerCase() === selectedLanguage.toLowerCase());
    const matchesMajor = selectedMajor === "all" || 
                        tour.guide.major.toLowerCase().includes(selectedMajor.toLowerCase());
    
    return matchesSearch && matchesUniversity && matchesDuration && matchesLanguage && matchesMajor;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                CampusTours Live
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              )}
              <AuthDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Experience Campus Life Through Live Student-Guided Tours
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with current students for authentic, real-time virtual campus tours. 
            Ask questions, explore housing options, and discover opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => setShowAuth(true)}>
              Start Your Campus Journey
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/listings")}>
              Browse Campus Listings
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Search and Filters */}
      <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search tours, universities, or majors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Majors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  {majors.map((major) => (
                    <SelectItem key={major} value={major}>{major}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Any Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Language</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tour Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Duration</SelectItem>
                  <SelectItem value="short">Short (≤60 min)</SelectItem>
                  <SelectItem value="medium">Medium (60-90 min)</SelectItem>
                  <SelectItem value="long">Long (90+ min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              {filteredTours.length === featuredTours.length ? "Featured Tours" : `Found ${filteredTours.length} Tours`}
            </h3>
            <Badge variant="secondary" className="text-sm">
              {filteredTours.length} available now
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all available tours.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUniversity("all");
                  setSelectedDuration("all");
                  setSelectedLanguage("all");
                  setSelectedMajor("all");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Campus Resources */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Resources & Opportunities</h2>
          <p className="text-lg text-gray-600">Everything you need to know about campus life</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/listings?category=housing")}>
            <CardHeader>
              <Home className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Housing Options</CardTitle>
              <CardDescription>Find apartments, shared housing, and rental options near campus</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/listings?category=jobs")}>
            <CardHeader>
              <Briefcase className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Job Opportunities</CardTitle>
              <CardDescription>Discover campus jobs, internships, and local employment</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/listings?category=goods")}>
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Student Marketplace</CardTitle>
              <CardDescription>Buy, sell, or trade textbooks, furniture, and essentials</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/listings?category=activities")}>
            <CardHeader>
              <Trophy className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Activities & Events</CardTitle>
              <CardDescription>Join clubs, sports, study groups, and campus events</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100">Student Guides</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Tours Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">CampusTours Live</span>
              </div>
              <p className="text-gray-400">
                Connecting prospective students with authentic college experiences through live, guided virtual tours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate("/")} className="hover:text-white">Browse Tours</button></li>
                <li><button onClick={() => navigate("/university-integration")} className="hover:text-white">Campus Jobs</button></li>
                <li><button onClick={() => navigate("/dashboard")} className="hover:text-white">Dashboard</button></li>
                <li>Ask Questions</li>
                <li>Get Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Guides</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Become a Guide</li>
                <li>Earn Money</li>
                <li>Share Experience</li>
                <li>Help Students</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusTours Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
