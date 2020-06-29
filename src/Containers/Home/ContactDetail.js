import React from 'react';
import PropTypes from 'prop-types';
import {Header, ListItem, Button, Avatar, Card} from 'react-native-elements';
import {Colors, HelperStyles} from '../../Theme';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import {getNameId} from '../../Utils/Validator';
import CardView from 'react-native-cardview';

function ContactDetail(props) {
  const ContactVal = useSelector(cont => cont.contactDetail);
  console.log('contact val', ContactVal);

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={Colors.primary}
        leftComponent={{
          icon: 'chevron-left',
          color: '#fff',
          size: 40,
          onPress: () => props.navigation.goBack(),
        }}
        centerComponent={<Text style={HelperStyles.headerTitle}>Contact Details</Text>}
         rightComponent={<Text style={HelperStyles.headerTitle}>Edit</Text>}
      />

      <ScrollView bounces={true}>
        <View style={styles.content}>
          <View style={{alignItems: 'center'}}>
            <Avatar
              containerStyle={styles.avathar}
              titleStyle={styles.avthrTitle}
              rounded
              title={getNameId(ContactVal.name)}
            />
          </View>
          <Text style={styles.name}>{ContactVal.name}</Text>
          <Text style={styles.subTitle}>{ContactVal.subtitle}</Text>
          <Text style={styles.designation}>{ContactVal.designation}</Text>
<View style={{flexDirection:'row',justifyContent:'center',marginVertical:10}}>
<Button containerStyle={{borderColor:Colors.secondary,borderRadius:8,borderWidth:1,marginRight:3,backgroundColor:ContactVal.myTeam?Colors.secondary:Colors.white}} type="outline" icon={<Icon name="star" size={10} color={!ContactVal.myTeam?Colors.secondary:Colors.white}/>}/>

<Button containerStyle={{borderColor:Colors.secondary,borderRadius:8,borderWidth:1,marginLeft:3,backgroundColor:ContactVal.myTeam?Colors.secondary:Colors.white}} type="outline" icon={<Icon name="users" size={10} color={!ContactVal.myTeam?Colors.secondary:Colors.white}/>}/>
  
</View>


          <CustomFlatList
            title="Business Cards"
            items={ContactVal.businessCards}
            id={ContactVal.id}
          />
          <CustomFlatList
            title="Quotations"
            items={ContactVal.quotations}
            id={ContactVal.id}
          />
          <CustomFlatList
            title="Invoice"
            items={ContactVal.invoices}
            id={ContactVal.id}
          />
          <CustomFlatList
            title="Documents"
            items={ContactVal.documents}
            id={ContactVal.id}
          />
         
        </View>
      </ScrollView>
    </View>
  );
}

ContactDetail.propTypes = {};
const styles = StyleSheet.create({
  avthrTitle: {
    fontSize: 36,fontWeight:"bold"
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
  designation: {marginBottom: 5, textAlign: 'center',color:Colors.grey,fontSize:14,marginTop:-3},
  pdfBg: {
    height: 50,
    width: 40,
    borderRadius: 5,
    // marginHorizontal: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 100,
    height: 200,
    resizeMode: 'contain',
  },
  container: {
     backgroundColor:Colors.white,height:'100%'
  },
  imageBg: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
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
  avathar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
  },
  content: {marginTop: 30, marginBottom: 120},
  name: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',marginTop:5
    // margin: 5,
    // marginTop: 5,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',marginTop:-3
  },
  card: {
    margin: 15
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
  flatList: {marginVertical: 0, marginHorizontal: 0},
  noData: {textAlign: 'center', color: Colors.grey, marginVertical: 20},
});

export default ContactDetail;

function CustomFlatList({title, items, id}) {
  const onImageTap = async item => {
    console.log('lll', item);

    await FileViewer.open(
      RNFS.DocumentDirectoryPath + '/dbcFiles/' + id + '_' + item,
    );
  };
  const shareDBSFile = name => {
    Share.open({
      url: `file://${RNFS.DocumentDirectoryPath + '/dbcFiles/' + name}`,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };
  return (
    <View style={styles.card}>
      <ListItem
        onPress={() => shareDBSFile(title)}
         containerStyle={styles.header}
        // contentContainerStyle={styles.header}
        titleStyle={styles.headerTitle}
        title={title}
        // leftAvatar={
        //   <Icon
        //     name={title === 'Business Cards' ? 'id-card' : 'file-text'}
        //     size={15}
        //     color={Colors.white}
        //   />
        // }
        // rightAvatar={<Icon name={'share'} size={15} color={Colors.white} />}
      />
      {items.length === 0 ? (
        <></>
        // <Text style={styles.noData}>No data</Text>
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
            onPress={() => onImageTap(item)}
            title={item}
            titleStyle={styles.pdfName}
            subtitle={"20/05/2020"}
            subtitleStyle={styles.pdfDate}
            rightAvatar={<><Icon name={'bell'} size={10} color={Colors.grey} />
            <Text style={{fontSize:10,color:Colors.grey,marginLeft:3}}>Reminder</Text></>}
            leftAvatar={
              <View style={{flexDirection:'column'}}>
              <Image style={styles.pdfBg} source={require('../../Assets/pdfIcon.jpeg')}/>
              <Text style={styles.pdfTitles}>{"DBC PDF"}</Text>
              </View>
            }
              bottomDivider
          />

            // <TouchableOpacity
            //   style={styles.pdfDetails}
            //   onPress={() => onImageTap(item)}>
            //   <View style={styles.pdfBg}>
            //     <Image style={styles.pdfBg} source={require('../../Assets/pdfIcon.jpeg')}/>
            //     {/* <Icon name="file-pdf-o" size={70} color="white" /> */}
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
