
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Star, Users, Video } from "lucide-react";
import { EnhancedTourBookingDialog } from "./EnhancedTourBookingDialog";

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

interface TourCardProps {
  tour: Tour;
}

export const TourCard = ({ tour }: TourCardProps) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-white/20">
        <div className="relative">
          <img 
            src={tour.image} 
            alt={tour.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-900 font-semibold">
              ${tour.price}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              <Video className="h-3 w-3 mr-1" />
              Live Tour
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                {tour.title}
              </CardTitle>
              <CardDescription className="text-blue-600 font-medium">
                {tour.university}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-2">
            {tour.description}
          </p>

          {/* Guide Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={tour.guide.avatar} alt={tour.guide.name} />
              <AvatarFallback>{tour.guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{tour.guide.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{tour.guide.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {tour.guide.year} • {tour.guide.major}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {tour.guide.languages?.slice(0, 2).map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tour.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Duration and Available Slots */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{tour.availableSlots.length} slots today</span>
            </div>
          </div>

          {/* Next Available */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-medium text-green-800">Next Available:</p>
            <p className="text-sm text-green-700">{tour.availableSlots[0]}</p>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={() => setShowBooking(true)}
          >
            Book Live Tour
          </Button>
        </CardContent>
      </Card>

      <EnhancedTourBookingDialog 
        tour={tour}
        open={showBooking}
        onOpenChange={setShowBooking}
      />
    </>
  );
};
