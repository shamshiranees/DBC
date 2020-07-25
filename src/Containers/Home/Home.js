import React, { useEffect, useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  SectionList,
  Dimensions,
} from "react-native";
import { Header, ListItem, Button, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors, HelperStyles } from "../../Theme";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import RNFS from "react-native-fs";
import {
  setContact,
  setContactDetails,
  setUrlDetails,
} from "../../Redux/Actions";
import moment from 'moment';
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import ActionSheet from "react-native-actionsheet";
import { getNameId } from "../../Utils/Validator";
import CardView from "react-native-cardview";
import Color from "../../Theme/Color";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import RNCalendarEvents from 'react-native-calendar-events';


function Home(props) {
  const [searchText, setsearchText] = useState("");
  const path = RNFS.DocumentDirectoryPath + "/dbcFiles/";
  const actionSheetHome = useRef();
  const sectionListRef = useRef();
  // const dispatch = useDispatch();
  const contacts = useSelector((cont) => cont.contacts);
  const contactDetails = useSelector((cont) => cont.contactDetail);

  const dispatch = useDispatch();
  const tappedFloatButton = () => {
    dispatch(
      setContactDetails({
        id: moment().unix(),
        firstName: '',
        lastName: '',
        phoneNumber:'',
        subtitle: '',
        designation: '',
        myTeam: false,
        favorited:false,
        businessCards: [],
        quotations: [],
        invoices: [],
        documents: [],
      })
    );

    props.navigation.navigate("addContact", { isEdit: false });
  };
  const optionSelected = (index) => {
    if (index == 0) {
      props.navigation.navigate("addContact", { isEdit: true });
    } else {
      let allValue = [];
     
        allValue = contacts.filter(
          item => item.id !== contactDetails.id
        );
        dispatch(setContact(allValue))

        AsyncStorage.setItem('allContacts', JSON.stringify(allValue ));

    }
    
  };
  useEffect(() => {
    // if (props.route.params != undefined) {
    //   props.navigation.navigate('addContact', {
    //     name: props.route.params.newFile,
    //   });
    // }
    RNCalendarEvents.authorizeEventStore()
    .then(status => {

      console.log("Ssssssssaaaaa",status);
      
      // handle status
    })
    .catch(error => {
     // handle error
    });
    // setEvent()
    getData();

  }, []);

  const setEvent=()=>{

    console.log("----",moment().add(1,'minutes').toISOString());
    
    RNCalendarEvents.saveEvent('Title of event', {
      startDate: moment().add(1,'minutes').toISOString(),
      endDate: moment().add(2,'minutes').toISOString(),
      alarms: [{
        date: moment().add(1,'minutes').toISOString()
      }]
    })
  }
  sortWithHeader(contacts);
  const _onOpenActionSheet = (item) => {

    console.log("ssssssss",item);
    
    dispatch(setContactDetails(item));
    actionSheetHome.current.show();
   
    dispatch(
      setUrlDetails({
        imageUrl: path + item.image,
        quotationUrl: item.quotation,
      })
    );
  };
  const getData = async () => {
    try {
      await AsyncStorage.setItem("appLoadedOnce", "true");
      const jsonValue = await AsyncStorage.getItem("allContacts");
      if (jsonValue != null) {
        console.log("-----", JSON.parse(jsonValue));

        dispatch(setContact(JSON.parse(jsonValue)));
      }
    } catch (e) {
      // error reading value
    }
  };
  const onItemTap = (item) => {
    props.navigation.navigate("contactDetail");
    console.log("itemllll", item);

    dispatch(setContactDetails(item));
  };

  const onAphabetTap = (item) => {
    console.log(item);

    const index = sortWithHeader(contacts).findIndex(
      (x) => x.letter === item.toUpperCase()
    );
    console.log(index);
    if (index != -1) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        itemIndex: index,
        sectionIndex: 0,
      });
    }
  };
  return (
    <View style={styles.container}>
      <Header 
      containerStyle={{ paddingTop: 0, height: Dimensions.get('window').height * 0.1 }} 
        backgroundColor={Colors.primary}
        // leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={<Text style={HelperStyles.headerTitle}>Home</Text>}
        // rightComponent={{icon: 'home', color: '#fff'}}
      />
      <SearchBar
        platform="ios"
        placeholder="Search..."
        onChangeText={(text) => setsearchText(text)}
        value={searchText}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: Colors.white,
          height: "100%",
        }}
      >
        <SectionList
          style={{ marginBottom: 160 }}
          contentContainerStyle={{ width: Dimensions.get("window").width - 60 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          ref={sectionListRef}
          sections={
            searchText != ""
              ? sortWithHeader(
                  contacts.filter((person) => person.firstName.includes(searchText))
                )
              : sortWithHeader(contacts)
          }
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 0, marginVertical: 0 }}>
              <ListItem
                containerStyle={{ height: 60 }}
                roundAvatar
                underlayColor={'transparent'}
                onPress={() => onItemTap(item)}
                onLongPress={() => _onOpenActionSheet(item)}
                title={item.firstName + " "+ item.lastName}
                titleStyle={styles.title}
                subtitle={item.subtitle}
                subtitleStyle={styles.subtitle}
                
                leftAvatar={
                  <Avatar
                    containerStyle={{
                      backgroundColor: Colors.secondary,
                      // height: 46,
                      // width: 46,
                      // borderRadius: 23,
                      marginLeft: 25,
                    }}
                    rounded
                    title={getNameId(item.firstName+" "+item.lastName)}
                    size={46}
                    titleStyle={{marginTop:Platform.OS === 'ios'? 7:0}}
                    
                  />
                }
                //  bottomDivider
              />
            </View>
          )}
          renderSectionHeader={({ section: { letter } }) => (
            <Text style={styles.header}>{letter}</Text>
          )}
        />

        <FlatList
          contentContainerStyle={{
            width: 40,
            backgroundColor: Colors.white,
            marginTop: 0,marginRight:5
          }}
          data={alphabetsArray}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => onAphabetTap(item)}>
              <Text style={{ width: 40, textTransform: "uppercase",textAlign:"right" ,fontWeight:"bold",color:Colors.darkGrey,height:(Dimensions.get('window').height-200)/26}}>
                {item}
              </Text>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Button
        buttonStyle={styles.button}
        icon={<Icon name="plus" size={25} color="white" />}
        raised
        type="solid"
        containerStyle={styles.buttonContainer}
        onPress={() => tappedFloatButton("new")}
      />
      <ActionSheet
        ref={actionSheetHome}
        title={"Choose any one option"}
        options={["Edit", "Delete", "cancel"]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          optionSelected(index);
        }}
      />
    </View>
  );
}

