require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.2",
  networks:{
    rinkedby:{
      url:'https://eth-rinkeby.alchemyapi.io/v2/2rsO3kyd-NHqwU5whdwLae-VO-dgsCBe',
      accounts:[
        '89b61d7c288ad40763e99d0d2b8602a9432b56dcd3036fcd140087db8027e49c',
      ],
    },
  },
};
