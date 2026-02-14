import random

def get_mock_weather(location):
    seed = sum(ord(c) for c in (location or "default"))
    random.seed(seed)
    
    temp = round(random.uniform(25, 42), 1)
    humidity = round(random.uniform(30, 80), 1)
    
    # Simple Heat Index approx for finding cases (matching dataset_generator)
    # T eq
    T = (temp * 9/5) + 32
    RH = humidity
    HI = 0.5 * (T + 61.0 + ((T-68.0)*1.2) + (RH*0.094))
    if HI >= 80:
        HI = -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH
    hi_c = (HI - 32) * 5/9
    
    return temp, humidity, hi_c

cities = ["Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mumbai", "Mexico City", "Beijing", "Osaka", "Cairo", "New York", "Dhaka", "Karachi", 
          "Buenos Aires", "Kolkata", "Istanbul", "Chongqing", "Lagos", "Manila", "Rio de Janeiro", "Guangzhou", "Los Angeles", "Moscow", "Kinshasa", 
          "Tianjin", "Paris", "Shenzhen", "Jakarta", "London", "Lima", "Bangkok", "Chennai", "Nagoya", "Hyderabad", "Chicago", "Chengdu", 
          "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda", "Ahmedabad", "Kuala Lumpur", "Xi'an", "Hong Kong", "Dongguan", "Hangzhou", "Foshan", 
          "Shenyang", "Riyadh", "Baghdad", "Santiago", "Surat", "Madrid", "Suzhou", "Pune", "Harbin", "Houston", "Dallas", "Toronto", "Miami", 
          "Singapore", "Philadelphia", "Atlanta", "Barcelona", "Berlin", "San Francisco", "Washington", "Boston", "Antarctica", "Siberia", "Alaska", "Coolville", "Hotville"]

print("Searching for test cases...")
found_low = None
found_mod = None
found_ext = None

for city in cities:
    t, h, hi = get_mock_weather(city)
    
    # Low: HI < 27
    if hi < 27 and not found_low:
        found_low = (city, t, h, hi)
        
    # Moderate: 27 <= HI < 32
    if 27 <= hi < 32 and not found_mod:
        found_mod = (city, t, h, hi)
        
    # Extreme: HI > 40
    if hi > 40 and not found_ext:
        found_ext = (city, t, h, hi)
        
    if found_low and found_mod and found_ext:
        break

if found_low: print(f"LOW: {found_low[0]}")
if found_mod: print(f"MODERATE: {found_mod[0]}")
if found_ext: print(f"EXTREME: {found_ext[0]}")
