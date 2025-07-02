
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, LogIn, UserPlus, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
    setOpen(false);
  };

  const handleSignUp = async (email: string, password: string, userType: string, name: string) => {
    setIsLoading(true);
    await signUp(email, password, { userType, name });
    setIsLoading(false);
    setOpen(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          Welcome, {user.name}
        </span>
        <Button variant="outline" onClick={signOut} size="sm">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CampusTours Live</DialogTitle>
          <DialogDescription>
            Sign in to book tours and connect with student guides
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const SignInForm = ({ onSubmit, isLoading }: { onSubmit: (email: string, password: string) => void; isLoading: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="your.email@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        <LogIn className="h-4 w-4 mr-2" />
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};

const SignUpForm = ({ onSubmit, isLoading }: { onSubmit: (email: string, password: string, userType: string, name: string) => void; isLoading: boolean }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    university: "",
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    onSubmit(formData.email, formData.password, formData.userType, formData.name);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          placeholder="Your full name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="your.email@university.edu"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-type">I am a...</Label>
        <Select value={formData.userType} onValueChange={(value) => updateFormData("userType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prospective">Prospective Student</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="current">Current Student (Guide)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.userType && (
        <div className="space-y-2">
          <Label htmlFor="university">University/School</Label>
          <Input
            id="university"
            placeholder="Your university or target school"
            value={formData.university}
            onChange={(e) => updateFormData("university", e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the Terms of Service and Privacy Policy
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !formData.agreeToTerms}>
        <UserPlus className="h-4 w-4 mr-2" />
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
