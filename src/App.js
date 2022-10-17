import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Share,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {jsonToCSV, readRemoteFile} from 'react-native-csv';
import {AppColors} from './utility/AppColors';
import {exportData, print, searchQuery} from './utility/helper';

const App = () => {
  const [booksData, setBooksData] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [magazinesData, setMagazinesData] = useState([]);
  const [searchedMagazines, setSearchedMagazines] = useState([]);
  const [bookState, setBookState] = useState(true);
  const [magazineState, setMagazineState] = useState(false);
  const [bookInput, setBookInput] = useState('');
  const [magazineInput, setMagazineInput] = useState('');

  const searchBooks = () => {
    let filter = searchQuery(
      booksData.filter(item => item.title != ''),
      bookInput,
    );
    console.log(filter, 'filter');
    setSearchedBooks(filter);
  };
  const searchMagazine = () => {
    let filter = searchQuery(
      magazinesData.filter(item => item.title != ''),
      magazineInput,
    );
    console.log(filter, 'filter');
    setSearchedMagazines(filter);
  };

  useEffect(() => {
    readRemoteFile(
      'https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv',
      {
        header: true,
        complete: results => {
          setBooksData(results.data);
        },
      },
    );
    readRemoteFile(
      'https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv',
      {
        header: true,
        complete: results => {
          setMagazinesData(results.data);
        },
      },
    );
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="dark-content" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: '5%',
          marginTop: '5%',
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setBookState(true);
            setMagazineState(false);
          }}
          style={[
            styles.button,
            {
              borderColor: AppColors.secondary,
              backgroundColor: bookState
                ? AppColors.secondary
                : AppColors.primary,
            },
          ]}>
          <Text
            style={{
              fontSize: 18,
              color: bookState ? AppColors.primary : AppColors.secondary,
            }}>
            Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setMagazineState(true);
            setBookState(false);
          }}
          style={[
            styles.button,
            {
              borderColor: AppColors.secondary,
              backgroundColor: magazineState
                ? AppColors.secondary
                : AppColors.primary,
            },
          ]}>
          <Text
            style={{
              fontSize: 18,
              color: magazineState ? AppColors.primary : AppColors.secondary,
            }}>
            Magazines
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {bookState && (
          <View style={styles.mainContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: '5%',
              }}>
              <TextInput
                placeholder="Enter ISBN or Auther"
                onChangeText={t => {
                  if (t.length > 0) {
                    setSearchedBooks(booksData);
                  }
                  setBookInput(t);
                }}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={searchBooks}
                style={styles.searchBtn}>
                <Text
                  style={{
                    fontSize: 18,
                    color: AppColors.primary,
                  }}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
            {bookInput.length == 0 ? (
              <View style={{height: '90%'}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={booksData.filter(item => item.title != '')}
                  keyExtractor={(item, index) => index}
                  renderItem={({item, index}) => (
                    <View style={styles.list}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.desc}>{item.description}</Text>
                      <View style={styles.auther}>
                        <Text
                          style={{
                            color: AppColors.secondary,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          Author :
                        </Text>
                        <Text style={{width: '90%'}}> {item.authors}</Text>
                      </View>
                      <View style={styles.auther}>
                        <Text
                          style={{
                            color: AppColors.secondary,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          ISBN :
                        </Text>
                        <Text style={{width: '90%'}}> {item.isbn}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => exportData(item)}
                        activeOpacity={0.7}
                        style={styles.export}>
                        <Text style={{color: AppColors.primary}}>Export</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View>
                {searchedBooks.length > 0 ? (
                  <View style={{height: '90%'}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={searchedBooks.filter(item => item.title != '')}
                      keyExtractor={(item, index) => index}
                      renderItem={({item, index}) => (
                        <View style={styles.list}>
                          <Text style={styles.title}>{item.title}</Text>
                          <Text style={styles.desc}>{item.description}</Text>
                          <View style={styles.auther}>
                            <Text
                              style={{
                                color: AppColors.secondary,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              Author :
                            </Text>
                            <Text style={{width: '90%'}}> {item.authors}</Text>
                          </View>
                          <View style={styles.auther}>
                            <Text
                              style={{
                                color: AppColors.secondary,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              ISBN :
                            </Text>
                            <Text style={{width: '90%'}}> {item.isbn}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => exportData(item)}
                            activeOpacity={0.7}
                            style={styles.export}>
                            <Text style={{color: AppColors.primary}}>
                              Export
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: '90%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Books Not Found!!</Text>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity activeOpacity={0.7} style={styles.printBtn}>
              <Image
                style={{width: 70, height: 70, tintColor: 'white'}}
                source={require('./assets/images/print.png')}
              />
            </TouchableOpacity>
          </View>
        )}
        {magazineState && (
          <View style={styles.mainContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: '5%',
              }}>
              <TextInput
                placeholder="Enter ISBN or Auther"
                onChangeText={t => {
                  if (t.length > 0) {
                    setSearchedMagazines(magazinesData);
                  }
                  setMagazineInput(t);
                }}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={searchMagazine}
                style={styles.searchBtn}>
                <Text
                  style={{
                    fontSize: 18,
                    color: AppColors.primary,
                  }}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
            {magazineInput.length == 0 ? (
              <View style={{height: '90%'}}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={magazinesData.filter(item => item.title != '')}
                  keyExtractor={(item, index) => index}
                  renderItem={({item, index}) => (
                    <View style={styles.list}>
                      <Text style={styles.title}>{item.title}</Text>
                      <View style={styles.auther}>
                        <Text
                          style={{
                            color: AppColors.secondary,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          Author :
                        </Text>
                        <Text style={{width: '90%'}}> {item.authors}</Text>
                      </View>
                      <View style={styles.auther}>
                        <Text
                          style={{
                            color: AppColors.secondary,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          ISBN :
                        </Text>
                        <Text style={{width: '90%'}}> {item.isbn}</Text>
                      </View>
                      <View style={styles.auther}>
                        <Text
                          style={{
                            color: AppColors.secondary,
                            fontSize: 16,
                            fontWeight: '500',
                          }}>
                          PublishedAt :
                        </Text>
                        <Text style={{width: '90%'}}> {item.publishedAt}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => exportData(item)}
                        activeOpacity={0.7}
                        style={styles.export}>
                        <Text style={{color: AppColors.primary}}>Export</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View>
                {searchedMagazines.length > 0 ? (
                  <View style={{height: '90%'}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={searchedMagazines.filter(item => item.title != '')}
                      keyExtractor={(item, index) => index}
                      renderItem={({item, index}) => (
                        <View style={styles.list}>
                          <Text style={styles.title}>{item.title}</Text>
                          <View style={styles.auther}>
                            <Text
                              style={{
                                color: AppColors.secondary,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              Author :
                            </Text>
                            <Text style={{width: '90%'}}> {item.authors}</Text>
                          </View>
                          <View style={styles.auther}>
                            <Text
                              style={{
                                color: AppColors.secondary,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              ISBN :
                            </Text>
                            <Text style={{width: '90%'}}> {item.isbn}</Text>
                          </View>
                          <View style={styles.auther}>
                            <Text
                              style={{
                                color: AppColors.secondary,
                                fontSize: 16,
                                fontWeight: '500',
                              }}>
                              PublishedAt :
                            </Text>
                            <Text style={{width: '90%'}}>
                              {' '}
                              {item.publishedAt}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => exportData(item)}
                            activeOpacity={0.7}
                            style={styles.export}>
                            <Text style={{color: AppColors.primary}}>
                              Export
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: '90%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text>Books Not Found!!</Text>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity
              onPress={() => window.print()}
              activeOpacity={0.7}
              style={styles.printBtn}>
              <Image
                style={{width: 70, height: 70, tintColor: 'white'}}
                source={require('./assets/images/print.png')}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  button: {
    borderWidth: 1,
    width: '46%',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: '3%',
  },
  mainContainer: {
    width: '100%',
    height: '95%',
    backgroundColor: AppColors.primary,
    marginTop: '2%',
  },
  list: {
    marginVertical: '3%',
    borderWidth: 1,
    borderColor: AppColors.secondary,
    borderRadius: 3,
    marginHorizontal: '3%',
    paddingHorizontal: '2%',
    paddingTop: '2%',
  },
  title: {
    color: AppColors.secondary,
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  desc: {
    color: 'gray',
    textAlign: 'center',
    marginTop: '3%',
  },
  auther: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '3%',
  },
  export: {
    backgroundColor: AppColors.secondary,
    width: '25%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '3%',
    paddingVertical: '1.5%',
    borderRadius: 6,
  },
  printBtn: {
    position: 'absolute',
    bottom: '5%',
    right: '3%',

    backgroundColor: AppColors.secondary,
    borderRadius: 50,
  },
  searchBtn: {
    backgroundColor: AppColors.secondary,
    width: '23%',
    alignItems: 'center',
    paddingVertical: '2.8%',
    marginLeft: '2%',
    borderRadius: 3,
    marginVertical: '2%',
  },
  input: {
    borderWidth: 1,
    width: '75%',
    borderRadius: 3,
    borderColor: AppColors.secondary,
    paddingVertical: '1.5%',
  },
});

export default App;
