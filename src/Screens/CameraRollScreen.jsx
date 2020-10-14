import React from 'react';

import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Text,
  AsyncStorage,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const PHOTO = '@photo';

export default class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: 'null',
    };
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const Photo = await AsyncStorage.getItem(PHOTO);
      if (Photo) {
        const photo = JSON.parse(Photo);
        this.setState({ photo: photo });
      }
    } catch (e) {
      console.log(e);
    }
  };

  onSave = async photo => {
    try {
      const Photo = JSON.stringify(photo);
      await AsyncStorage.setItem(PHOTO, Photo);
    } catch (e) {
      console.log(e);
    }
  };

  delete = () => {
    this.setState({ photo: 'default' });
    this.onSave('default');
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync(
        Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  pickImage = async item => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({ photo: result.uri });
      this.onSave(result.uri);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.state.photo == 'default' ? (
            <View style={styles.imageView}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 45,
                  fontWeight: 'bold',
                  fontFamily: 'Baskerville-Bold',
                }}
              >
                No Image
              </Text>
            </View>
          ) : (
            <Image source={{ uri: this.state.photo }} style={styles.imageView} />
          )}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableHighlight
            style={[
              styles.text,
              { marginRight: 30, backgroundColor: 'hsla(0, 90%, 55%, 0.6)' },
            ]}
            activeOpacity={0.6}
            underlayColor='hsla(0, 90%, 40%, 0.8)'
            onPress={() => this.delete()}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>削除</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={[
              styles.text,
              { marginLeft: 30, backgroundColor: 'hsla(210, 90%, 55%, 0.6)' },
            ]}
            activeOpacity={0.6}
            underlayColor='hsla(210, 90%, 40%, 0.8)'
            onPress={() => this.pickImage()}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>追加</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageView: {
    width: 300,
    height: 300,
    // width: '80%',
    // height: '80%',
    marginTop: 50,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 140,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.6,
  },
});
