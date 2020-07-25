import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Header,
  ListItem,
  Button,
  CheckBox,
  Card,
} from 'react-native-elements';
import {Colors, HelperStyles} from '../../Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import Color from '../../Theme/Color';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setContact,
  setNewFileImport,
  setContactDetails,
  setUrlDetails,
} from '../../Redux/Actions';
import moment from 'moment';
import {isFileValid} from '../../Utils/Validator';
import ActionSheet from 'react-native-actionsheet';
import CardView from 'react-native-cardview';
import { updateContact } from '../../Utils/LocalStorage';
import Input from 'react-native-floating-label-text-input';
function addContact(props) {
  const isEdit = props.route.params ? props.route.params.isEdit : false;

  const dispatch = useDispatch();
  const dbcStore = useSelector(cont => cont);
  
  const removeFile = (name, header, type) => {
    onFileViewerClosed(name, header, type);
  };

  const selectOneFile = async selectionType => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        // selectionType === 'image'
        //   ? [DocumentPicker.types.images]
        //   : [DocumentPicker.types.pdf],
      });

      // const [fileValid, contactId] = isFileValid(selectionType, res.name);
      // console.log('oooooo', fileValid);

      // if (fileValid) {
        var path = RNFS.TemporaryDirectoryPath;
     
        
      await FileViewer.open(res.uri, {
        onDismiss: () => onFileViewerClosed({name:res.name,path:res.uri,date:moment().format('L')}, selectionType, 'add'),
      });
      // } else {
      //   alert(contactId);
      // }
    } catch (err) {
      console.log('eeerror', err);

      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const onFileViewerClosed = (res, header, type) => {
    console.log('--------', type);

    let fileName = res;
    if (header === 'Business Cards') {
      let allValue = [];
      if (type === 'add') {
        allValue = dbcStore.contactDetail.businessCards.concat([fileName]);
      } else {
        allValue = dbcStore.contactDetail.businessCards.filter(
          item => item.name !== res.name,
        );
      }
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetail,
          businessCards: allValue,
        }),
      );
    } else if (header === 'Quotations') {
      let allValue = [];
      if (type === 'add') {
        allValue = dbcStore.contactDetail.quotations.concat([fileName]);
      } else {
        allValue = dbcStore.contactDetail.quotations.filter(
          item => item.name !== res.name,
        );
      }
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetail,
          quotations: allValue,
        }),
      );
    } else if (header === 'Invoices') {
      let allValue = [];
      if (type === 'add') {
        allValue = dbcStore.contactDetail.invoices.concat([fileName]);
      } else {
        allValue = dbcStore.contactDetail.invoices.filter(item => item.name !== res.name);
      }
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetail,
          invoices: allValue,
        }),
      );
    } else if (header === 'Documents') {
      let allValue = [];
      if (type === 'add') {
        allValue = dbcStore.contactDetail.documents.concat([fileName]);
      } else {
        allValue = dbcStore.contactDetail.documents.filter(
          item => item.name !== res.name,
        );
      }
      dispatch(
        setContactDetails({
          ...dbcStore.contactDetail,
          documents: allValue,
        }),
      );
    }
  };
  const saveContact = () => {
    var rnfsPromises = [];
    var path = `${RNFS.DocumentDirectoryPath}/dbcFiles/`;

     if (isEdit) {  
      const jsonValue = dbcStore.contactDetail;
      var allContacts = JSON.parse(JSON.stringify(dbcStore.contacts));
      


     var NewContacts = dbcStore.contacts.filter(
        item => item.id !== jsonValue.id,
      );
      // for (var i = 0; i < allContacts.length; i++) {
      //   let item = allContacts[i];
       
      //   if (item.id === jsonValue.id) {
          
          
      //     allContacts[i] = jsonValue;
      //   }
      // }
   

     AsyncStorage.setItem('allContacts', JSON.stringify(NewContacts));
       dispatch(setContact(JSON.parse(JSON.stringify(NewContacts))));
      //  return props.navigation.goBack();
     }
    if (dbcStore.contactDetail.businessCards.length > 0) {
      for (var i = 0; i < dbcStore.contactDetail.businessCards.length; i++) {
        const item = dbcStore.contactDetail.businessCards[i];
        const itemName = `${dbcStore.contactDetail.id}_${item.name}`;

        rnfsPromises.push(
          RNFS.moveFile(item.path, `${path}${itemName}`),
        );
      }
    }
    if (dbcStore.contactDetail.quotations.length > 0) {
      for (var i = 0; i < dbcStore.contactDetail.quotations.length; i++) {
        const item = dbcStore.contactDetail.quotations[i];
        const itemName = `${dbcStore.contactDetail.id}_${item.name}`;

        rnfsPromises.push(
          RNFS.moveFile(item.path, `${path}${itemName}`),
        );
      }
    }
    if (dbcStore.contactDetail.invoices.length > 0) {
      for (var i = 0; i < dbcStore.contactDetail.invoices.length; i++) {
        const item = dbcStore.contactDetail.invoices[i];
        const itemName = `${dbcStore.contactDetail.id}_${item.name}`;

        rnfsPromises.push(
          RNFS.moveFile(item.path, `${path}${itemName}`),
        );
      }
    }
    if (dbcStore.contactDetail.documents.length > 0) {
      for (var i = 0; i < dbcStore.contactDetail.documents.length; i++) {
        const item = dbcStore.contactDetail.documents[i];
        const itemName = `${dbcStore.contactDetail.id}_${item.name}`;

        rnfsPromises.push(
          RNFS.moveFile(item.path, `${path}${itemName}`),
        );
      }
    }

    RNFS.mkdir(path)
      .then(success => {
        Promise.all(rnfsPromises)
          .then(success => {
            console.log('sucesss', success);
            const jsonValue = dbcStore.contactDetail;
            AsyncStorage.getItem('allContacts', (_err, result) => {
              if (result !== null) {
                console.log('Data Found', result);
                var allValue = JSON.parse(result).concat([jsonValue]);
                AsyncStorage.setItem('allContacts', JSON.stringify(allValue));
                dispatch(setContact(allValue));
              } else {
                console.log('Data Not Found');
                AsyncStorage.setItem(
                  'allContacts',
                  JSON.stringify([jsonValue]),
                );
                dispatch(setContact([jsonValue]));
              }
              dispatch(setNewFileImport(''));

              // props.navigation.navigate('Home');
            });
            props.navigation.goBack();
          })
          .catch(err => {
            console.log(err.message);
            alert(err.message);
          });
      })
      .catch(err => {
        console.log(err.message);
        saveContact()
        // alert(err.message);
      });
  };
  return (
    <View style={{height:'100%',backgroundColor:Colors.white}}>
      <Header
      containerStyle={{ paddingTop: 0, height: Dimensions.get('window').height * 0.1 }} 
        backgroundColor={Colors.primary}
        leftComponent={{
          icon: 'chevron-left',
          color: '#fff',
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        
        centerComponent={<Text style={HelperStyles.headerTitle}>AddConatct</Text>}
        rightComponent={<Text onPress={()=>saveContact()} style={HelperStyles.headerTitle}>Done</Text>}

        //  rightComponent={{icon: 'done', color: Colors.white}}
      />

      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.conatiner}>
        
          <Input
            // labelStyle={styles.label}
             containerStyles={styles.inputContainer}
             value={dbcStore.contactDetail.firstName}
             
             placeholder="First Name"
             onChangeTextValue={value =>
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetail,
                  firstName: value,
                }),
              )
            }
          />
            <Input
           containerStyles={styles.inputContainer}
           placeholder="Last Name"
           onChangeTextValue={value =>
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetail,
                  lastName: value,
                }),
              )
            }
            value={dbcStore.contactDetail.lastName}
          />
          <Input
            labelStyle={styles.label}
            containerStyles={styles.inputContainer}
            placeholder="Company"
            onChangeTextValue={value =>
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetail,
                  subtitle: value,
                }),
              )
            }
            value={dbcStore.contactDetail.subtitle}
          />
          <Input
              labelStyle={styles.label}
              placeholder="Mobile Number"
              keyboardType="number-pad"
              containerStyles={styles.inputContainer}
              onChangeTextValue={value =>
                dispatch(
                  setContactDetails({
                    ...dbcStore.contactDetail,
                    phoneNumber: value,
                  }),
                )
              }
              value={dbcStore.contactDetail.phoneNumber}
            />
          
            <Input
              labelStyle={styles.label}
              containerStyles={styles.inputContainer}
              placeholder="Designation"
              onChangeTextValue={value =>
                dispatch(
                  setContactDetails({
                    ...dbcStore.contactDetail,
                    designation: value,
                  }),
                )
              }
              value={dbcStore.contactDetail.designation}
            />
             <CheckBox
            containerStyles={styles.inputContainer}
            title="My team"
            checked={dbcStore.contactDetail.myTeam}
            onPress={() =>
              dispatch(
                setContactDetails({
                  ...dbcStore.contactDetail,
                  myTeam: !dbcStore.contactDetail.myTeam,
                }),
              )
            }
          />
        
          <CustomFlatList
            title="Business Cards"
            items={dbcStore.contactDetail.businessCards}
            id={dbcStore.contactDetail.id}
            selectFile={selectOneFile}
            removeFile={removeFile}
            isEdit={isEdit}
          />
          <CustomFlatList
            title="Quotations"
            items={dbcStore.contactDetail.quotations}
            id={dbcStore.contactDetail.id}
            selectFile={selectOneFile}
            removeFile={removeFile}
            isEdit={isEdit}
          />
          <CustomFlatList
            title="Invoices"
            items={dbcStore.contactDetail.invoices}
            id={dbcStore.contactDetail.id}
            selectFile={selectOneFile}
            removeFile={removeFile}
            isEdit={isEdit}
          />
          <CustomFlatList
            title="Documents"
            items={dbcStore.contactDetail.documents}
            id={dbcStore.contactDetail.id}
            selectFile={selectOneFile}
            removeFile={removeFile}
            isEdit={isEdit}
          />
        </View>
      </ScrollView>
      {/* <Button title="Save" buttonStyle={styles.savBtn} onPress={saveContact} /> */}
    </View>
  );
}

