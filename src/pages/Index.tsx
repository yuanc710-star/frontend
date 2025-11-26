import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Video,
  Users,
  Clock,
  MapPin,
  Star,
  Home,
  Briefcase,
  ShoppingBag,
  Trophy,
} from "lucide-react";
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
      specialties: ["Engineering", "Research"],
    },
    duration: 90,
    price: 25,
    description:
      "Comprehensive tour covering academics, student life, and research facilities",
    image: "/placeholder.svg",
    tags: ["Engineering", "Research", "Campus Life"],
    availableSlots: ["Today 2:00 PM", "Today 4:30 PM", "Tomorrow 10:00 AM"],
  },
  {
    id: 2,
    title: "MIT Engineering Focus Tour",
    // Short name; we normalize it below to match dataset name
    university: "MIT",
    city: "Cambridge",
    stateCode: "MA",
    countryCode: "US",
    guide: {
      name: "Alex Rodriguez",
      major: "Mechanical Engineering",
      year: "Senior",
      rating: 4.8,
      avatar: "/placeholder.svg",
      languages: ["English", "Spanish"],
      country: "Mexico",
      specialties: ["Engineering", "Labs"],
    },
    duration: 75,
    price: 30,
    description: "Deep dive into MIT's engineering programs and labs",
    image: "/placeholder.svg",
    tags: ["Engineering", "Labs", "Research"],
    availableSlots: ["Today 3:00 PM", "Tomorrow 9:00 AM", "Tomorrow 2:00 PM"],
  },
  {
    id: 3,
    title: "Harvard Liberal Arts Experience",
    university: "Harvard University",
    city: "Cambridge",
    stateCode: "MA",
    countryCode: "US",
    guide: {
      name: "Emma Thompson",
      major: "English Literature",
      year: "Sophomore",
      rating: 4.9,
      avatar: "/placeholder.svg",
      languages: ["English", "French"],
      country: "USA",
      specialties: ["Liberal Arts", "History"],
    },
    duration: 60,
    price: 35,
    description:
      "Explore Harvard's renowned liberal arts programs and historic campus",
    image: "/placeholder.svg",
    tags: ["Liberal Arts", "History", "Academics"],
    availableSlots: ["Today 1:00 PM", "Today 5:00 PM", "Tomorrow 11:00 AM"],
  },
  {
    id: 4,
    title: "UC Berkeley Innovation Tour",
    university: "UC Berkeley",
    city: "Berkeley",
    stateCode: "CA",
    countryCode: "US",
    guide: {
      name: "Priya Patel",
      major: "Business Administration",
      year: "Junior",
      rating: 4.7,
      avatar: "/placeholder.svg",
      languages: ["English", "Hindi"],
      country: "India",
      specialties: ["Business", "Innovation"],
    },
    duration: 85,
    price: 28,
    description:
      "Explore Berkeley's entrepreneurship programs and innovation hubs",
    image: "/placeholder.svg",
    tags: ["Business", "Innovation", "Entrepreneurship"],
    availableSlots: ["Today 4:00 PM", "Tomorrow 1:00 PM", "Tomorrow 3:00 PM"],
  },
];

// ---- NEW TYPES & DATA SOURCES ----

type WorldUniversityRecord = {
  web_pages: string[];
  name: string;
  alpha_two_code: string; // e.g. "US"
  "state-province": string | null;
  domains: string[];
  country: string;
};

type UsCollege = {
  name: string;
  stateCode: string; // "CA", "MA", etc.
};

const WORLD_UNIS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json";

const US_COLLEGES_URL =
  "https://gist.githubusercontent.com/dotJoel/90c6acd65331c406d3cb/raw/3f3e5b495b8d6c48f28c43d241075149294f5714/all-colleges.txt";

