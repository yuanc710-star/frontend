import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Video, Users, Clock, MapPin, Star, Home, Briefcase, ShoppingBag, Trophy } from "lucide-react";
import { TourCard } from "@/components/TourCard";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

const featuredTours = [
  {
    id: 1,
    title: "Complete Stanford Campus Experience",
    university: "Stanford University",
    city: "Stanford",
    stateCode: "CA",
    countryCode: "US",
    guide: {
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      rating: 4.9,
      avatar: "/placeholder.svg",
      languages: ["English", "Mandarin"],
      country: "USA",
      specialties: ["CS", "Student Life", "Dorms"]
    },
    duration: 90,
    price: 25,
    description: "Get an insider's view of Stanford campus life, housing, and CS culture",
    image: "/placeholder.svg",
    tags: ["Computer Science", "Student Life", "Dorms"],
    availableSlots: ["Today 2:00 PM", "Today 6:00 PM", "Tomorrow 10:00 AM"]
  },
  {
    id: 2,
    title: "Harvard Yard & Surroundings",
    university: "Harvard University",
    city: "Cambridge",
    stateCode: "MA",
    countryCode: "US",
    guide: {
      name: "Alex Johnson",
      major: "Economics",
      year: "Senior",
      rating: 4.8,
      avatar: "/placeholder.svg",
      languages: ["English", "Spanish"],
      country: "USA",
      specialties: ["Economics", "Clubs", "Housing"]
    },
    duration: 75,
    price: 22,
    description: "Explore Harvard Yard, surrounding dorms, and student hangout spots",
    image: "/placeholder.svg",
    tags: ["Economics", "Ivy League", "Student Life"],
    availableSlots: ["Today 3:30 PM", "Tomorrow 11:00 AM", "Tomorrow 4:00 PM"]
  },
  {
    id: 3,
    title: "MIT Engineering & Innovation Tour",
    university: "MIT",
    city: "Cambridge",
    stateCode: "MA",
    countryCode: "US",
    guide: {
      name: "Emily Zhang",
      major: "Electrical Engineering",
      year: "Junior",
      rating: 4.95,
      avatar: "/placeholder.svg",
      languages: ["English", "Mandarin"],
      country: "USA",
      specialties: ["Engineering", "Labs", "Research"]
    },
    duration: 80,
    price: 27,
    description: "Deep dive into MIT's engineering buildings, labs, and maker spaces",
    image: "/placeholder.svg",
    tags: ["Engineering", "Research", "Innovation"],
    availableSlots: ["Today 1:00 PM", "Tomorrow 9:00 AM", "Tomorrow 2:00 PM"]
  },
  {
    id: 4,
    title: "UCLA Campus Vibes",
    university: "University of California, Los Angeles",
    city: "Los Angeles",
    stateCode: "CA",
    countryCode: "US",
    guide: {
      name: "Jason Lee",
      major: "Film & Television",
      year: "Sophomore",
      rating: 4.7,
      avatar: "/placeholder.svg",
      languages: ["English", "Korean"],
      country: "USA",
      specialties: ["Arts", "Dorms", "Campus Life"]
    },
    duration: 70,
    price: 20,
    description: "Experience the Bruin lifestyle, from dorms to the iconic Royce Hall",
    image: "/placeholder.svg",
    tags: ["Film", "Dorms", "Student Life"],
    availableSlots: ["Today 5:00 PM", "Tomorrow 12:00 PM"]
  },
  {
    id: 5,
    title: "UC Berkeley Engineering & CS Focus",
    university: "UC Berkeley",
    city: "Berkeley",
    stateCode: "CA",
    countryCode: "US",
    guide: {
      name: "Priya Patel",
      major: "Computer Science",
      year: "Senior",
      rating: 4.85,
      avatar: "/placeholder.svg",
      languages: ["English", "Hindi"],
      country: "India",
      specialties: ["CS", "Internships", "Career"]
    },
    duration: 85,
    price: 28,
    description: "Explore Berkeley's entrepreneurship programs and innovation hubs",
    image: "/placeholder.svg",
    tags: ["Business", "Innovation", "Entrepreneurship"],
    availableSlots: ["Today 4:00 PM", "Tomorrow 1:00 PM", "Tomorrow 3:00 PM"]
  }
];

type WorldUniversityRecord = {
  web_pages: string[];
  name: string;
  alpha_two_code: string;
  "state-province": string | null;
  domains: string[];
  country: string;
};

type UsCollege = {
  name: string;
  stateCode: string;
};

const WORLD_UNIS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json";

