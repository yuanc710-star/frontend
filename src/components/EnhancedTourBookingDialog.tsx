
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, DollarSign, Briefcase } from "lucide-react";

interface Guide {
  name: string;
  major: string;
  year: string;
  rating: number;
  avatar: string;
  languages: string[];
  country: string;
  specialties: string[];
}

interface Tour {
  id: number;
  title: string;
  university: string;
  guide: Guide;
  duration: number;
  price: number;
  description: string;
  image: string;
  tags: string[];
  availableSlots: string[];
}

interface EnhancedTourBookingDialogProps {
  tour: Tour;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedTourBookingDialog = ({ tour, open, onOpenChange }: EnhancedTourBookingDialogProps) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [fullCampus, setFullCampus] = useState(false);
  const [activeTab, setActiveTab] = useState("booking");

  const campusSites = [
    "Library", "Student Center", "Engineering Building", "Dormitories", 
    "Athletic Center", "Cafeteria", "Medical Center", "Career Services"
  ];

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

  const handleSiteToggle = (site: string) => {
    setSelectedSites(prev => 
      prev.includes(site) 
        ? prev.filter(s => s !== site)
        : [...prev, site]
    );
  };

  const handleBooking = () => {
    console.log("Booking tour with preferences:", {
      slot: selectedSlot,
      major: selectedMajor,
      language: selectedLanguage,
      country: selectedCountry,
      sites: fullCampus ? "Full Campus" : selectedSites,
      tourId: tour.id
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Campus Tour</DialogTitle>
          <DialogDescription>
            Customize your tour experience for {tour.university}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="booking">Tour Details</TabsTrigger>
            <TabsTrigger value="housing">Housing</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slot">Available Time Slots</Label>
                  <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {tour.availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="major">Preferred Major Focus</Label>
                  <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select major of interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="liberal-arts">Liberal Arts</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Guide Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="mandarin">Mandarin</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="country">Guide's Background</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Guide's country/region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="international">International Student</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Campus Areas to Visit</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="full-campus" 
                        checked={fullCampus}
                        onCheckedChange={(checked) => {
                          setFullCampus(checked as boolean);
                          if (checked) setSelectedSites([]);
                        }}
                      />
                      <Label htmlFor="full-campus" className="font-medium text-blue-600">
                        Full Campus Tour (Recommended)
                      </Label>
                    </div>
                    
                    {!fullCampus && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {campusSites.map((site) => (
                          <div key={site} className="flex items-center space-x-2">
                            <Checkbox 
                              id={site}
                              checked={selectedSites.includes(site)}
                              onCheckedChange={() => handleSiteToggle(site)}
                            />
                            <Label htmlFor={site} className="text-sm">{site}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Card className="bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tour Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-medium">{tour.duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-medium">${tour.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Guide:</span>
                      <span className="font-medium">{tour.guide.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="housing" className="space-y-4">
            <h3 className="text-lg font-semibold">Housing & Accommodation Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {housingOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{option.type}</CardTitle>
                    <Badge variant="secondary">{option.cost}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Food & Dining Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {foodOptions.map((option, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{option.type}</CardTitle>
                        <Badge variant="outline">{option.cost}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{option.description}</p>
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
                        <CardTitle className="text-base">{activity.type}</CardTitle>
                        <Badge variant="outline">{activity.cost}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <h3 className="text-lg font-semibold">Employment & Career Opportunities</h3>
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
                    <p className="text-sm text-gray-600">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">University Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 text-sm">
                  Connect with the university's career services for real-time job postings, 
                  internship opportunities, and campus employment listings.
                </p>
                <Button variant="outline" className="mt-3" size="sm">
                  View Live Job Board
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={!selectedSlot}>
            Book Tour - ${tour.price}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
