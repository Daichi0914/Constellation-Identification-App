import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const PHOTO = '@photo';

const AddPage = () => {
  const [photoUri, setPhotoUri] = useState(null);
  const [photoExif, setPhotoExif] = useState(null);

  useEffect(() => {
    getPermissionAsync();
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      const Photo = await AsyncStorage.getItem(PHOTO);
      if (Photo) {
        const photo = JSON.parse(Photo);
        setPhotoUri(photo);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSave = async photo => {
    try {
      console.log(PHOTO);
      // const Photo = JSON.stringify(photo);
      const Photo = photo;
      await AsyncStorage.setItem(PHOTO, Photo);
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = () => {
    setPhotoUri(null);
    setPhotoExif(null);
    onSave(null);
  };

  // ユーザーの写真にアクセスするためのアクセス許可を付与するようにユーザーに要求
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync(
        Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // カメラロールから画像またはビデオを選択するためのシステムUIを表示
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 画像のみ
      allowsEditing: true, // トリミング
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });
    if (!result.cancelled) {
      setPhotoUri(result.uri);
      setPhotoExif(result.exif);
      onSave(result.uri);
      console.log(result.exif);
      console.log(result.exif);
    }
  };

  ////////////Exif/////////////
  // 撮影時刻 DateTimeOriginal
  // 緯度 GPSLatitude
  // 経度 GPSLongitude
  /////////////////////////////

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
        {photoUri == null ? (
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
          <Image source={{ uri: photoUri }} style={styles.imageView} />
        )}
      </View>

      <View
        style={{
          flex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          onPress={() => onDelete()}
          buttonStyle={[
            styles.text,
            { marginRight: 30, backgroundColor: 'hsla(0, 90%, 55%, 0.6)' },
          ]}
          title='削除'
          titleStyle={{ color: 'white', fontSize: 24 }}
        />
        <Button
          onPress={() => pickImage()}
          buttonStyle={[
            styles.text,
            { marginLeft: 30, backgroundColor: 'hsla(210, 90%, 55%, 0.6)' },
          ]}
          title='追加'
          titleStyle={{ color: 'white', fontSize: 24 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>
          撮影時刻：
          {photoExif === null
            ? null
            : photoExif.DateTimeOriginal === undefined
            ? 'データなし'
            : photoExif.DateTimeOriginal}
        </Text>
        <Text style={{ flex: 1 }}>
          緯度：
          {photoExif === null
            ? null
            : photoExif.GPSLatitude === undefined
            ? 'No Data'
            : photoExif.GPSLatitude}
        </Text>
        <Text style={{ flex: 1 }}>
          経度：
          {photoExif === null
            ? null
            : photoExif.GPSLongitude === undefined
            ? 'No Data'
            : photoExif.GPSLongitude}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    width: 300,
    height: 300,
    marginTop: 50,
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

export default AddPage;
