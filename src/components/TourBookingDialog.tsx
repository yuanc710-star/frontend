
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, Star, Video, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "./AuthDialog";

interface Tour {
  id: number;
  title: string;
  university: string;
  guide: {
    name: string;
    major: string;
    year: string;
    rating: number;
    avatar: string;
  };
  duration: number;
  price: number;
  description: string;
  availableSlots: string[];
}

interface TourBookingDialogProps {
  tour: Tour;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TourBookingDialog = ({ tour, open, onOpenChange }: TourBookingDialogProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleBooking = async () => {
    if (!selectedSlot) return;
    
    setIsProcessing(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      // In a real app, this would redirect to payment or confirmation
      alert(`Tour booked for ${selectedSlot}! You'll receive a confirmation email shortly.`);
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Please sign in to book a tour and connect with student guides.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-6">
              <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Join thousands of students who've found their perfect college through live tours.
              </p>
            </div>
            <AuthDialog />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Book Your Live Tour</DialogTitle>
          <DialogDescription>
            Connect with {tour.guide.name} for an authentic campus experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tour Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
            <p className="text-blue-600 font-medium mb-2">{tour.university}</p>
            <p className="text-gray-600 text-sm">{tour.description}</p>
            
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tour.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Video className="h-4 w-4" />
                <span>HD Live Stream</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Interactive Q&A</span>
              </div>
            </div>
          </div>

          {/* Guide Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={tour.guide.avatar} alt={tour.guide.name} />
              <AvatarFallback className="text-lg">
                {tour.guide.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{tour.guide.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tour.guide.rating}</span>
                </div>
              </div>
              <p className="text-gray-600">
                {tour.guide.year} • {tour.guide.major}
              </p>
              <Badge variant="secondary" className="mt-1">Current Student</Badge>
            </div>
          </div>

          <Separator />

          {/* Time Slot Selection */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Select Your Time Slot
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tour.availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="text-left">
                    <div className="font-medium">{slot}</div>
                    <div className="text-sm opacity-80">
                      {index === 0 ? "Next available" : "Available"}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Tour Price</span>
              <span className="font-semibold">${tour.price}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-semibold">$3</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${tour.price + 3}</span>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h4 className="font-semibold mb-3">What's Included</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Video className="h-4 w-4 mr-3 text-green-600" />
                Live HD video tour with current student
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-3 text-green-600" />
                Real-time Q&A and interaction
              </li>
              <li className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-green-600" />
                Tour recording for 30 days
              </li>
              <li className="flex items-center">
                <CreditCard className="h-4 w-4 mr-3 text-green-600" />
                Follow-up resources and contacts
              </li>
            </ul>
          </div>

          {/* Book Button */}
          <Button
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            disabled={!selectedSlot || isProcessing}
            onClick={handleBooking}
          >
            {isProcessing ? (
              "Processing..."
            ) : selectedSlot ? (
              `Book Tour for ${selectedSlot}`
            ) : (
              "Select a Time Slot"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            You can cancel or reschedule up to 2 hours before your tour starts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
