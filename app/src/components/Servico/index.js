import React from 'react';
import { Text, Box, Touchable, Cover,Title,Button} from '../../styles';
import moment from 'moment';
import consts from '../../consts';

import { useDispatch } from 'react-redux';
import { updateAgendamento, filterAgenda } from '../../store/modules/salao/actions'
const Servico = ({ servico }) =>{

  const dispatch = useDispatch();

  return (
    <Touchable 
      height="100px"
      hasPadding
      align="center" 
      background="light"
      onPress={() => {dispatch(updateAgendamento({servicoId: servico._id}));
      dispatch(filterAgenda());
    }}
      >
      <Cover image={`${consts.bucketUrl}/${servico?.arquivos[0]?.caminho}`}/>
      <Box direction="column">
        <Text bold color="dark">{servico?.titulo}</Text>
        <Text small>R$ {servico?.preco} - {moment(servico?.duracao).format('HH:mm')} mins</Text>
      </Box>
      <Box>
        <Button icon="clock-check-outline" background="success" mode="contained">AGENDAR</Button>
      </Box> 
    </Touchable>

  );
}

export default Servico;