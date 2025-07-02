
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Users, 
  MessageSquare, 
  Send,
  Hand,
  ThumbsUp,
  Share,
  Settings,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LiveTour = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState(3);

  // Mock tour data - in real app this would come from API
  const tourData = {
    id: tourId,
    title: "Complete Stanford Campus Experience",
    university: "Stanford University",
    guide: {
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      avatar: "/placeholder.svg"
    },
    participants: [
      { name: "John Doe", type: "prospective", avatar: "/placeholder.svg" },
      { name: "Mary Johnson", type: "parent", avatar: "/placeholder.svg" },
      { name: "Alex Smith", type: "prospective", avatar: "/placeholder.svg" }
    ],
    startTime: new Date(),
    duration: 90
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Chen",
      message: "Welcome everyone! I'm excited to show you around Stanford today.",
      timestamp: new Date(Date.now() - 60000),
      type: "guide"
    },
    {
      id: 2,
      sender: "John Doe",
      message: "Thanks Sarah! Really looking forward to seeing the engineering buildings.",
      timestamp: new Date(Date.now() - 45000),
      type: "participant"
    },
    {
      id: 3,
      sender: "System",
      message: "Real-time transcription is now active",
      timestamp: new Date(Date.now() - 30000),
      type: "system"
    }
  ]);

  const [currentTranscript, setCurrentTranscript] = useState(
    "Sarah: We're now approaching the Main Quad, which is really the heart of Stanford's campus. You can see the iconic sandstone architecture that defines our university's look..."
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Simulate live transcript updates
    const interval = setInterval(() => {
      const updates = [
        "Sarah: This building on your left is the Gates Computer Science Building...",
        "Sarah: Many of our famous alumni like the Google founders studied here...",
        "Sarah: We have over 18 libraries on campus, and this is Green Library...",
        "Sarah: The weather here is fantastic year-round, perfect for outdoor studying..."
      ];
      
      setCurrentTranscript(updates[Math.floor(Math.random() * updates.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      sender: "You",
      message: newMessage,
      timestamp: new Date(),
      type: "participant" as const
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-bold">{tourData.title}</h1>
              <p className="text-sm text-gray-300">{tourData.university}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-600 text-white">
              LIVE
            </Badge>
            <div className="flex items-center space-x-1 text-sm">
              <Users className="h-4 w-4" />
              <span>{participants}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Video Feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="h-24 w-24 mx-auto mb-4 text-white/50" />
                <p className="text-lg text-white/80">Live Campus Tour Stream</p>
                <p className="text-sm text-white/60">HD video feed from Sarah's camera</p>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${isAudioOn ? "text-white hover:bg-white/20" : "bg-red-600 text-white"}`}
                onClick={() => setIsAudioOn(!isAudioOn)}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${isVideoOn ? "text-white hover:bg-white/20" : "bg-red-600 text-white"}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${isHandRaised ? "bg-yellow-600 text-white" : "text-white hover:bg-white/20"}`}
                onClick={() => setIsHandRaised(!isHandRaised)}
              >
                <Hand className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white hover:bg-white/20"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white hover:bg-white/20"
              >
                <Share className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="rounded-full"
                onClick={() => navigate("/")}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Live Transcription */}
          <div className="absolute bottom-20 left-4 right-4">
            <Card className="bg-black/70 backdrop-blur-md border-gray-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Transcription
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-200">{currentTranscript}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Guide Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={tourData.guide.avatar} alt={tourData.guide.name} />
                <AvatarFallback>{tourData.guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{tourData.guide.name}</h3>
                <p className="text-sm text-gray-300">
                  {tourData.guide.year} • {tourData.guide.major}
                </p>
                <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                  Tour Guide
                </Badge>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participants ({tourData.participants.length})
            </h4>
            <div className="space-y-2">
              {tourData.participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-white">{participant.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{participant.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h4 className="font-semibold text-white">Live Chat</h4>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        message.type === "guide" ? "text-blue-400" :
                        message.type === "system" ? "text-gray-400" :
                        "text-white"
                      }`}>
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTour;