Home.propTypes = {};

export default Home;
function getFirstLetterFrom(value) {
  return value.slice(0, 1).toUpperCase();
}
function sortWithHeader(values) {
  values.sort((a, b) => a.firstName.localeCompare(b.firstName));
  const newNames = values.reduce(function(list, data, index) {
    let listItem = list.find(
      (item) => item.letter && item.letter === getFirstLetterFrom(data.firstName)
    );
    if (!listItem) {
      list.push({ letter: getFirstLetterFrom(data.firstName), data: [data] });
    } else {
      listItem.data.push(data);
    }

    return list;
  }, []);

  return newNames;
}
const styles = StyleSheet.create({
  avatar: {
    width: 35,
    height: 35,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    color: Color.grey,fontWeight: "bold",
  },
  header: {
    backgroundColor: Colors.white,
    marginLeft: 10,
    color: Colors.grey,
    fontWeight: "800",
    fontSize: 16,
    paddingVertical: 5,
  },
  button: {
    width: 50,
    height: 50,
    // borderRadius: 35,
    // right: 0,
    backgroundColor: Colors.secondary,
     // Android
  },
  buttonContainer: {
    position: "absolute",
    bottom: 15,
    right: 30,
    borderRadius: 35,
   
   
  },
  container: { flex: 1 },
});
const alphabetsArray = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
