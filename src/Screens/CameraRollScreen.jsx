import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { View, StyleSheet, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import { photoExifData } from '../atoms/PhotoData';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const PHOTO = '@photo';

const AddPage = () => {
  const [photoUri, setPhotoUri] = useState(null);
  const [photoExif, setPhotoExif] = useRecoilState(photoExifData);

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
    }
    console.log(result.exif);
  };

  ////////////Exif/////////////
  // 撮影時刻 DateTimeOriginal
  // 緯度 GPSLatitude
  // GPS緯度参照(北緯・南緯) GPSLatitudeRef
  // 経度 GPSLongitude
  // GPS経度参照(東経・西経) GPSLongitudeRef
  // 画像の向き GPSImgDirection
  // 画像の経度参照 GPSImgDirectionRef
  // ↑'T'は真方位、'M'は磁気方位
  /////////////////////////////

  const LocalSiderealTimeCalc = () => {
    const originDate = photoExif.DateTimeOriginal;
    const dateReplace = originDate.replace(':', '/').replace(':', '/');
    const date = new Date(dateReplace);

    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const D = date.getDate();

    const Hour = date.getHours();
    const Min = date.getMinutes();
    const Sec = date.getSeconds();

    const Y = () => {
      switch (currentMonth) {
        case 1:
          return currentYear - 1;
        case 2:
          return currentYear - 1;
        default:
          return currentYear;
      }
    };
    const M = () => {
      switch (currentMonth) {
        case 1:
          return 13;
        case 2:
          return 14;
        default:
          return currentMonth;
      }
    };
    const Ramda = () => {
      switch (photoExif.GPSLongitudeRef) {
        case 'E':
          return -1 * photoExif.GPSLongitude;
        case 'W':
          return photoExif.GPSLongitude;
      }
    };

    // ユリウス日
    const JD = Math.floor(Y() * 365.25) + Math.floor(Y() / 400) - Math.floor(Y() / 100) + Math.floor(30.59 * (M() - 2)) +
      D + 1721088.5 + (Hour - 9) / 24 + Min / (24 * 60) + Sec / (24 * 60 * 60);
    // ユリウス通日
    const TJD = JD - 2440000.5;
    // グリニッジ恒星時
    const GST = 24 * (0.671262 + 1.0027379094 * TJD);
    const GSTRemainder = () => {
      let x = GST;
      while (x > 24) {
        x -= 24;
      }
      return x;
    };
    // 地方恒星時
    const LST = () => {
      let x = GSTRemainder() - Ramda() / 15;
      while (x > 24) {
        x -= 24;
      }
      return x;
    };
    return LST();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
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
          flex: 1,
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
          緯度
          {photoExif === null
            ? null
            : photoExif.GPSLatitudeRef === 'N'
            ? '(北緯)'
            : photoExif.GPSLatitudeRef === 'S'
            ? '(南緯)'
            : null}
          ：
          {photoExif === null
            ? null
            : photoExif.GPSLatitude === undefined
            ? 'No Data'
            : photoExif.GPSLatitude}
        </Text>
        <Text style={{ flex: 1 }}>
          経度
          {photoExif === null
            ? null
            : photoExif.GPSLongitudeRef === 'E'
            ? '(東経)'
            : photoExif.GPSLongitudeRef === 'W'
            ? '(西経)'
            : null}
          ：
          {photoExif === null
            ? null
            : photoExif.GPSLongitude === undefined
            ? 'No Data'
            : photoExif.GPSLongitude}
        </Text>
        <Text style={{ flex: 1 }}>
          画像の向き：
          {photoExif === null
            ? null
            : photoExif.GPSImgDirection === undefined
            ? 'No Data'
            : photoExif.GPSImgDirection}
        </Text>
        <Text style={{ flex: 1 }}>
          地方恒星時：
          {photoExif === null ? null : LocalSiderealTimeCalc()}
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
