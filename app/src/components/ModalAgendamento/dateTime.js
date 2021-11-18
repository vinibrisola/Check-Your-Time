import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Box, Title, Text, Touchable } from '../../styles'
import util from '../../util';
import theme from '../../styles/theme.json';
import { useDispatch } from 'react-redux';
import { updateAgendamento } from '../../store/modules/salao/actions'
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');

const DateTime = ({ servico, agenda, dataSelecionada,horaSelecionada,horariosDisponiveis }) =>{
  
  const dispatch = useDispatch();

  const setAgendamento = (value, isTime = false) => {
    const { horariosDisponiveis } = util.selectAgendamento(agenda, isTime ? dataSelecionada: value,);
    let data = !isTime ? `${value}T${horariosDisponiveis[0][0]}` : `${dataSelecionada}T${value}`;
    dispatch(updateAgendamento({ data }));
  }

  return(
    <> 
      <Text bold color ="dark" hasPadding
      >Para quando voce gostaria de agendar?</Text>
      <FlatList
        data={agenda}
        horizontal
        contentContainerStyle={{
          paddingLeft: 20,
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item)=> item}
        renderItem={({ item }) => {
          const date = moment(Object.keys(item)[0]);
          const dateISO = moment(date).format('YYYY-MM-DD');
          const selected = dateISO === dataSelecionada;
          return (
          <Touchable
            key={dateISO}
            width="70px"
            height="80px"
            spacing="0 10px 0 0"
            rounded="10px"
            direction="column"
            justify="center"
            align="center"
            border={`1px solid ${selected ? theme.colors.primary : util.toAlpha(theme.colors.muted,20)}`}
            background={selected ? 'primary' : 'light'}
            onPress={() => setAgendamento(dateISO)}
          >
            <Text small color={selected ? "light" : undefined}>{util.diasSemana[date.day()]}</Text>
            <Title small color={selected ? "light" : undefined}>{date.format('DD')}</Title>
            <Text small color={selected ? "light" : undefined}>{date.format('MMMM')}</Text>
          </Touchable>
          );
        }}
      />

      <Text bold color="dark" hasPadding>
        Que horas?
      </Text>
      <FlatList
        data={horariosDisponiveis}
        horizontal
        showsHorizontalScrollIndicator={false}
        constentContainerStyle={{
            paddingLeft: 20,
            height: 80,
        }}
        style={{
          flexGrow: 0,
        }}
        renderItem={({item}) => (
          <Box direction="column" spacing="0 0 0 18px">
          {item.map((horario) => {
            const selected = horario === horaSelecionada;
            
            return(
              <Touchable
              key={horario}
              width="100px"
              height="35px"
              spacing="0 0 5px 0"
              background={selected ? 'primary' : 'light'}
              rounded="7px"
              justify="center"
              align="center"
              has
              border={`1px solid ${selected ? theme.colors.primary : util.toAlpha(theme.colors.muted, 20)}`}
              onPress={() => setAgendamento(horario, true)}
            >
              <Text color={selected ? "light" : undefined}>{horario}</Text>
              </Touchable>
              )
            })
          }
          </Box>
        )}
      />
    </>
  );
}

export default DateTime;