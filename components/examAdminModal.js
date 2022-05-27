/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import react, {useEffect, useState, version} from 'react'

export default function ExamAdminModal (props) {
    const { show, onHide, cols, handleUpdate, handleInsert, action } = props
      const [files, setFiles] = useState();
      const [images, setImages] = useState();
      const [fileName, setFileName] = useState('圖片上傳');
      const [validated, setValidated] = useState(false);
      let title = '修改';

      if(action === 'insert'){
        title = '新增'
      }
    
      const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          setFiles(file)
          setImages(reader.result)
          setFileName(file.name)
        };
      }

      const cancelImage = () => {
        setFiles();
        setImages();
        setFileName('圖片上傳');
      }

      const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }
        
        setValidated(true);
        if(action === 'insert') {
            handleInsert(files)
           
        }else{
            handleUpdate(files)
        }
      };
    
    
      const inputType = (v, action) => {
        switch (v.type) {
          case 'select':
                return(
                <Form.Control as="select" placeholder="" defaultValue={v.value} name={v.id} >
                    {Object.keys(v.option).map((k,i)=> (<option key={i} value={k}>{v.option[k]}</option>))}
                </Form.Control>)
            break
          case 'file':
                return(<><Form.File 
                  id="image-file"
                  label={fileName}
                  custom
                  onChange={handleImageChange}
                />
                {action === 'insert' ?
                <img src={images} style={{maxHeight:300, margin:5}}></img>
                :
                <img src={images ? images : `${v.value}`} style={{maxHeight:300, margin:5}}></img>
                }
              
                {files ? <Button onClick={cancelImage}>取消上傳圖片</Button> : null}
                </>)
            break
          default: 
          {
              if(v.hidden){
                return (<input type='password' style={{display:'none'}} />)
              }else{
                if (action === 'insert') {
                  return (<Form.Control type={v.type} required={v.required} placeholder={v.placeholder} readOnly={v.readOnly} name={v.id} />)
                }
                return (<Form.Control type={v.type} required={v.required} placeholder={v.placeholder} defaultValue={v.value} readOnly={v.readOnly} name={v.id} />) 
              }
               
          }
           
        }
      }
  
      return (
        <Modal
          show={show} 
          onHide={onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onShow={()=> cancelImage()}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {title}
            </Modal.Title>
          </Modal.Header>
          <Form validated={validated} onSubmit={handleSubmit}>
          <Modal.Body style={{marginLeft:"60px", maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
             {cols && cols.map((v,i) => (
                <Form.Group key={`examForm${i}`} as={Row}>
                  <Form.Label column sm={2}>
                    {v.text}
                  </Form.Label>
                  <Col sm={8}>
                    {inputType(v, action)}
                  </Col>
                </Form.Group>
             ))}
           
          </Modal.Body>
          <Modal.Footer>
            {action === "insert" 
            ?
            <Button variant='success' type='submit'>新增</Button>
            :
            <Button variant='warning' type='submit'>修改</Button>
            }
          </Modal.Footer>
          </Form>
        </Modal>
      );
}
  