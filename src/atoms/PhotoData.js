import { atom, selector } from 'recoil';

// Exif
export const photoExifData = atom({
  key: 'photoExifData',
  default: null,
});

// // 地方恒星時計算
// export const LocalSiderealTimeCalcData = selector({
//   key: 'LocalSiderealTimeData',
//   get: ({ get }) => {
//     const exif = get(photoExifData);

//     switch (exif) {
//       case exif.DateTimeOriginal && exif.GPSLatitude && exif.GPSLongitude:
//         return ;
//       // case 'GPSLatitude':
//       //   return exif.GPSLatitude;
//       // case 'GPSLongitude':
//       //   return exif.GPSLongitude;
//       // default:
//       //   return 'データが足りません';
//     }
//   },
// });
