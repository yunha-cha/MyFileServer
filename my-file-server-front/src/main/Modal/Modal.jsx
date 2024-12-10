
const Modal = ({message ,setShowModal, callBack}) => {
    const accept = async () => {
        await callBack();
        setShowModal(false);
    }
    return(
        <div style={{position:'absolute',top:0,left:0, width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'rgba(0, 0, 0, 0.486)'}}>
            <div style={{height:100,width:200,background:'rgb(192, 216, 255)',borderRadius:10,textAlign:'center'}}>
                <div style={{padding:10}}>{message}</div>
                <div style={{alignContent:'center'}}>
                <button onClick={accept} style={{padding:10,borderRadius:10,border:'none',margin:5,cursor:'pointer',width:70}}>예</button>
                <button onClick={()=>setShowModal(false)} style={{padding:10,borderRadius:10,border:'none',margin:5,cursor:'pointer',width:70}}>아니요</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;