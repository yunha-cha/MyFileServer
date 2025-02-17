import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // 기본 테마
import './QuillEditor.css';

import api from "../../common/api";

const QuillEditor = ({newForum, setNewForum}) => {


  // const [content, setContent] = useState();
  const quillRef = useRef(null);




  const modules = {
    toolbar: [

      [{ header: [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block', 'image'],
      [{ color: [] }, { align: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
    ],
  }



  useEffect(() => {

    const handleImage = ()=> {

      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        
        const file = input.files[0];
        // const {getEditor} = quillRef.current;
        const range = quillRef.current.getEditor().getSelection(true);

        try {
          const {data} = await api.post('/forum/image', {file:file}); 
          const url = `https://www.seopia.online/download/${data}`;
          // const url = `http://localhost:8080/download/${data}`;
          quillRef.current.getEditor().insertEmbed(range.index, "image", url);
          quillRef.current.insertText(range.index + 1, "\n");
          quillRef.current.setSelection(range.index + 2);
        } catch (e) {
          console.log(e);
          
        }
      };
    }

    if(quillRef.current){
        
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);

    }
  }, [])





    return (
      <div style={{cursor:'text'}} onClick={()=>{quillRef.current.focus()}}>
      <ReactQuill
      style={{ overflowY: "unset" }}
      modules={modules}
      ref={quillRef}
      onChange={(value) => setNewForum((prev) => ({
          ...prev,
          content: value
      }))}
      value={newForum.content}
      placeholder="작성해보세요 아무렇게나"
      />
      </div>
    );

}

export default QuillEditor;
