import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FeelsLike from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Press from 'react-native-vector-icons/MaterialCommunityIcons';
import Sunrise from 'react-native-vector-icons/Feather';
export default function Front() {
  const [locality, setLocality] = useState(null);
  const [condit, setCondit] = useState(null);
  const [weather, setWeather] = useState(null);
  const [icon, setIcon] = useState(null);
  const [feelz, setFeels] = useState(null);
  const [humi, setHumi] = useState(null);
  const [press, setPrss] = useState(null);
  const [temp, setTemp] = useState(null);
  const [area, setArea] = useState(null);
  const [country, setCountry] = useState(null);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const now = new Date();
  const dayTod = now.getDay();
  const year = now.getFullYear();
  const month = now.getMonth();
  const fulldate = now.getDate();
  const todayMonth = months[month];
  const time = `${todayMonth} ${fulldate}, ${year}`;
  let setmonth;
  let setfulldate;

  if (month <= 9) {
    setmonth = `0${month + 1}`;
  } else {
    setmonth = month;
  }

  if (fulldate <= 9) {
    setfulldate = `0${fulldate}`;
  } else {
    setfulldate = fulldate;
  }
  const getNumeriCdate = `${year}-${setmonth}-${setfulldate}`;
  console.log(getNumeriCdate);
  let day;
  if (dayTod == 0) {
    day = 'Sunday';
  } else if (dayTod == 1) {
    day = 'Monday';
  } else if (dayTod == 2) {
    day = 'Tuesday';
  } else if (dayTod == 3) {
    day = 'Wednesday';
  } else if (dayTod == 4) {
    day = 'Thursday';
  } else if (dayTod == 5) {
    day = 'Friday';
  } else if (dayTod == 6) {
    day = 'Saturday';
  }

  const reuestlocationAcess = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can We Access Your location ?',
          buttonNeutral: 'Ask Me Later',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  // function to check permissions and get Location
  const getLocation = () => {
    const result = reuestlocationAcess();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLocality(position);
          },
          error => {
            console.log(error.code, error.message);
            setLocality(null);
          },
        );
      }
    });
  };
  useEffect(() => {
    getLocation();
  }, []);
  //function to get api data from longitude and latitude

  const getApidata = async () => {
    try {
      if (locality && locality.coords) {
        const longi = locality.coords.longitude;
        const lati = locality.coords.latitude;
        const url = `https://api.weatherapi.com/v1/current.json?key=4ae16691647e4aeba1f124504240501&q=${lati},${longi}`;
        const response = await fetch(url);
        const data = await response.json();
        setCondit(data.current.condition.text);
        setWeather(data.current.cloud);
        setIcon(data.current.condition.icon);
        setFeels(data.current.feelslike_c);
        setHumi(data.current.humidity);
        setPrss(data.current.pressure_in);
        setTemp(data.current.temp_c);
        setTemp(data.current.temp_c);
        setArea(data.location.name);
        setCountry(data.location.country);
        console.log(data);
      } else {
        console.log('Close App No Idea Error');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    getApidata();
  }, [locality]);

  const [sun, setsun] = useState(null);
  const [sunr, setsunrise] = useState(null);
  const [moorise, setmoonrise] = useState(null);
  const getApidataForSun = async () => {
    const longi = locality.coords.longitude;
    const lati = locality.coords.latitude;
    const urlFrom = `https://api.weatherapi.com/v1/astronomy.json?key=4ae16691647e4aeba1f124504240501&q=${lati},${longi}&dt=${getNumeriCdate}`;
    const responses = await fetch(urlFrom);
    const datas = await responses.json();

    setsun(datas.astronomy.astro.sunset);
    setsunrise(datas.astronomy.astro.sunrise);
    setmoonrise(datas.astronomy.astro.moon_phase);

    console.log(datas);
  };

  getApidataForSun();
  return (
    <SafeAreaView style={[styles.background]}>
      <View>
        <StatusBar />
        <View style={styles.jointContainer}>
          <View style={styles.navi}>
            <View>
              <Text style={styles.navibartext}>{day}</Text>
              <Text style={[styles.navibartext, styles.marstt]}>{time}</Text>
            </View>
            <View>
              <EvilIcons
                name="search"
                size={34}
                color="#ffffff"
                style={styles.search}
              />
            </View>
          </View>
          <View style={styles.containerrr}>
            <View style={styles.container}>
              <View style={styles.tempraturedetail}>
                <Text style={styles.conditionToday}>{condit}</Text>
                <View>
                  <Image
                    style={styles.tinyLogo}
                    source={{
                      uri: `https://${icon}`,
                    }}
                  />
                </View>
                <Text style={styles.dojo}>{temp} °C</Text>
                <Text
                  style={[styles.navibartext, styles.marstt, styles.country]}>
                  {area}, {country}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.manydata}>
          <View style={styles.feels}>
            <Text>Feels Like</Text>
            <FeelsLike
              name="thermometer"
              size={32}
              color="#ffffff"
              style={[styles.feel]}
            />
            <Text style={styles.zozoFeel}>{feelz} °C</Text>
          </View>

          <View style={styles.feels}>
            <Text>Humidity</Text>
            <Entypo
              name="drop"
              size={32}
              color="#ffffff"
              style={[styles.feel]}
            />
            <Text style={styles.zozoFeel}>{humi}%</Text>
          </View>

          <View style={styles.feels}>
            <Text>Pressure</Text>
            <Press
              name="speedometer"
              size={32}
              color="#ffffff"
              style={[styles.feel]}
            />
            <Text style={styles.zozoFeel}>{press} </Text>
          </View>
        </View>

        <View style={[styles.manydata, styles.suncondition]}>
          <View style={styles.feels}>
            <Text>Sunrise</Text>
            <Sunrise
              name="sunrise"
              size={32}
              color="#ffffff"
              style={[styles.feel]}
            />
            <Text style={styles.zozoFeel}>{sunr} </Text>
          </View>

          <View style={styles.feels}>
            <Text>Sunset</Text>
            <Sunrise
              name="sunset"
              size={32}
              color="#ffffff"
              style={[styles.feel]}
            />
            <Text style={styles.zozoFeel}>{sun}</Text>
          </View>
        </View>
      </View>
      <View style={styles.feelsz}>
        <Text>Moon_Phase</Text>
        <Sunrise name="moon" size={32} color="#ffffff" style={[styles.feel]} />
        <Text style={styles.zozoFeel}>{moorise}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: '#191919',
  },
  jointContainer: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  tempraturedetail: {
    alignItems: 'center',
  },
  navi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginVertical: 18,
  },
  navibartext: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '400',
  },
  marstt: {
    marginTop: 8,
  },
  containerrr: {
    alignItems: 'center',
  },
  dojo: {
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
  },
  country: {
    fontSize: 62,
    fontWeight: 'bold',
    color: '#BED754',
  },

  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 32,
  },

  tinyLogo: {
    width: 196,
    height: 196,
    marginTop: 10,
  },

  conditionToday: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 32,
  },
  search: {
    marginTop: 8,
  },
  manydata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginVertical: 36,
  },
  feels: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  feel: {
    marginVertical: 18,
  },
  zozoFeel: {
    color: '#BED754',
    fontSize: 18,
  },
  suncondition: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  feelsz: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
});
