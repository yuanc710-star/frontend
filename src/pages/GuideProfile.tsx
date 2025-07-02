
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, Users, GraduationCap, ArrowLeft, Calendar, Video } from "lucide-react";

const GuideProfile = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();

  // Mock guide data
  const guide = {
    id: guideId,
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    university: "Stanford University",
    major: "Computer Science",
    year: "Junior",
    rating: 4.9,
    totalTours: 127,
    joinedDate: "September 2023",
    specializations: ["Engineering", "Research", "Campus Life", "International Students"],
    bio: "Hi! I'm Sarah, a Computer Science junior at Stanford. Originally from Singapore, I understand the challenges international students face when choosing a university. I love showing prospective students the incredible research opportunities, vibrant campus culture, and supportive community that makes Stanford special. My tours focus on giving you an authentic student perspective!",
    achievements: [
      "Top-rated tour guide for 6 months",
      "Computer Science Honor Society",
      "Research Assistant at AI Lab",
      "International Student Mentor"
    ],
    languages: ["English", "Mandarin", "Spanish"],
    upcomingTours: [
      {
        id: 1,
        title: "Stanford Engineering Deep Dive",
        date: "Today, 2:00 PM",
        duration: 90,
        spotsLeft: 3,
        price: 25
      },
      {
        id: 2,
        title: "Complete Campus Experience",
        date: "Tomorrow, 10:00 AM", 
        duration: 75,
        spotsLeft: 5,
        price: 25
      },
      {
        id: 3,
        title: "Research & Labs Tour",
        date: "Tomorrow, 2:30 PM",
        duration: 60,
        spotsLeft: 2,
        price: 30
      }
    ],
    reviews: [
      {
        id: 1,
        reviewer: "Alex M.",
        rating: 5,
        comment: "Sarah was incredible! She showed me exactly what I wanted to see and answered all my questions about the CS program. Really helped me decide that Stanford is my top choice.",
        date: "2 days ago"
      },
      {
        id: 2,
        reviewer: "Maria R.",
        rating: 5,
        comment: "As an international student, Sarah's perspective was invaluable. She understood my concerns and showed me resources I didn't even know existed.",
        date: "1 week ago"
      },
      {
        id: 3,
        reviewer: "David L.",
        rating: 5,
        comment: "Best virtual tour I've taken! Sarah's energy is contagious and she really knows the campus inside and out. Highly recommend!",
        date: "2 weeks ago"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guide Header */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                  <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                    <AvatarImage src={guide.avatar} alt={guide.name} />
                    <AvatarFallback className="text-2xl">
                      {guide.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center sm:text-left mt-4 sm:mt-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
                        <p className="text-lg text-blue-600 font-medium">{guide.university}</p>
                        <p className="text-gray-600">{guide.year} • {guide.major}</p>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex flex-col items-center sm:items-end space-y-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xl font-bold">{guide.rating}</span>
                          <span className="text-gray-600">({guide.totalTours} tours)</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active Guide
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Bio */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>About Sarah</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{guide.bio}</p>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tour Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Achievements & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guide.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.reviews.map((review, index) => (
                  <div key={review.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
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
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tours Completed</span>
                  <span className="font-semibold">{guide.totalTours}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">{guide.rating} ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Guide Since</span>
                  <span className="font-semibold">{guide.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-semibold">{guide.languages.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Languages Spoken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {guide.languages.map((language, index) => (
                    <Badge key={index} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tours */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Tours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.upcomingTours.map((tour, index) => (
                  <div key={tour.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">{tour.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{tour.date}</span>
                        <span className="font-medium">${tour.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{tour.duration}min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{tour.spotsLeft} spots left</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant={tour.spotsLeft <= 2 ? "default" : "outline"}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Book Tour
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Ready to Tour?</CardTitle>
                <CardDescription className="text-blue-100">
                  Book a personalized live tour with Sarah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => navigate("/")}
                >
                  View All Tours
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
