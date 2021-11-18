import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { View, Image } from 'react-native';
import theme from '../../styles/theme.json';
import util from '../../util';

import { Box, Text, Touchable} from '../../styles';

const PaymentPicker =() =>{
  return(
    <>
      <Text bold hasPadding color="dark">
        Como você gostaria de pagar?
      </Text>
      <View
      style={{paddingHorizontal: 20}}
      >
        <Touchable
        height="30px"
        rounded="5px"
        background={util.toAlpha(theme.colors.muted,5)}
        border={`0.5px solid ${util.toAlpha(theme.colors.muted,40)}`}
        align="center"
        hasPadding
        justify="space-between"
        >
          <Box>
            <Image
            sources={{
              uri:'data:image/png;base64,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'
            }}
            style={{
              width: 20,
              height: 10,
              marginRight:10,
            }}
            />
            <Text small>4152 **** **** **** 0981</Text>
          </Box>
          <Icon name="cog-outline" color={theme.colors.muted} size={20}/>
        </Touchable>
      </View>
    </>
  )
}

export default PaymentPicker;