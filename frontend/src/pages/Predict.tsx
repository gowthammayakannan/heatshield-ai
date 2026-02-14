import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Activity, Droplets, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import SectionHeader from "@/components/SectionHeader";
import { usePrediction, type UserInputs } from "@/state/predictionStore";
import { MAJOR_CITIES } from "@/data/cities";

export default function PredictPage() {
  const navigate = useNavigate();
  const { dispatch } = usePrediction();

  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null);
  const [exposure, setExposure] = useState([4]);
  const [activityLevel, setActivityLevel] = useState("");
  const [hydration, setHydration] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [cityError, setCityError] = useState("");

  const isValid = (city.trim().length >= 2 || coordinates !== null) && activityLevel && hydration && ageGroup;

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setCityError("Geolocation is not supported by your browser");
      return;
    }

    setCity("Locating...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        setCity(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setCityError("");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setCityError("Unable to retrieve location. Please enter manually.");
        setCity("");
      }
    );
  }

  function handleSubmit() {
    if ((!city.trim() || city.trim().length < 2) && !coordinates) {
      setCityError("Please enter a valid city name or use location");
      return;
    }
    const inputs: UserInputs = {
      city: city.trim(),
      latitude: coordinates?.lat,
      longitude: coordinates?.lon,
      exposureDuration: exposure[0],
      activityLevel,
      hydrationLevel: hydration,
      ageGroup,
    };
    console.log("Submitting inputs:", inputs);
    dispatch({ type: "SET_INPUTS", payload: inputs });
    console.log("Dispatch complete, navigating to /analyzing");
    navigate("/analyzing");
  }

  return (
    <div className="container py-10 max-w-3xl">
      <SectionHeader
        title="Risk Assessment Input"
        subtitle="Provide work context for an accurate heat stress prediction"
      />

      <div className="space-y-6">
        {/* Panel A — Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between text-primary font-semibold text-sm">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={handleGeolocation}
              type="button"
            >
              <MapPin className="h-3 w-3" /> Locate Me
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City Name or Coordinates</Label>

            <div className="relative">
              {!coordinates ? (
                /* Custom Combobox Implementation */
                <div className="relative w-full">
                  <Input
                    id="city"
                    placeholder="Type city name..."
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setCityError("");
                      setCoordinates(null);
                    }}
                    className="bg-secondary/50 w-full"
                    autoComplete="off"
                    list="city-suggestions"
                  />
                  {/* Native Datalist for simple, accessible autocomplete */}
                  <datalist id="city-suggestions">
                    {MAJOR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  {city}
                  <button
                    onClick={() => { setCity(""); setCoordinates(null); }}
                    className="ml-auto text-xs hover:underline opacity-70"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {coordinates && <p className="text-xs text-green-500 font-medium">✓ Using precise GPS coordinates</p>}
            {cityError && <p className="text-xs text-destructive">{cityError}</p>}
          </div>
        </motion.div>

        {/* Panel B — Exposure */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Clock className="h-4 w-4" /> Work Exposure
          </div>
          <div className="space-y-3">
            <Label>Exposure Duration: <span className="text-primary font-bold">{exposure[0]}h</span></Label>
            <Slider value={exposure} onValueChange={setExposure} min={1} max={12} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 hour</span><span>12 hours</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select activity level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light (office/desk work)</SelectItem>
                <SelectItem value="moderate">Moderate (walking/supervision)</SelectItem>
                <SelectItem value="heavy">Heavy (manual labor)</SelectItem>
                <SelectItem value="extreme">Extreme (intense physical work)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Panel C — Personal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Users className="h-4 w-4" /> Personal Factors
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5" /> Hydration Level</Label>
              <Select value={hydration} onValueChange={setHydration}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="well">Well Hydrated</SelectItem>
                  <SelectItem value="moderate">Moderately Hydrated</SelectItem>
                  <SelectItem value="poor">Poorly Hydrated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> Age Group</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18–25</SelectItem>
                  <SelectItem value="26-35">26–35</SelectItem>
                  <SelectItem value="36-45">36–45</SelectItem>
                  <SelectItem value="46-55">46–55</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <Button
          size="lg"
          className="w-full"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Analyze Heat Stress Risk
        </Button>
      </div>
    </div>
  );
}
