import React, { Component } from 'react';
import axios from 'axios';
import { Divider,Message,Button,Form,Icon, Label, Menu, Table} from 'semantic-ui-react';
//import qs from 'qs';



class AccountIndex extends  Component{

constructor(props){
    super(props);
    this.state={
        mnemonic: this.props.mnemonic,
        address: "",
        privateKey: "",
        transferTo: "",
        balance: 0,
        transValue: 0,
        transInfo: [],
        showBalance:true,
        load:false
    }
}



    componentDidMount(){
  //  let data = {mnemonic: "increase enforce blind protect actor any catalog alter error valley weapon toward"}
//获取地址
        axios.post('http://localhost:3000/wallet/getAddress', {

            mnemonic: this.state.mnemonic
        })
            .then( (response) =>{
                console.log(response.data.data);
                this.setState({
                    address:response.data.data
                })

            })
            .catch( (error)=> {
              alert(error);
            });


  //  alert(this.state.mnemonic);
    }


//查看余额
    checkBalance=()=>{
        //获取账户余额
        axios.post('http://localhost:3000/wallet/getBalance', {

            address: this.state.address
        })
            .then( (response) =>{
                console.log(this.state.address)
                console.log(response.data.data);
                this.setState({
                    balance:response.data.data,
                    showBalance:false
                })

            })
            .catch( (error)=> {
                alert(error);
            });
    }



//转账
tranfer=()=>{
    if (!this.state.transferTo.startsWith("0x")||42!==this.state.transferTo.length||this.state.transValue<0) {
        alert("地址或者数量不合法");
        return;
    }
       this.setState({
           load:true
       });

    let flag = window.confirm('确认转账吗？')
    if(!flag){
        return;
    }
    axios.post('http://localhost:3000/wallet/tranfer', {

        to: this.state.transferTo,
        mnemonic:this.state.mnemonic,
        value:this.state.transValue
    })
        .then( (response) =>{

            //console.log(this.state.address)
            console.log(response.data.data);
            alert(JSON.stringify(response.data.data));
            this.setState({
                load:false
            });
        })
        .catch( (error)=> {
            alert(error);
            this.setState({
                load:false
            });
        });
}



//查看交易历史
checkTranferInfo=()=>{
    axios.post('http://localhost:3000/wallet/getTransactionInfomations', {

        address: this.state.address,

    })
        .then( (response) =>{
            //console.log(this.state.address)
            let infos = response.data.data
            console.log(response.data.data)
                let date = this.getLocalTime(infos[0].timeStamp);
           console.log(date);
           this.setState({
               transInfo:(response.data.data).reverse()
           })

        })
        .catch( (error)=> {
            alert(error);
        });
}




//导出私钥
    exportPrivateKey=()=>{
        axios.post('http://localhost:3000/wallet/getPrivateKey', {

            mnemonic: this.state.mnemonic
        })
            .then( (response) =>{
                console.log(this.state.address)
                console.log(response.data.data);
                this.setState({
                    privateKey:response.data.data,

                });
                alert("私钥非常重要请小心保管： "+this.state.privateKey)

            })
            .catch( (error)=> {
                alert(error);
            });
    }

//时间格式化
    getLocalTime=(nS)=>{
        return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17);
}

 //
    //输入框的change事件  --->地址输入
    onAddrChange=(e)=>{
    this.setState({
        transferTo:e.target.value
    });
    console.log(this.state.transferTo);
    }


    // ---->value输入
    onValueChange=(e)=>{
       let transValue = e.target.value * 1000000000000000000;
          this.setState({
              transValue:transValue
          });
    }


    render() {
    let transinfos = this.state.transInfo.map((trans,index)=>{
        return(
        <Table.Row key={index} >
            <Table.Cell > <Label size={'mini'}>{trans.from}</Label></Table.Cell>
            <Table.Cell><Label size={'mini'}>{trans.to}</Label></Table.Cell>
            <Table.Cell><Label size={'mini'}>{this.getLocalTime(trans.timeStamp)}</Label></Table.Cell>
            <Table.Cell><Label size={'mini'}>{trans.value/1000000000000000000}</Label></Table.Cell>
        </Table.Row>
    );
    })



        return (
            <div>
                <Divider />
                <Message size={'mini'} color={'blue'}>
                    你的地址为：
                    <br/>
                    {this.state.address}
                </Message>

                <Button color={'orange'} onClick={this.checkBalance}>查看余额</Button>
                <br/>

                <Message  hidden={this.state.showBalance} color={'blue'}>
                    账户余额：{this.state.balance/1000000000000000000}eth
                </Message>

                <br/>
                <Form>
                    <Form.Field>
                        <label>收币地址</label>
                        <input placeholder='请输入接收方的地址' value={this.state.transferTo} onChange={this.onAddrChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>转币数量（ether）</label>
                        <input placeholder='请输入需要转移的数量' onChange={this.onValueChange}/>
                    </Form.Field>

                    <Button color={'orange'} loading={this.state.load} onClick={this.tranfer}>确认转账 </Button>

                    <Button color={'orange'} toggle={true} onClick={this.checkTranferInfo}>查看交易历史 </Button>
                    <Button color={'red'}  onClick={this.exportPrivateKey} floated={'right'}>导出私钥</Button>

                    <Table celled >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>转出地址</Table.HeaderCell>
                                <Table.HeaderCell>转入地址</Table.HeaderCell>
                                <Table.HeaderCell>时间</Table.HeaderCell>
                                <Table.HeaderCell>金额(ether)</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body >
                            {transinfos}
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='4'>
                                    <Menu floated='right' pagination>
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron left' />
                                        </Menu.Item>
                                        <Menu.Item as='a'>1</Menu.Item>
                                        <Menu.Item as='a'>2</Menu.Item>
                                        <Menu.Item as='a'>3</Menu.Item>
                                        <Menu.Item as='a'>4</Menu.Item>
                                        <Menu.Item as='a' icon>
                                            <Icon name='chevron right' />
                                        </Menu.Item>
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>




                </Form>
                <br/>

                <br/>
            </div>
        );
    }
}
export default AccountIndex