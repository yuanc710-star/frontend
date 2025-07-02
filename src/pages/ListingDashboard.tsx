import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Trophy,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  BookOpen
} from "lucide-react";

const ListingDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const myListings = [
    {
      id: 1,
      category: "housing",
      title: "Modern 2BR Apartment Near Campus",
      status: "active",
      views: 45,
      inquiries: 8,
      postedDate: "2024-03-10",
      price: "$800-900/month"
    },
    {
      id: 2,
      category: "jobs",
      title: "Barista Position - Coffee Shop",
      status: "active",
      views: 23,
      inquiries: 5,
      postedDate: "2024-03-12",
      price: "$13-15/hour"
    },
    {
      id: 3,
      category: "goods",
      title: "Textbooks - Engineering Bundle",
      status: "sold",
      views: 67,
      inquiries: 12,
      postedDate: "2024-03-08",
      price: "$200"
    },
    {
      id: 4,
      category: "tutoring",
      title: "Mathematics & Physics Tutoring",
      status: "active",
      views: 34,
      inquiries: 7,
      postedDate: "2024-03-15",
      price: "$25/hour"
    }
  ];

  const stats = {
    totalListings: myListings.length,
    activeListings: myListings.filter(l => l.status === "active").length,
    totalViews: myListings.reduce((sum, l) => sum + l.views, 0),
    totalInquiries: myListings.reduce((sum, l) => sum + l.inquiries, 0)
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "housing": return Home;
      case "jobs": return Briefcase;
      case "goods": return ShoppingBag;
      case "activities": return Trophy;
      case "tutoring": return BookOpen;
      default: return ShoppingBag;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "sold": return "bg-gray-100 text-gray-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the listing dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/90 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Listing Dashboard</h1>
                <p className="text-gray-600">Manage your listings and track performance</p>
              </div>
            </div>
            <Button onClick={() => navigate("/create-listing")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalListings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Create new listings or manage existing ones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col"
                    onClick={() => navigate("/create-listing?type=tutoring")}
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    Tutoring
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Listings</h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Filter</Button>
                <Button size="sm" variant="outline">Sort</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {myListings.map((listing) => {
                const CategoryIcon = getCategoryIcon(listing.category);
                return (
                  <Card key={listing.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5" />
                          <div>
                            <CardTitle className="text-lg">{listing.title}</CardTitle>
                            <CardDescription className="capitalize">{listing.category} • {listing.price}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {listing.views} views
                          </div>
                          <div>
                            {listing.inquiries} inquiries
                          </div>
                          <div>
                            Posted {listing.postedDate}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Toggle status logic here
                              console.log(`Toggle status for listing ${listing.id}`);
                            }}
                          >
                            {listing.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Duplicate listing logic here
                              console.log(`Duplicate listing ${listing.id}`);
                            }}
                          >
                            Duplicate
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Draft Listings</CardTitle>
                <CardDescription>Listings you've started but haven't published yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Edit className="h-12 w-12 mx-auto mb-4" />
                  <p>No draft listings found</p>
                  <p className="text-sm">Start creating a listing to see drafts here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track how your listings are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics dashboard coming soon!</p>
                    <p className="text-sm">View detailed insights about your listing performance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ListingDashboard;
