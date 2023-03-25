import * as React from 'react';
import { Linking, Image, StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import {   
  ActivityIndicator,
  Appbar,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  Avatar, 
  Card, 
  Divider,
  IconButton,
  List,
  Button, 
  Title,
  Text,
  Paragraph,
  TouchableRipple,
  Provider as PaperProvider,
} from 'react-native-paper';
import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA_5_RK8ebZPrHAErXJS9oPWoXTSvVCVxc",
  authDomain: "airassaultapp.firebaseapp.com",
  databaseURL: "https://airassaultapp-default-rtdb.firebaseio.com",
  projectId: "airassaultapp",
  storageBucket: "airassaultapp.appspot.com",
  messagingSenderId: "338517476325",
  appId: "1:338517476325:web:83c26d9ec94afea080650c",
  measurementId: "G-5704YDZHN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    justifyContent: 'center',
  },
  cardBtn: {
    borderRadius: 10
  },
  container: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  newsImage: {
    borderWidth: 2,
    borderRadius: 8
  },
});

function Flashcard({ flashcard }) {
  const theme = useTheme();

  const [isFlipped, setIsFlipped] = React.useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={styles.card} key={flashcard.id} title={flashcard.question}>
      <TouchableRipple
        onPress={toggleFlip}
        borderless={true}
        style={styles.cardBtn}
      >
        <Card mode="contained">
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <View style={{ justifyContent: "flex-start" }}>
                  <Text variant="titleMedium">{flashcard.question}</Text>
                  {isFlipped && (
                    <View>
                      <Divider style={{backgroundColor:theme.colors.onBackground, marginTop:16, marginBottom: 16, marginHorizontal: -16}} bold={true}/>
                      <Text variant="titleMedium">{flashcard.answer}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View>
                <View
                  style={{
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableRipple>
    </View>
  );
}

export function PathfinderScreen({ navigation }) {
  const theme = useTheme();

  return(
    <View style={{marginTop: -10, marginBottom: 8}}>
      <View style={styles.card}>
        <Card style={{marginTop: -15, marginBottom: 20}}>
          <Image source={require("./assets/Path2.png")}
            style={{
              width: 'auto',
              height: 230,
            }}
          />
          <TouchableRipple
            onPress={() => {Linking.openURL('https://home.army.mil/campbell/index.php/tsaas/pathfinder');}}
            borderless={true}
            style={{borderRadius: 0}}
          >
            <Card.Title
              title="Home"
              subtitle="Main Page"
              titleVariant="titleLarge"
            />
          </TouchableRipple>
          <Divider></Divider>
          <TouchableRipple
              onPress={() => {navigation.navigate('Air Assault Program: Phase I')}}
              borderless={true}
              style={{borderRadius: 0}}
          >
            <Card.Title 
              title="Phase 1"
              subtitle="Questions/Answers"
              titleVariant="titleLarge"
              left={(props) => <Image source={require("./assets/PathBadgeClear.png")}
                style={{
                  width: 45,
                  height: 45,
                  resizeMode:"contain"
                }}
              />}
            />
          </TouchableRipple>
          <Divider></Divider>
          <TouchableRipple
              onPress={() => {navigation.navigate('Air Assault Program: Phase II')}}
              borderless={true}
              style={{borderRadius: 0}}
          >
            <Card.Title 
              title="Phase 2"
              subtitle="Questions/Answers"
              titleVariant="titleLarge"
              left={(props) => <Image source={require("./assets/PathBadgeClear.png")}
                style={{
                  width: 45,
                  height: 45,
                  resizeMode:"contain"
                }}
              />}
            />
          </TouchableRipple>
          <Divider></Divider>
          <Card.Content>
            <Text style={{ fontSize: 12, marginTop: 10, marginBottom: 10}}>PURPOSE: {"\n"}{"\n"}
            Army Pathfinders are trained to provide navigational aid and advisory services to 
            military aircraft in areas designated by supported unit commanders.  The Pathfinders’ 
            secondary missions include providing advice and limited aid to units planning air 
            assault or airdrop operations.  During the Pathfinder course students are instructed in 
            aircraft orientation, aero-medical evacuation, close combat assault, ground to air 
            communication procedures, Control Center operations, all three phases of a sling load 
            operation, Helicopter Landing Zone and Pick Up Zone operations, and Drop Zone operations 
            (Computed Air Release Point, Ground Marker Release System, and Verbally Initiated Release 
            System), dealing with U.S. military fixed and rotary wing aircraft for personnel and equipment.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

export function Phase1Screen({ navigation }) {
  const theme = useTheme();
  const [flashcards, setFlashcards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true); // add new state variable
  const flashcardsRef = ref(getDatabase(), "airAssaultPhaseOne");

  React.useEffect(() => {
    // here onValue will get initialized once
    // and on db changes its callback will get invoked
    // resulting in changing your state value
    onValue(flashcardsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const flashcards = Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });
        setFlashcards(flashcards);
        setIsLoading(false); // set loading status to false once flashcards are loaded
      } else {
        console.log("No data available");
      }
    });
    return () => {
      // this is cleanup function, will call just on component will unmount
      // you can clear your events listeners or any async calls here
    }
  }, [])

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {isLoading ? ( // show loading indicator when isLoading is true
        <ActivityIndicator size="large" style={{marginTop:50}} color={theme.colors.primary} />
      ) : (
        flashcards.map((flashcard) => (
          <Flashcard key={flashcard.id} flashcard={flashcard} />
        ))
      )}
    </ScrollView>
  );
}

export function Phase2Screen({ navigation }) {
  const theme = useTheme();
  const [flashcards, setFlashcards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true); // add new state variable
  const flashcardsRef = ref(getDatabase(), "airAssaultPhaseTwo");

  React.useEffect(() => {
    // here onValue will get initialized once
    // and on db changes its callback will get invoked
    // resulting in changing your state value
    onValue(flashcardsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const flashcards = Object.keys(data).map((key) => {
          return { ...data[key], id: key };
        });
        setFlashcards(flashcards);
        setIsLoading(false); // set loading status to false once flashcards are loaded
      } else {
        console.log("No data available");
      }
    });
    return () => {
      // this is cleanup function, will call just on component will unmount
      // you can clear your events listeners or any async calls here
    }
  }, [])

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {isLoading ? ( // show loading indicator when isLoading is true
        <ActivityIndicator size="large" style={{marginTop:50}} color={theme.colors.primary} />
      ) : (
        flashcards.map((flashcard) => (
          <Flashcard key={flashcard.id} flashcard={flashcard} />
        ))
      )}
    </ScrollView>
  );
}

/*Test Screen DOES NOT WORK WITH FIREBASE, SINCE PULLING FLASHCARDS IS AN ASYNCHRONOUS TASK
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function TestScreen({ navigation }){
  const theme = useTheme();
  let flashcardViews = [];

  for(const item of phaseTwoFlashcards){
    flashcardViews.push(createFlashcard(item));
  }
  
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    
    <View style={{marginTop: 8, marginBottom: 8}}>
      <TouchableRipple
        onPress={() => {navigation.navigate('Air Assault Program: Testing')}}
        borderless={true}
        style={{borderRadius: 20}}
      >
      <Button mode="contained-tonal" labelStyle={{fontSize: 20, marginTop: 30}} style={{height: 80}}>Shuffle</Button>
      </TouchableRipple> 
    </View>

    {shuffle(flashcardViews)}
    </ScrollView>
  );
}*/