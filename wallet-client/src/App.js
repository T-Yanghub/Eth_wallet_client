import React, { Component } from 'react';
import MnumonicToAccount from './component/MnumonicToAccount';
import AccountIndex from './component/AccountIndex';
import {Header, Container, Button} from 'semantic-ui-react';


//import logo from './logo.svg';
import './App.css';
//import axios from "axios";

class App extends Component {
    constructor(pros){
        super(pros);
        this.state={
            bool:false,
            mnemonic: "",
            address: "",
            privateKey: "",
            transferTo: "",
            balance: 0,
            transValue: 0,
            transInfo: [],
        }
    }


    componentDidMount(){

        //查看localStorage是否存在,如果有则直接恢复
        let mnemonic = localStorage.getItem("mnemonic");
        console.log(mnemonic);
        if (mnemonic){
               this.setState({
                   mnemonic:mnemonic,
                   bool:true
               });

        }
    }



//退出当前账号

existAddress=()=>{
        localStorage.removeItem("mnemonic");
        window.location.reload();
}



  render() {

        if (this.state.bool) {
            return (
                <div>
                    <br/>
                    <Container>
                    <Header as='h3' block  color={'green'} textAlign={'center'}>
                        以太坊钱包
                    </Header>
                    <AccountIndex mnemonic={this.state.mnemonic} />

                        <Button color={'red'} attached={'bottom'} onClick={this.existAddress} >退出当前地址</Button>
                    </Container>
                </div>
            );
        }else{
            return(
                <div>
                    <br/>
                    <Container>
                    <Header as='h3' block  color={'green'} textAlign={'center'}>
                        以太坊钱包
                    </Header>
                    <MnumonicToAccount />


                    </Container>

                </div>
            );
        }

  }
}

export default App;
