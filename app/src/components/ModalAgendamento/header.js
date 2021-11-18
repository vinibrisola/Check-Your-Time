import React from 'react';
import { Touchable, GradientView, Text, Spacer,Box } from '../../styles/index'
import { View, StyleSheet } from 'react-native';
import theme from '../../styles/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ModalHeader= () => {
  return(
    <View style={styles.headerContainer}>
      <GradientView
        colors={[theme.colors.dark, theme.colors.primary]}
        start={{ x: 0 , y: 0}}
        end={{ x: 1,y: 0}}
      >
        <Box>
          <Touchable hasPadding>
            <Icon name="chevron-left" size={30} color={theme.colors.light}/>
            <View style={{marginLeft: 20}}>
              <Text color="light">Finalizar Agendamento</Text>
              <Spacer size="3px"/>
              <Text small color="light">Horário, pagamento e especialista.</Text>
            </View>
          </Touchable>
        </Box>
      </GradientView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer:{
    width:'100%',
    height:70,
  },
});

export default ModalHeader;