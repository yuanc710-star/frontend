import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Home, 
  Utensils, 
  Trophy, 
  Briefcase, 
  ExternalLink, 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  Clock
} from "lucide-react";

interface UniversityDetailsProps {
  university: string;
}

export const UniversityDetails = ({ university }: UniversityDetailsProps) => {
  const navigate = useNavigate();
  const [tutorProfile, setTutorProfile] = useState({
    subjects: "",
    hourlyRate: "",
    availability: "",
    experience: ""
  });

  const housingOptions = [
    { type: "On-Campus Dorm", cost: "$800-1,200/month", description: "Shared rooms with meal plans" },
    { type: "Off-Campus Apartment", cost: "$600-1,000/month", description: "1-2 bedroom apartments nearby" },
    { type: "Shared Housing", cost: "$400-800/month", description: "Shared houses with other students" }
  ];

  const foodOptions = [
    { type: "Meal Plan", cost: "$300-500/month", description: "Campus dining halls and cafeterias" },
    { type: "Cooking", cost: "$200-400/month", description: "Grocery shopping and self-cooking" },
    { type: "Mixed", cost: "$250-450/month", description: "Combination of meal plan and cooking" }
  ];

  const activities = [
    { type: "Student Organizations", cost: "$20-100/semester", description: "Clubs, societies, and groups" },
    { type: "Sports & Recreation", cost: "$50-200/semester", description: "Gym, intramural sports, facilities" },
    { type: "Entertainment", cost: "$100-300/month", description: "Movies, events, social activities" }
  ];

  const jobOpportunities = [
    { type: "On-Campus Jobs", pay: "$12-18/hour", description: "Library, dining, administrative work" },
    { type: "Research Assistant", pay: "$15-25/hour", description: "Lab work, data analysis, research support" },
    { type: "Tutoring", pay: "$20-35/hour", description: "Peer tutoring and academic support" },
    { type: "Off-Campus Retail", pay: "$12-16/hour", description: "Local stores, restaurants, services" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-900">{university}</h2>
        <p className="text-gray-600">Complete information about campus life and opportunities</p>
      </div>

      <Tabs defaultValue="housing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="housing" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Housing
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center">
            <Utensils className="h-4 w-4 mr-2" />
            Lifestyle
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="housing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {housingOptions.map((option, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    {option.type}
                  </CardTitle>
                  <Badge variant="secondary">{option.cost}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  {option.type !== "On-Campus Dorm" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate("/housing-tours")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Available {option.type.includes("Off-Campus") ? "Apartments" : "Shared Houses"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Housing Tours Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm mb-3">
                Schedule virtual or in-person tours of off-campus housing options and shared facilities.
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/housing-tours")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Housing Tours
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Food & Dining Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {foodOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Utensils className="h-4 w-4 mr-2" />
                      {option.type}
                    </CardTitle>
                    <Badge variant="outline">{option.cost}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    {(option.type === "Cooking" || option.type === "Mixed") && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate("/listings?category=goods&search=grocery")}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Find Local Grocery Stores & Deals
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Activities & Recreation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activities.map((activity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      {activity.type}
                    </CardTitle>
                    <Badge variant="outline">{activity.cost}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        if (activity.type === "Student Organizations") {
                          navigate("/listings?category=activities&search=organization");
                        } else if (activity.type === "Sports & Recreation") {
                          navigate("/listings?category=activities&search=sports");
                        } else {
                          navigate("/listings?category=activities&search=entertainment");
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {activity.type === "Student Organizations" 
                        ? "Browse Student Organizations" 
                        : activity.type === "Sports & Recreation"
                        ? "Find Sports & Recreation"
                        : "Explore Entertainment Options"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobOpportunities.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {job.type}
                  </CardTitle>
                  <Badge variant="secondary">{job.pay}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                  
                  {job.type === "On-Campus Jobs" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate("/university-integration")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View On-Campus Job Board
                    </Button>
                  )}
                  
                  {job.type === "Off-Campus Retail" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate("/listings?category=jobs&search=retail")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse Local Job Listings
                    </Button>
                  )}
                  
                  {job.type === "Tutoring" && (
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mb-3"
                        onClick={() => navigate("/university-integration")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Tutoring Opportunities
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tutoring Profile Creation */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Create Your Tutoring Profile
              </CardTitle>
              <CardDescription className="text-green-700">
                Set up your tutoring profile to connect with students who need help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subjects">Subjects I Can Tutor</Label>
                  <Textarea
                    id="subjects"
                    placeholder="e.g., Mathematics, Physics, Computer Science..."
                    value={tutorProfile.subjects}
                    onChange={(e) => setTutorProfile({...tutorProfile, subjects: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Experience & Qualifications</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your experience and qualifications..."
                    value={tutorProfile.experience}
                    onChange={(e) => setTutorProfile({...tutorProfile, experience: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="25"
                    value={tutorProfile.hourlyRate}
                    onChange={(e) => setTutorProfile({...tutorProfile, hourlyRate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="availability">Availability Schedule</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Mon-Fri 6-8 PM, Weekends flexible"
                    value={tutorProfile.availability}
                    onChange={(e) => setTutorProfile({...tutorProfile, availability: e.target.value})}
                  />
                </div>
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Tutoring Profile
              </Button>
            </CardContent>
          </Card>

          {/* University Integration */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">University Career Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm mb-3">
                Connect with the university's career services for real-time job postings, 
                internship opportunities, and campus employment listings.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/university-integration")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Job Board
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/university-integration")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Internship Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
