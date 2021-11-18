import React from 'react';
import { Text, Title, Spacer, Box, Cover } from '../../styles'
import theme from '../../styles/theme.json';
import util from '../../util';
import consts from '../../consts';


const Resume = ({ servico }) => {
  
  return(
    <Box align="center" hasPadding background={util.toAlpha(theme.colors.muted, 5)}>
      <Cover
        Width="80px"
        height="80px"
        image={`${consts.bucketUrl}/${servico?.arquivos[0]?.caminho}`}
      />
      <Box direction="column">
        <Title small>{servico?.titulo}</Title>
        <Spacer size="4px"/>
        <Text small>Total: R$ {servico?.preco}</Text>

      </Box>  
    </Box>
  )


}

export default Resume;