import React, {useEffect}  from 'react';
import {FlatList} from 'react-native';
import theme from '../../styles/theme.json'
import util from '../../util';
import { useDispatch, useSelector } from 'react-redux';
import { } from '../../store/modules/salao/actions';

const Menu = () =>{
  
 
  
  return (
    <>
      <FlatList 
        style={{ backgroundColor:util.toAlpha(theme.colors.muted, 10)}}
        ListHeaderComponent={Header} 
        data={finalServicos}
        renderItem={({item}) => <Servico servico={item} key={item._id}/>}
        keyExtractor={(item) => item._id}
      />
      s
    </>
  );
};

export default Menu;