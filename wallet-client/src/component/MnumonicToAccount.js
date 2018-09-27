import React, { Component } from 'react';
import bip39 from 'bip39';
import { TextArea ,Form ,Button} from 'semantic-ui-react';



class  MnumonicToAccount extends Component{

constructor(props){
    super(props);
    this.state={
        mnemonic:""
    }

}


//生成助记词
handleMnemonic=(e)=>{
    this.setState({
        mnemonic:e.target.value
    });
}


//监听输入框的变化
inputMnemonic=()=>{
    alert(this.state.mnemonic);
    localStorage.removeItem("mnemonic");
    localStorage.setItem("mnemonic",this.state.mnemonic);
    window.location.reload();
}



//生成助记词
creatMnemonic=()=>{

   let mnemonic = bip39.generateMnemonic();

    let flag = window.confirm("请保管好你的助记词不要丢失：  "+mnemonic);
    if (flag){
        localStorage.removeItem("mnemonic");
        localStorage.setItem("mnemonic",mnemonic);
        window.location.reload(true);
    }


}

    render() {
        return (
            <div>


                <br/>
                <Form>
                    <TextArea autoHeight placeholder='请输入助记词'  onChange={this.handleMnemonic}/>

                </Form>
                <br/>
                <Button onClick={this.inputMnemonic}>导入</Button>
                <Button onClick={this.creatMnemonic}>没有点击生成</Button>
            </div>
        );
    }

}
export default MnumonicToAccount