// Known US state/territory codes from that file
const US_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
  "PR",
];
const US_STATE_CODE_SET = new Set(US_STATE_CODES);

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [worldUniversities, setWorldUniversities] = useState<
    WorldUniversityRecord[]
  >([]);
  const [worldLoading, setWorldLoading] = useState(false);
  const [worldError, setWorldError] = useState<string | null>(null);

  const [usColleges, setUsColleges] = useState<UsCollege[]>([]);
  const [usLoading, setUsLoading] = useState(false);
  const [usError, setUsError] = useState<string | null>(null);

  const isUS = selectedCountry === "US";

  // Load world universities + US colleges once
  useEffect(() => {
    const loadWorldUniversities = async () => {
      try {
        setWorldLoading(true);
        setWorldError(null);
        const res = await fetch(WORLD_UNIS_URL);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch world universities: ${res.status}`
          );
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
          // Format: "University Name (ST)"
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

  // ---- Helper functions for filters ----

  const getCountryOptions = () => Country.getAllCountries();

  // Check if a non-US country has any state/province info in world dataset
  const countryHasWorldStates = (countryCode: string) => {
    if (!worldUniversities.length) return false;
    return worldUniversities.some(
      (u) =>
        u.alpha_two_code === countryCode &&
        u["state-province"] &&
        u["state-province"]!.trim() !== ""
    );
  };

  // Non-US universities from world dataset (country + optional state)
  const getWorldUniversityOptions = (): string[] => {
    if (!selectedCountry || selectedCountry === "US" || !worldUniversities.length)
      return [];

    let list = worldUniversities.filter(
      (u) => u.alpha_two_code === selectedCountry
    );

    // For countries that *do* have states, apply state filter
    if (selectedState && countryHasWorldStates(selectedCountry)) {
      const stateObj = State.getStateByCodeAndCountry(
        selectedState,
        selectedCountry
      );
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

  // US universities from all-colleges.txt (country = US)
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

  // State select rules:
  // - US: always enabled (we have state data from college list)
  // - Non-US: enabled only if that country has "state-province" in world dataset
  const stateDisabled =
    !selectedCountry || (!isUS && !countryHasWorldStates(selectedCountry));

  // Match tour university names to dataset names (for short names like MIT)
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

  // Apply filters to tours (country, state, university, search term)
  const filteredTours = featuredTours.filter((tour) => {
    const matchesCountry =
      !selectedCountry || tour.countryCode === selectedCountry;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              CampusTours Live
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            )}
            <AuthDialog />
          </div>
        </div>
      </header>

      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Experience Campus Life Through Live Student-Guided Tours
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with current students for authentic, real-time virtual
            campus tours. Ask questions, explore housing options, and discover
            opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/listings")}
            >
              Browse Campus Listings
            </Button>
          </div>
        </div>
      </section>

      {/* Filters – UI layout same, logic updated */}
      <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search tours, universities, or majors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Country */}
            <Select
              value={selectedCountry ?? undefined}
              onValueChange={(val) => {
                setSelectedCountry(val);
                setSelectedState(null);
                setSelectedUniversity(null);
              }}
            >
              <SelectTrigger className="h-12">
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

            {/* State */}
            <Select
              disabled={stateDisabled}
              value={selectedState ?? undefined}
              onValueChange={(val) => {
                setSelectedState(val);
                setSelectedUniversity(null);
              }}
            >
              <SelectTrigger className="h-12">
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

            {/* City – now ignored, just disabled to preserve layout */}
            <Select disabled>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="City filter not available" />
              </SelectTrigger>
              <SelectContent>{/* intentionally empty */}</SelectContent>
            </Select>

            {/* University */}
            <Select
              disabled={!selectedCountry}
              value={selectedUniversity ?? undefined}
              onValueChange={setSelectedUniversity}
            >
              <SelectTrigger className="h-12">
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
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              {filteredTours.length === featuredTours.length &&
              !selectedCountry &&
              !searchTerm
                ? "Featured Tours"
                : `Found ${filteredTours.length} Tours`}
            </h3>
            <Badge variant="secondary" className="text-sm">
              {filteredTours.length} available now
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                Try adjusting your search criteria or browse all available
                tours.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCountry(null);
                  setSelectedState(null);
                  setSelectedUniversity(null);
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Campus Resources (unchanged) */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Campus Resources & Opportunities
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about campus life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/listings?category=housing")}
          >
            <CardHeader>
              <Home className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Housing Options</CardTitle>
              <CardDescription>
                Find apartments, shared housing, and rental options near campus
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/listings?category=jobs")}
          >
            <CardHeader>
              <Briefcase className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Job Opportunities</CardTitle>
              <CardDescription>
                Discover campus jobs, internships, and local employment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/listings?category=goods")}
          >
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Student Marketplace</CardTitle>
              <CardDescription>
                Buy, sell, or trade textbooks, furniture, and essentials
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/listings?category=activities")}
          >
            <CardHeader>
              <Trophy className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Activities & Events</CardTitle>
              <CardDescription>
                Join clubs, sports, study groups, and campus events
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats (unchanged) */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Universities</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100">Student Guides</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50,000+/</div>
              <div className="text-blue-100">Tours Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (unchanged) */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">CampusTours Live</span>
              </div>
              <p className="text-gray-400">
                Connecting prospective students with authentic college
                experiences through live, guided virtual tours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="hover:text-white"
                  >
                    Browse Tours
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/university-integration")}
                    className="hover:text-white"
                  >
                    Campus Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-white"
                  >
                    Dashboard
                  </button>
                </li>
                <li>Ask Questions</li>
                <li>Get Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Guides</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Become a Guide</li>
                <li>Earn Money</li>
                <li>Share Experience</li>
                <li>Help Students</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusTours Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
