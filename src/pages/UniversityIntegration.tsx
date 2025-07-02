
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Users,
  Calendar
} from "lucide-react";

const UniversityIntegration = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const jobOpportunities = [
    {
      id: 1,
      title: "Research Assistant - Computer Science",
      department: "Computer Science",
      type: "Part-time",
      location: "On-campus",
      salary: "$15-20/hour",
      description: "Assist with machine learning research projects and data analysis",
      requirements: ["Junior/Senior standing", "Programming experience", "GPA 3.5+"],
      postedDate: "2 days ago",
      deadline: "March 15, 2024"
    },
    {
      id: 2,
      title: "Campus Tour Guide",
      department: "Admissions",
      type: "Part-time",
      location: "On-campus",
      salary: "$12-15/hour",
      description: "Lead prospective students and families on campus tours",
      requirements: ["Excellent communication skills", "Knowledge of campus", "Flexible schedule"],
      postedDate: "1 week ago",
      deadline: "March 20, 2024"
    },
    {
      id: 3,
      title: "Dining Services Assistant",
      department: "Dining Services",
      type: "Part-time",
      location: "Multiple locations",
      salary: "$12-14/hour",
      description: "Support dining operations including food prep and service",
      requirements: ["Food safety certification", "Customer service skills"],
      postedDate: "3 days ago",
      deadline: "March 18, 2024"
    },
    {
      id: 4,
      title: "Library Student Assistant",
      department: "Library",
      type: "Part-time",
      location: "Main Library",
      salary: "$13-16/hour",
      description: "Help students with research, manage collections, and provide tech support",
      requirements: ["Detail-oriented", "Customer service skills", "Computer literacy"],
      postedDate: "5 days ago",
      deadline: "March 25, 2024"
    }
  ];

  const internshipOpportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Tech Startup Inc.",
      type: "Summer Internship",
      location: "Remote/Hybrid",
      salary: "$20-25/hour",
      description: "Work on full-stack development projects with experienced engineers",
      requirements: ["CS or related major", "JavaScript/React experience", "Portfolio required"],
      postedDate: "1 week ago",
      deadline: "April 1, 2024"
    },
    {
      id: 2,
      title: "Marketing Research Intern",
      company: "Global Marketing Solutions",
      type: "Summer Internship",
      location: "Downtown Office",
      salary: "$18-22/hour",
      description: "Conduct market research and analysis for client campaigns",
      requirements: ["Business/Marketing major", "Excel skills", "Strong analytical skills"],
      postedDate: "4 days ago",
      deadline: "March 30, 2024"
    }
  ];

  const careerEvents = [
    {
      id: 1,
      title: "Spring Career Fair",
      date: "March 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      description: "Meet with 50+ employers from various industries",
      companies: ["Google", "Microsoft", "Tesla", "Goldman Sachs", "McKinsey"]
    },
    {
      id: 2,
      title: "Tech Industry Panel",
      date: "March 28, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Engineering Building",
      description: "Panel discussion with tech industry professionals",
      companies: ["Apple", "Meta", "Netflix", "Spotify"]
    }
  ];

  const filteredJobs = jobOpportunities.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedJobType === "all" || job.type.toLowerCase() === selectedJobType.toLowerCase();
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

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
                <h1 className="text-2xl font-bold">University Integration Hub</h1>
                <p className="text-gray-600">Career opportunities and campus connections</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Campus Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="events">Career Events</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="work-study">Work-Study</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Admissions">Admissions</SelectItem>
                  <SelectItem value="Dining Services">Dining Services</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {job.postedDate}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm">Apply Now</Button>
                      <Button size="sm" variant="outline">Save Job</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="internships" className="space-y-6">
            <div className="space-y-4">
              {internshipOpportunities.map((internship) => (
                <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{internship.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {internship.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {internship.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {internship.salary}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{internship.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{internship.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {internship.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {internship.postedDate}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {internship.deadline}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm">Apply Now</Button>
                      <Button size="sm" variant="outline">Save Position</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {careerEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {event.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Participating Companies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.companies.map((company, index) => (
                            <Badge key={index} variant="outline">{company}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm">Register</Button>
                      <Button size="sm" variant="outline">Add to Calendar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityIntegration;