addContact.propTypes = {};

export default addContact;

function CustomFlatList({title, items, id, selectFile, removeFile, isEdit}) {
  const actionSheet = useRef();
  const [selectedFile, setselectedFile] = useState('');
  
  const optionSelected =  (index, item) => {
    if (index === 0) {
        FileViewer.open(isEdit ? `${RNFS.DocumentDirectoryPath}/dbcFiles/${id}_${item.name}` :  item.path);
    } else if (index === 1) {
      removeFile(item, title, 'remove');
    }
  };
  const onFileTap = item => {
    // setselectedFile(item);
    actionSheet.current.show();
  };

  // useEffect(() => {
  //   if (selectedFile !== '') {
  //     actionSheet.current.show();
  //   }
  // }, [selectedFile]);
  // const onImageTap = async item => {
  //   console.log('lll', item);

  //   await FileViewer.open(
  //     `${RNFS.TemporaryDirectoryPath}/org.reactjs.native.shamshir.DBC-Inbox/` +
  //       item,
  //   );
  // };

  return (
    <View style={styles.card}>
    <ListItem
        onPress={() => selectFile(title)}
         containerStyle={styles.header}
        // contentContainerStyle={styles.header}
        titleStyle={styles.headerTitle}
        title={title}
        leftAvatar={
          <Icon
          onPress={() => selectFile(title)}
          style={{zIndex:999}}
            name={"plus-circle"}
            size={25}
            color={Colors.white}
          />
         }
        // rightAvatar={<Icon name={'share'} size={15} color={Colors.white} />}
      />
      {items.length === 0 ? (
        // <Text style={styles.noData}>No data</Text>
        <></>
      ) : (
        <FlatList
          style={styles.flatList}
          data={items}
          // horizontal={true}
          // numColumns={3}
          bounces={false}
          renderItem={({item}) => (

            

            <ListItem
            containerStyle={{ height: 80 }}
           onPress={() => onFileTap(item)}
           title={item.name}
           titleStyle={styles.pdfName}
           subtitle={item.date}
           subtitleStyle={styles.pdfDate}
          //  rightAvatar={<><Icon name={'bell'} size={10} color={Colors.grey} />
          //  <Text style={{fontSize:10,color:Colors.grey,marginLeft:3}}>Reminder</Text></>}
           leftAvatar={
             <View style={{flexDirection:'column'}}>
             <Image style={styles.pdfBg} source={require('../../Assets/pdfIcon.jpeg')}/>
             <Text style={styles.pdfTitles}>{"DBC PDF"}</Text>
             <ActionSheet
                ref={actionSheet}
                title={'Choose any one option'}
                options={['Show', 'Delete', 'cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={index => {
                  console.log("Sssssssssss")
                  
                  optionSelected(index, item);
                }}
              />
             </View>
           }
             bottomDivider
         />
            // <TouchableOpacity
            //   style={styles.pdfDetails}
            //   onPress={() => onFileTap(item)}>
            //   <View style={styles.pdfBg}>
            //     <Icon name="file-pdf-o" size={70} color="white" />
            //   </View>
            //   <Text style={styles.pdfTitles}>{item}</Text>
             
            // </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  conatiner: {
    marginVertical: 20,backgroundColor:Colors.white,height:'100%',paddingHorizontal:10
    // margin: 20,
  },
  selectedImage: {width: 100, height: 100, marginLeft: 8.0},
  selectBtn: {height: 100, width: 100, marginLeft: 8.0},
  attachView: {flexDirection: 'row', alignItems: 'center'},
  filename: {marginLeft: 10},
  savBtn: {
    backgroundColor: Color.primary,
    height: 50,
  },
  scrollView: {
    height: Dimensions.get('window').height - 155,
  },
  label: {
    // height: 30,
    fontSize: 12,
    color: Colors.grey,
  },
  inputContainer: {
   // borderRadius: 6,
   borderWidth:0,
borderBottomWidth:0.5,
borderBottomColor: Colors.grey,
    height: 45,
    marginVertical:5,
    paddingLeft: 7.0,
  },
  inputDescriptionContainer: {
    borderRadius: 10,
    borderColor: Colors.grey,
    height: 45,
    borderWidth: 0.5,
    paddingLeft: 7.0,
    textAlignVertical: 'top',
    alignItems: 'flex-start',
  },
  Text: {
    height: 30,
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    marginLeft: 5.0,
    marginTop: 20,
  },
  checkbox: {
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: Colors.secondary,
    padding:5,
    // width: '100%',
    // height: 30,
    // marginBottom:-20,
    color: 'white',
  },
  headerTitle: {color: Colors.white, fontSize: 13, fontWeight: 'bold',marginLeft:10},
 card: {
    marginVertical: 15
    // borderRadius: 15,
    // padding: 0,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,

    // elevation: 12,
  },
  pdfDetails: {
    overflow: 'hidden',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  pdfTitles: {
    textAlign: 'center',
    fontSize: 8,
    marginTop: 3,
    color: Colors.grey,
    // width: 100,
  },pdfName:{
marginTop:-20,fontSize:12,color:Colors.grey
  },pdfDate:{ 
    fontSize:12,color:Colors.grey
  },
  pdfBg: {
    height: 50,
    width: 40,
    borderRadius: 5,
    // marginHorizontal: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {marginVertical: 20, marginHorizontal: 5},
  noData: {textAlign: 'center', color: Colors.grey, marginVertical: 20},
});