const US_COLLEGES_URL =
  "https://gist.githubusercontent.com/dotJoel/90c6acd65331c406d3cb/raw/3f3e5b495b8d6c48f28c43d241075149294f5714/all-colleges.txt";

const US_STATE_CODES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","PR",
];

const US_STATE_CODE_SET = new Set(US_STATE_CODES);

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [worldUniversities, setWorldUniversities] = useState<WorldUniversityRecord[]>([]);
  const [worldLoading, setWorldLoading] = useState(false);
  const [worldError, setWorldError] = useState<string | null>(null);

  const [usColleges, setUsColleges] = useState<UsCollege[]>([]);
  const [usLoading, setUsLoading] = useState(false);
  const [usError, setUsError] = useState<string | null>(null);

  const isUS = selectedCountry === "US";

  useEffect(() => {
    const loadWorldUniversities = async () => {
      try {
        setWorldLoading(true);
        setWorldError(null);
        const res = await fetch(WORLD_UNIS_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch world universities: ${res.status}`);
        }
        const data = (await res.json()) as WorldUniversityRecord[];
        setWorldUniversities(data);
      } catch (err: any) {
        console.error(err);
        setWorldError(err?.message ?? "Failed to load universities");
      } finally {
        setWorldLoading(false);
      }
    };

    const loadUsColleges = async () => {
      try {
        setUsLoading(true);
        setUsError(null);
        const res = await fetch(US_COLLEGES_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch US colleges: ${res.status}`);
        }
        const text = await res.text();
        const lines = text.split("\n");
        const parsed: UsCollege[] = [];
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const match = trimmed.match(/^(.*)\s+\(([^()]+)\)\s*$/);
          if (!match) continue;
          const name = match[1].trim();
          const stateCode = match[2].trim();
          if (!US_STATE_CODE_SET.has(stateCode)) continue;
          parsed.push({ name, stateCode });
        }
        setUsColleges(parsed);
      } catch (err: any) {
        console.error(err);
        setUsError(err?.message ?? "Failed to load US colleges");
      } finally {
        setUsLoading(false);
      }
    };

    loadWorldUniversities();
    loadUsColleges();
  }, []);

  const getCountryOptions = () => Country.getAllCountries();

  const countryHasWorldStates = (countryCode: string) => {
    if (!worldUniversities.length) return false;
    return worldUniversities.some(
      (u) =>
        u.alpha_two_code === countryCode &&
        u["state-province"] &&
        u["state-province"]!.trim() !== ""
    );
  };

  const getWorldUniversityOptions = (): string[] => {
    if (!selectedCountry || selectedCountry === "US" || !worldUniversities.length) return [];
    let list = worldUniversities.filter((u) => u.alpha_two_code === selectedCountry);

    if (selectedState && countryHasWorldStates(selectedCountry)) {
      const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);
      const stateName = stateObj?.name?.toLowerCase();
      if (stateName) {
        list = list.filter((u) => {
          const sp = u["state-province"];
          if (!sp) return false;
          return sp.toLowerCase().includes(stateName);
        });
      }
    }

    return Array.from(new Set(list.map((u) => u.name))).sort();
  };

  const getUsUniversityOptions = (): string[] => {
    if (!isUS || !usColleges.length) return [];
    let list = usColleges;
    if (selectedState) {
      list = list.filter((c) => c.stateCode === selectedState);
    }
    return Array.from(new Set(list.map((c) => c.name))).sort();
  };

  const getUniversityOptions = (): string[] => {
    if (!selectedCountry) return [];
    if (isUS) {
      if (usError) return [];
      return getUsUniversityOptions();
    }
    if (worldError) return [];
    return getWorldUniversityOptions();
  };

  const stateDisabled =
    !selectedCountry || (!isUS && !countryHasWorldStates(selectedCountry));

  const normalizeUniversityName = (name: string) => {
    switch (name) {
      case "MIT":
        return "Massachusetts Institute of Technology";
      case "UC Berkeley":
        return "University of California, Berkeley";
      default:
        return name;
    }
  };

  const filteredTours = featuredTours.filter((tour) => {
    const matchesCountry = !selectedCountry || tour.countryCode === selectedCountry;

    const matchesState =
      !selectedState || (tour.stateCode && tour.stateCode === selectedState);

    const matchesUniversity =
      !selectedUniversity ||
      normalizeUniversityName(tour.university) === selectedUniversity;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      tour.title.toLowerCase().includes(term) ||
      tour.university.toLowerCase().includes(term) ||
      tour.guide.major.toLowerCase().includes(term);

    return matchesCountry && matchesState && matchesUniversity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl flex items-center justify-between py-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-slate-900">
                CampusTours<span className="text-indigo-600">Live</span>
              </span>
              <span className="text-xs text-slate-500">
                Real students. Real campuses.
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <button className="hover:text-slate-900 flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </button>
            <button className="hover:text-slate-900 flex items-center gap-1">
              <Video className="h-4 w-4" />
              Live Tours
            </button>
            <button className="hover:text-slate-900 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Become a Guide
            </button>
            <button className="hover:text-slate-900 flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              For Schools
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <AuthDialog>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </Button>
            </AuthDialog>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <main className="container mx-auto max-w-6xl">
        <section className="py-10 px-4">
          <div className="grid md:grid-cols-[1.6fr,1.1fr] gap-10 items-center">
            <div>
              <Badge className="mb-4 bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Trophy className="h-3 w-3 mr-1" />
                New · Live student-led tours for 500+ campuses
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Tour your dream campus with{" "}
                <span className="text-indigo-600">real students</span>, from anywhere.
              </h1>
              <p className="text-slate-600 mb-6 text-base md:text-lg">
                Book live, interactive video tours with current students at universities worldwide.
                Ask questions in real time, explore dorms, classrooms, and campus life—all from your
                phone or laptop.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Star className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span>4.9/5 average tour rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <span>Trusted by students & parents</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-7 w-7 rounded-full bg-amber-50 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <span>Book in your local timezone</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Explore live tours
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-800 hover:bg-slate-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Become a student guide
                </Button>
              </div>
            </div>

            <div>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">Quick tour finder</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Under 2 minutes
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Filter by country, state, and university to find the right tour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tours, universities, or majors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 text-sm"
                      />
                    </div>

                    <Select
                      value={selectedCountry ?? undefined}
                      onValueChange={(val) => {
                        setSelectedCountry(val);
                        setSelectedState(null);
                        setSelectedUniversity(null);
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCountryOptions().map((c) => (
                          <SelectItem key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      disabled={stateDisabled}
                      value={selectedState ?? undefined}
                      onValueChange={(val) => {
                        setSelectedState(val);
                        setSelectedUniversity(null);
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue
                          placeholder={
                            !selectedCountry
                              ? "Select State"
                              : stateDisabled && !isUS
                              ? "State filter not available"
                              : "Select State"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountry &&
                          !stateDisabled &&
                          State.getStatesOfCountry(selectedCountry).map((s) => (
                            <SelectItem key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Select
                      disabled={!selectedCountry}
                      value={selectedUniversity ?? undefined}
                      onValueChange={setSelectedUniversity}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue
                          placeholder={
                            !selectedCountry
                              ? "Select University"
                              : worldLoading || usLoading
                              ? "Loading universities..."
                              : getUniversityOptions().length
                              ? "Select University"
                              : "No universities found"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getUniversityOptions().map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>
                      Tip: Choose <strong>United States</strong> to get state-level filters.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured tours */}
        <section className="py-8 px-4 bg-white/50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Featured live tours
                </h2>
                <p className="text-slate-500 text-sm">
                  Handpicked experiences from top universities.
                </p>
              </div>
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                View all tours
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {filteredTours.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tours found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse all available tours.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCountry(null);
                    setSelectedState(null);
                    setSelectedUniversity(null);
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Campus resources section (kept as in your original) */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-800">
                    <ShoppingBag className="h-5 w-5" />
                    For prospective students
                  </CardTitle>
                  <CardDescription>
                    Tools to help you decide where to apply and attend.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>• Compare multiple campuses in a single afternoon.</p>
                  <p>• Ask real students about their honest experiences.</p>
                  <p>• See dorms, dining halls, and study spaces live.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Users className="h-5 w-5" />
                    For parents & families
                  </CardTitle>
                  <CardDescription>
                    Join the call, ask questions, and feel confident.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>• Understand safety, support, and campus resources.</p>
                  <p>• Join from different locations at the same time.</p>
                  <p>• Rewatch recordings together after the tour.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Briefcase className="h-5 w-5" />
                    For universities
                  </CardTitle>
                  <CardDescription>
                    Extend your campus tours to students worldwide.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-600">
                  <p>• Reach students who can’t travel in person.</p>
                  <p>• Track engagement and conversion analytics.</p>
                  <p>• Highlight student ambassadors and campus culture.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-200 mt-10">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-lg">
                  CampusTours<span className="text-indigo-400">Live</span>
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Bringing real campus experiences to students and families around the world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Live Tours</li>
                <li>Recorded Tours</li>
                <li>AI Tour Highlights</li>
                <li>For Universities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>About</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Help Center</li>
                <li>FAQ</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-xs">
            <p>&copy; 2024 CampusTours Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
