import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  Video, 
  Users, 
  TrendingUp,
  BookOpen,
  Award,
  MessageSquare,
  Plus,
  Home,
  Utensils,
  Briefcase,
  ShoppingBag,
  Trophy
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TourCard } from "@/components/TourCard";
import { UniversityDetails } from "@/components/UniversityDetails";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const userType = user?.userType || "prospective";

  // Mock data for available tours
  const availableTours = [
    {
      id: 1,
      title: "Stanford Engineering Deep Dive",
      university: "Stanford University",
      guide: {
        name: "Sarah Chen",
        major: "Computer Science",
        year: "Junior",
        rating: 4.9,
        avatar: "/placeholder.svg",
        languages: ["English", "Mandarin"],
        country: "USA",
        specialties: ["Engineering", "Tech Industry"]
      },
      duration: 90,
      price: 35,
      description: "Comprehensive tour of Stanford's engineering facilities including labs and innovation spaces.",
      image: "/placeholder.svg",
      tags: ["Engineering", "Innovation", "Research"],
      availableSlots: ["Today, 2:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 3:00 PM"]
    },
    {
      id: 2,
      title: "MIT Campus Experience",
      university: "MIT",
      guide: {
        name: "Alex Rodriguez",
        major: "Electrical Engineering",
        year: "Senior",
        rating: 4.8,
        avatar: "/placeholder.svg",
        languages: ["English", "Spanish"],
        country: "USA",
        specialties: ["Engineering", "Research"]
      },
      duration: 75,
      price: 30,
      description: "Full MIT campus tour focusing on academic buildings and student life.",
      image: "/placeholder.svg",
      tags: ["Engineering", "Academic", "Student Life"],
      availableSlots: ["Today, 4:00 PM", "Tomorrow, 11:00 AM"]
    }
  ];

  const universities = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "UC Berkeley",
    "Yale University",
    "Princeton University"
  ];

  const dashboardData = {
    prospective: {
      upcomingTours: [
        {
          id: 1,
          title: "Stanford Engineering Deep Dive",
          university: "Stanford University",
          guide: "Sarah Chen",
          date: "Today, 2:00 PM",
          status: "confirmed"
        },
        {
          id: 2,
          title: "MIT Campus Experience",
          university: "MIT",
          guide: "Alex Rodriguez",
          date: "Tomorrow, 10:00 AM",
          status: "pending"
        }
      ],
      pastTours: [
        {
          id: 3,
          title: "Harvard Liberal Arts Tour",
          university: "Harvard University",
          guide: "Emma Thompson",
          date: "Last week",
          rating: 5,
          hasRecording: true
        }
      ],
      savedTours: [
        {
          id: 4,
          title: "UC Berkeley Engineering",
          university: "UC Berkeley",
          guide: "Michael Kim",
          price: 25
        }
      ]
    },
    current: {
      stats: {
        totalTours: 47,
        rating: 4.8,
        earnings: 1175,
        thisMonth: 12
      },
      upcomingTours: [
        {
          id: 1,
          title: "Computer Science Focus Tour",
          participants: 3,
          date: "Today, 3:00 PM",
          duration: 90
        },
        {
          id: 2,
          title: "Complete Campus Experience",
          participants: 5,
          date: "Tomorrow, 11:00 AM",
          duration: 75
        }
      ],
      recentReviews: [
        {
          reviewer: "John D.",
          rating: 5,
          comment: "Amazing tour! Really helpful insights.",
          date: "2 days ago"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {userType === "current" ? "Student Guide" : "Prospective Student"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {userType === "prospective" ? (
          <ProspectiveDashboard 
            data={dashboardData.prospective} 
            availableTours={availableTours}
            universities={universities}
            selectedUniversity={selectedUniversity}
            setSelectedUniversity={setSelectedUniversity}
          />
        ) : (
          <GuideDashboard data={dashboardData.current} />
        )}
      </div>
    </div>
  );
};

const ProspectiveDashboard = ({ 
  data, 
  availableTours, 
  universities, 
  selectedUniversity, 
  setSelectedUniversity 
}: { 
  data: any;
  availableTours: any[];
  universities: string[];
  selectedUniversity: string;
  setSelectedUniversity: (university: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="tours" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="tours">My Tours</TabsTrigger>
        <TabsTrigger value="book">Book Tours</TabsTrigger>
        <TabsTrigger value="university">University Info</TabsTrigger>
        <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
        <TabsTrigger value="saved">Saved Tours</TabsTrigger>
        <TabsTrigger value="history">Tour History</TabsTrigger>
      </TabsList>

      <TabsContent value="tours" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Tours This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {data.upcomingTours.length + data.pastTours.length}
              </div>
              <p className="text-sm text-gray-600">Exploring your future</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Universities Visited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {new Set([...data.upcomingTours, ...data.pastTours].map(t => t.university)).size}
              </div>
              <p className="text-sm text-gray-600">Different institutions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Next Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-orange-600">
                {data.upcomingTours[0]?.date || "No tours scheduled"}
              </div>
              <p className="text-sm text-gray-600">{data.upcomingTours[0]?.university || ""}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.upcomingTours.length > 0 ? (
              <div className="space-y-4">
                {data.upcomingTours.map((tour: any) => (
                  <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{tour.title}</h3>
                      <p className="text-blue-600">{tour.university}</p>
                      <p className="text-sm text-gray-600">Guide: {tour.guide} • {tour.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={tour.status === "confirmed" ? "secondary" : "outline"}>
                        {tour.status}
                      </Badge>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Tour
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming tours</h3>
                <p className="text-gray-600 mb-4">Browse available tours to start exploring colleges!</p>
                <Button>Browse Tours</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="book" className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Book New Tours
            </CardTitle>
            <CardDescription>Discover and book live campus tours with current students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="university" className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>University Information</CardTitle>
            <CardDescription>Explore housing, lifestyle, and opportunities at different universities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select University</label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a university to explore" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university} value={university}>
                        {university}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUniversity && (
                <UniversityDetails university={selectedUniversity} />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tutoring" className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Tutoring & Listings
            </CardTitle>
            <CardDescription>Manage your tutoring profile and view all your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-dashed border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create Tutoring Profile</h3>
                  <p className="text-gray-600 mb-4">Share your expertise and start tutoring other students</p>
                  <Button onClick={() => navigate("/create-listing?type=tutoring")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 border-green-200 hover:border-green-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Manage All Listings</h3>
                  <p className="text-gray-600 mb-4">View, edit, and manage all your listings in one place</p>
                  <Button onClick={() => navigate("/listing-dashboard")} variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => navigate("/create-listing?type=housing")}
                >
                  <Home className="h-6 w-6 mb-2" />
                  Housing
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => navigate("/create-listing?type=jobs")}
                >
                  <Briefcase className="h-6 w-6 mb-2" />
                  Jobs
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => navigate("/create-listing?type=goods")}
                >
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  Goods
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => navigate("/create-listing?type=activities")}
                >
                  <Trophy className="h-6 w-6 mb-2" />
                  Activities
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved" className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Saved Tours</CardTitle>
            <CardDescription>Tours you've bookmarked for later</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.savedTours.map((tour: any) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{tour.title}</h3>
                    <p className="text-blue-600">{tour.university}</p>
                    <p className="text-sm text-gray-600">Guide: {tour.guide} • ${tour.price}</p>
                  </div>
                  <Button size="sm">Book Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tour History</CardTitle>
            <CardDescription>Your completed campus tours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.pastTours.map((tour: any) => (
                <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{tour.title}</h3>
                    <p className="text-blue-600">{tour.university}</p>
                    <p className="text-sm text-gray-600">Guide: {tour.guide} • {tour.date}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < tour.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {tour.hasRecording && (
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Replay
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

const GuideDashboard = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalTours}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {data.stats.rating}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
            </div>
            <p className="text-xs text-gray-600">Excellent feedback</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.stats.earnings}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.stats.thisMonth}</div>
            <p className="text-xs text-gray-600">Tours completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingTours.map((tour: any) => (
                <div key={tour.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{tour.title}</h3>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {tour.participants}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tour.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{tour.duration} minutes</span>
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Start Tour
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentReviews.map((review: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.reviewer}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Tour
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              <Award className="h-4 w-4 mr-2" />
              Guide Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
