import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TutoringProfile from "@/components/TutoringProfile";

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "housing";

  const [formData, setFormData] = useState({
    category: initialType,
    type: "",
    title: "",
    description: "",
    price: "",
    location: "",
    contact: "",
    features: [],
    images: []
  });

  const [newFeature, setNewFeature] = useState("");
  const [showTutoringProfile, setShowTutoringProfile] = useState(initialType === "tutoring");

  const categoryTypes = {
    housing: ["Apartment", "Shared Room", "House", "Dorm Room", "Studio"],
    jobs: ["Part-time", "Full-time", "Internship", "Campus Job", "Remote"],
    goods: ["For Sale", "Free", "Trade", "Rental"],
    activities: ["Event", "Recreation", "Study Group", "Club", "Sport"],
    tutoring: ["Individual Tutoring", "Group Tutoring", "Online Tutoring", "Exam Prep", "Assignment Help"]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleTutoringProfileSave = (profile: any) => {
    console.log("Saving tutoring profile:", profile);
    toast({
      title: "Tutoring Profile Created",
      description: "Your tutoring profile has been created successfully!",
    });
    navigate("/listing-dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.price || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log("Creating listing:", formData);
    
    toast({
      title: "Listing Created",
      description: "Your listing has been posted successfully!",
    });

    navigate("/listing-dashboard");
  };

  if (showTutoringProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <header className="bg-white/90 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Tutoring Profile</h1>
                <p className="text-gray-600">Set up your tutoring profile to connect with students</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <TutoringProfile 
            onSave={handleTutoringProfileSave}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to create a listing.</CardDescription>
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/listing-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Listing</h1>
              <p className="text-gray-600">Post your housing, job, good, or activity listing</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Fill in the information for your listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => {
                      handleInputChange("category", value);
                      setShowTutoringProfile(value === "tutoring");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="jobs">Jobs</SelectItem>
                      <SelectItem value="goods">Goods</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="tutoring">Tutoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypes[formData.category as keyof typeof categoryTypes]?.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your listing"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Price and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    placeholder="e.g., $500/month, $15/hour, $200"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Campus Area, Downtown"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label htmlFor="contact">Contact Information *</Label>
                <Input
                  id="contact"
                  placeholder="Phone number or email"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                />
              </div>

              {/* Features */}
              <div>
                <Label>Features/Amenities</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                          {feature}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(feature)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Create Listing
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/listing-dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;
