import {PermissionsAndroid, Share} from 'react-native';
import {jsonToCSV} from 'react-native-csv';
//import {DownloadDirectoryPath, writeFile} from 'react-native-fs';
const RNFS = require('react-native-fs');

export const searchQuery = (array, search) => {
  console.log(search);
  if (array && !array.length) {
    return;
  }
  let filterArray =
    array &&
    array.length > 0 &&
    array.filter(item => {
      return item.authors.includes(search) || item.isbn.includes(search);
    });
  return filterArray;
};

export const compareName = (a, b) => {
  // converting to uppercase to have case-insensitive comparison
  const title1 = a.title.toUpperCase();
  const title2 = b.title.toUpperCase();

  let comparison = 0;

  if (title1 > title2) {
    comparison = 1;
  } else if (title1 < title2) {
    comparison = -1;
  }
  return comparison;
};
export const exportData = async data => {
  let arr = [data];
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   var path = RNFS.DocumentDirectoryPath + '/test.txt';
      let csv = jsonToCSV(arr);
      console.log(csv, 'csvData');
      var path = RNFS.DownloadDirectoryPath + `/${data.title}.csv`;
      // write the file
      RNFS.writeFile(path, csv, 'utf8')
        .then(success => {
          alert('Data Exported Sucessfully..');
        })
        .catch(err => {
          console.log(err.message);
        });
    } else {
      console.log('denied');
    }
  } catch (err) {
    console.log(err);
  }
};

export const print = async () => {
  try {
    const result = await Share.share({
      message:
        'React Native | A framework for building native apps using React',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};
