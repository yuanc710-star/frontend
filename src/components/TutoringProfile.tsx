
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, BookOpen, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutoringProfileProps {
  onSave: (profile: any) => void;
  onCancel: () => void;
  existingProfile?: any;
}

const TutoringProfile = ({ onSave, onCancel, existingProfile }: TutoringProfileProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    subjects: existingProfile?.subjects || [],
    hourlyRate: existingProfile?.hourlyRate || "",
    experience: existingProfile?.experience || "",
    qualifications: existingProfile?.qualifications || "",
    availability: existingProfile?.availability || {
      monday: { available: false, times: [] },
      tuesday: { available: false, times: [] },
      wednesday: { available: false, times: [] },
      thursday: { available: false, times: [] },
      friday: { available: false, times: [] },
      saturday: { available: false, times: [] },
      sunday: { available: false, times: [] }
    },
    bio: existingProfile?.bio || "",
    preferredLocation: existingProfile?.preferredLocation || "",
    contactMethod: existingProfile?.contactMethod || "email"
  });

  const [newSubject, setNewSubject] = useState("");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [newTimeSlot, setNewTimeSlot] = useState({ start: "", end: "" });

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "English", "History", "Economics", "Psychology", "Statistics",
    "Calculus", "Algebra", "Spanish", "French", "German", "Other"
  ];

  const addSubject = () => {
    if (newSubject && !profile.subjects.includes(newSubject)) {
      setProfile(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject]
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setProfile(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const addTimeSlot = () => {
    if (newTimeSlot.start && newTimeSlot.end) {
      setProfile(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [selectedDay]: {
            ...prev.availability[selectedDay],
            times: [...prev.availability[selectedDay].times, `${newTimeSlot.start} - ${newTimeSlot.end}`]
          }
        }
      }));
      setNewTimeSlot({ start: "", end: "" });
    }
  };

  const toggleDayAvailability = (day: string) => {
    setProfile(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          available: !prev.availability[day].available
        }
      }
    }));
  };

  const handleSave = () => {
    if (!profile.subjects.length || !profile.hourlyRate || !profile.bio) {
      toast({
        title: "Missing Information",
        description: "Please fill in subjects, hourly rate, and bio.",
        variant: "destructive"
      });
      return;
    }

    onSave(profile);
    toast({
      title: "Tutoring Profile Saved",
      description: "Your tutoring profile has been updated successfully!"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Tutoring Profile
          </CardTitle>
          <CardDescription>Create your tutoring profile to connect with students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subjects */}
          <div>
            <Label>Subjects You Tutor *</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Select value={newSubject} onValueChange={setNewSubject}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addSubject}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {profile.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center">
                      {subject}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate * ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              placeholder="25"
              value={profile.hourlyRate}
              onChange={(e) => setProfile(prev => ({ ...prev, hourlyRate: e.target.value }))}
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              placeholder="Tell students about your tutoring style, experience, and what makes you a great tutor..."
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Experience & Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                placeholder="2"
                value={profile.experience}
                onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                placeholder="BS in Mathematics, Dean's List"
                value={profile.qualifications}
                onChange={(e) => setProfile(prev => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label>Availability</Label>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.keys(profile.availability).map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      checked={profile.availability[day].available}
                      onCheckedChange={() => toggleDayAvailability(day)}
                    />
                    <Label className="capitalize">{day}</Label>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(profile.availability).map(day => (
                      <SelectItem key={day} value={day} className="capitalize">{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  value={newTimeSlot.start}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, start: e.target.value }))}
                  className="w-24"
                />
                <span className="self-center">to</span>
                <Input
                  type="time"
                  value={newTimeSlot.end}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, end: e.target.value }))}
                  className="w-24"
                />
                <Button type="button" onClick={addTimeSlot}>Add</Button>
              </div>

              {profile.availability[selectedDay].times.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.availability[selectedDay].times.map((time, index) => (
                    <Badge key={index} variant="outline">{time}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preferred Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Select value={profile.preferredLocation} onValueChange={(value) => setProfile(prev => ({ ...prev, preferredLocation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Only</SelectItem>
                  <SelectItem value="in-person">In-Person Only</SelectItem>
                  <SelectItem value="both">Both Online & In-Person</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="campus">On Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactMethod">Preferred Contact Method</Label>
              <Select value={profile.contactMethod} onValueChange={(value) => setProfile(prev => ({ ...prev, contactMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="platform">Platform Messaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleSave} className="flex-1">
              <DollarSign className="h-4 w-4 mr-2" />
              Save Tutoring Profile
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutoringProfile;
