import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd'; //esta biblioteca ja possui hooks

import BoardContext from '../Board/context'

import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item:{ type: 'CARD', index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetlistIndex = listIndex;


      const draggedIndex = item.index;
      const targetIndex = index;
      
      if(draggedIndex === targetIndex && draggedListIndex === targetlistIndex) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect(); //função para obter o tamanho do elemento
      //console.log(targetSize);
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      
      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if(draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if(draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move( draggedListIndex, targetlistIndex, draggedIndex, targetIndex );

      item.index = targetIndex;
      item.listIndex = targetlistIndex;

      /* 
        console.log(item.index, index)
        console.log(item.id); //card selecionado
        console.log(data.id); //card que recebe o arrastar
      */
    }
  })

  dragRef(dropRef(ref));

  return (
      <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header>
      <p>{data.content}</p>
      { data.user && <img src={data.user} alt="" />}
    </Container>
  );
}
