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
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import ActionSheet from "react-native-actionsheet";
import { getNameId } from "../../Utils/Validator";
import CardView from "react-native-cardview";
import Color from "../../Theme/Color";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function Home(props) {
  const [searchText, setsearchText] = useState("");
  const path = RNFS.DocumentDirectoryPath + "/dbcFiles/";
  const actionSheet = useRef();
  const sectionListRef = useRef();
  // const dispatch = useDispatch();
  const contacts = useSelector((cont) => cont.contacts);
  const dispatch = useDispatch();
  const tappedFloatButton = () => {
    dispatch(
      setContactDetails({
        id: "",
        name: "",
        subtitle: "",
        designation: "",
        myTeam: false,
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
    }
    console.log(index);
  };
  useEffect(() => {
    // if (props.route.params != undefined) {
    //   props.navigation.navigate('addContact', {
    //     name: props.route.params.newFile,
    //   });
    // }
    getData();
  }, []);
  sortWithHeader(contacts);
  const _onOpenActionSheet = (item) => {
    actionSheet.current.show();
    dispatch(setContactDetails(item));
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
                  contacts.filter((person) => person.name.includes(searchText))
                )
              : sortWithHeader(contacts)
          }
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: 0, marginVertical: 0 }}>
              <ListItem
                containerStyle={{ height: 60 }}
                roundAvatar
                onPress={() => onItemTap(item)}
                onLongPress={() => _onOpenActionSheet(item)}
                title={item.name}
                titleStyle={styles.title}
                subtitle={item.subtitle}
                subtitleStyle={styles.subtitle}
                leftAvatar={
                  <Avatar
                    containerStyle={{
                      backgroundColor: Colors.secondary,
                      height: 46,
                      width: 46,
                      borderRadius: 23,
                      marginLeft: 25,
                    }}
                    rounded
                    title={getNameId(item.name)}
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
            marginTop: 50,marginRight:5
          }}
          data={alphabetsArray}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => onAphabetTap(item)}>
              <Text style={{ width: 40, textTransform: "uppercase",textAlign:"right" ,fontWeight:"bold",color:Colors.darkGrey}}>
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
        containerStyle={styles.buttonContainer}
        onPress={() => tappedFloatButton("new")}
      />
      <ActionSheet
        ref={actionSheet}
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
  values.sort((a, b) => a.name.localeCompare(b.name));
  const newNames = values.reduce(function(list, data, index) {
    let listItem = list.find(
      (item) => item.letter && item.letter === getFirstLetterFrom(data.name)
    );
    if (!listItem) {
      list.push({ letter: getFirstLetterFrom(data.name), data: [data] });
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
    width: 70,
    height: 70,
    borderRadius: 35,
    right: 0,
    backgroundColor: Colors.secondary,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 5, //IOS
    elevation: 2, // Android
  },
  buttonContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
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
