import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import useGoogleSheetsAPI from './src/hooks/useGoogleSheetsAPI';
import usePusher from './src/hooks/usePusher';

interface Cell {
  value: string;
}

const App: React.FC = () => {
  const { data, loading, refetch } = useGoogleSheetsAPI('MVPReactNative');
  const tableContentScrollViewRef = useRef<ScrollView>(null);

  const options = {
    apiKey: "31954e7a8f0ea705174b",
    cluster: "ap2",
    onEvent: (event: any) => {
      console.log(event, 'event');
      refetch();
    }
  };

  usePusher(options, "MVPReactNative");

  const renderRow = ({ item, index }: { item: Cell[]; index: number }) => (
    <Row
      key={index}
      data={item.map((cell) => cell.value)}
      widthArr={Array(item.length).fill(80)}
      style={styles.row}
      textStyle={styles.cellText}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={styles.borderStyle}>
              <Row
                data={data[0].map((cell) => cell.value)}
                widthArr={Array(data[0].length).fill(80)}
                style={styles.header}
                textStyle={styles.headerText}
              />
            </Table>
            <ScrollView style={styles.dataWrapper} ref={tableContentScrollViewRef} scrollEventThrottle={16}>
              <Table borderStyle={styles.borderStyle}>
                {data.slice(1).map((rowData, rowIndex) => renderRow({ item: rowData, index: rowIndex }))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: '#E7E6E1',
  },
  header: {
    height: 50,
    backgroundColor: '#537791',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  cellText: {
    textAlign: 'center',
    fontWeight: '100',
  },
});

export default App;
