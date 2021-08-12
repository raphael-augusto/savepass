import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);
  const dataKey = '@savepass:logins';
  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    
    const response = await AsyncStorage.getItem(dataKey);
    const parseData = response ? JSON.parse(response) : [];

    setSearchListData(parseData);
    setData(parseData); 
    
  }

  function handleFilterLoginData() {
    // Filter results inside data, save with setSearchListData
    const filteedData = searchListData.filter(data => {
      const validadedData = data.service_name.toLocaleUpperCase().includes(searchText.toLocaleUpperCase())

      if (validadedData) return data;

    });

    setSearchListData(filteedData);
  }

  function handleChangeInputText(text: string) {
    // Update searchText value
    if (!text) setSearchListData(data);
    
    setSearchText(text);
  }

  useFocusEffect(useCallback(() => {
    loadData();
    /**** removeAll AsyncStorage  ****/
    //   async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey);
    // }
    // removeAll();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}