import { useState } from 'react';
import styles from './app.module.css';
import { chess_figures } from './data';

function App() {

  const [items, setItems] = useState(chess_figures)
  const [currentItem, setCurrentItem] = useState(null)
  const pulled = items.filter(item => item.position!==null)

  let file = new File([JSON.stringify(items)], "file.txt", {
      type: "text/plain",
      });

  const sortItems = (a, b) => {
    if (a.position > b.position) {return 1}
    else {return -1}
  }

  function dragStartHandler(e, card){
    setCurrentItem(card)
  }

  function dragOverHandler(e){
    e.preventDefault()
  }

  function dragDropHandler(e, card){
    e.preventDefault()
    e.stopPropagation()
    if (currentItem.position === null) {
      const targetPosition = card.position
      setItems(items.map(item => {
        if (item.id === card.id) {item.position = null; return item}
        else if (item.id === currentItem.id) {item.position = targetPosition; return item}
        else return item
      }))
    }
    else {
      const targetPosition = card.position
      const itemPosition = currentItem.position
      setItems(items.map(item => {
        if (item.id === card.id) {item.position = itemPosition; return item}
        else if (item.id === currentItem.id) {item.position = targetPosition; return item}
        else return item
      }))
    }
  }

  function boardDragOverHandler (e) {
    e.preventDefault()
  }

  function boardDragDropHandler (e, item) {
    e.preventDefault()
    if (pulled.length===0) {
      setItems(items.map(item => {if (item.id === currentItem.id) {item.position = 0; return item} else return item}))
    }
    else {
      setItems(items.map(item => {if (item.id === currentItem.id) {item.position = pulled.length; return item} else return item}))
    }
  }

  function returnDragOverHandler (e) {
    e.preventDefault()
  }

  function returnDragDropHandler (e) {
    e.preventDefault()
    setItems(items.map(item => {if (item.id === currentItem.id) {item.position = null; return item} else return item}))
  }


  function showFile(file) {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function() {
      setItems(JSON.parse(reader.result))
    };
  }

  return (
    <div className={styles.App}>
      <div 
        className={styles.items_wrapper}
        onDragOver={(e)=> returnDragOverHandler(e)}
        onDrop={(e)=> returnDragDropHandler(e)}>
        {items.filter(item => item.position===null).map((item) => {
          return (
          <div
            className={styles.item}
            key={item.id}
            onDragStart={(e)=> dragStartHandler(e, item)}
            draggable={true}>
          <img width={50} height={50} src={item.url}/>
        </div>
        )})}
      </div>
      <div className={styles.board}           
        onDragOver={(e)=> boardDragOverHandler(e)}
        onDrop={(e)=> boardDragDropHandler(e)}>
        <div className={styles.items_wrapper_bot}>
        {pulled.sort(sortItems).map((item) => {
          return (
          <div
            key={item.id}
            onDragStart={(e)=> dragStartHandler(e, item)}
            onDragOver={(e)=> dragOverHandler(e, item)}
            onDrop={(e)=> dragDropHandler(e, item)}
            draggable={true}>
            <img className={styles.item} width={50} height={50}  src={item.url}/>
          </div>
        )})}
        </div>
      </div>
      <div className={styles.buttons_wrapper}>
        <a download={file.name} href={URL.createObjectURL(file)}>Download preset</a>
        <div className={styles.input_wrapper}>
          <label for="file-upload" className={styles.custominput}>
              Upload preset
          </label>
          <input id="file-upload" type="file" onChange={(e)=> showFile(e.target.files[0])}/>
        </div>
      </div>
    </div>
  );
}

export default App;
