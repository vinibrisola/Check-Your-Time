import React, {useEffect}from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import {Dimensions} from 'react-native';
import ModalHeader from './header';
import Resume from './resume';
import DateTimePicker from './dateTime';
import EspecialistaPicker from './Especialistas'
import EspecialistasModal from './Especialistas/modal'
import PaymentPicker from './payment';
import { ScrollView } from 'react-native-gesture-handler';
import { Box, Button, Touchable, Title, Text} from '../../styles'
import { useSelector, useDispatch } from 'react-redux';
import util from '../../util';
import { saveAgendamento, updateForm } from '../../store/modules/salao/actions'
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import theme from '../../styles/theme.json';



const ModalAgendamento = () => {
  const dispatch = useDispatch();
  const { form, agendamento, servicos, agenda, colaboradores} = useSelector((state) => state.salao);
  
  const dataSelecionada = moment(agendamento.data).format('YYYY-MM-DD');
  const horaSelecionada = moment(agendamento.data).format('HH:mm');
  const { horariosDisponiveis, colaboradoresDia } = util.selectAgendamento(agenda, dataSelecionada, agendamento.colaboradorId);
  
  const sheetRef = React.useRef(null);
  const servico = servicos.filter((s) => s._id === agendamento.servicoId)[0];

  const setSnap = (snapIndex) => {
    sheetRef.current.snapTo(snapIndex);
  }
  useEffect(() => {
    if(form.modalAgendamento){
      setSnap(form.modalAgendamento);
    }
  }, [form.modalAgendamento])

  return(
    <BottomSheet
      ref={sheetRef}
      initialSnap={0}
      snapPoints={[0,70, Dimensions.get('window').height - 30]}
      renderContent={() => (
        <>
          <ScrollView 
            stickyHeaderIndices={[0]}
            style={{ backgroundColor:"#fff", height:'100%' }}>
            <ModalHeader/>
            <Resume servico={servico}/>
            {agenda.length > 0 && 
            <>
              <DateTimePicker
              servico={servico}
              agenda={agenda}
              dataSelecionada={dataSelecionada}
              horaSelecionada={horaSelecionada}
              horariosDisponiveis={horariosDisponiveis}

            />
            <EspecialistaPicker
              colaboradores={colaboradores}
              agendamento={agendamento}
            />
            <PaymentPicker/>
            <Box hasPadding>
             <Touchable onPress={() => dispatch(saveAgendamento())}>
              <Button
                loading={form.agendamentoLoading}
                disabled={form.agendamentoLoading}
                icon="check"
                background="primary"
                mode="contained"
                block
                
                uppercase={false}>
                  Confirmar meu Agendamento
                </Button>
             </Touchable>
            </Box>
            </>}
              {agenda.length === 0 && (
                <Box 
                height={Dimensions.get('window').height - 200}
                background="light"
                direction="column" 
                hasPadding 
                justify="center" 
                align="center">
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Title align="center">Só um instante...</Title>
                  <Text small align="center">Estams buscando o melhor horário para você...</Text>
                </Box>
              )}
          </ScrollView>
          <EspecialistasModal
            form={form}
            colaboradores={colaboradores}
            agendamento={agendamento}
            servicos={servicos}
            horaSelecionada={horaSelecionada}
            colaboradoresDia={colaboradoresDia}
          />
        </>
      )}
    />
  );
};

export default ModalAgendamento;