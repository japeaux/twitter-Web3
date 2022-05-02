const hre = require("hardhat");

// async function main() {
//   const ProfileImageMinterFactory = await hre.ethers.getContractFactory("ProfileImageNfts");
//   const profileImageContract = await ProfileImageMinterFactory.deploy();

//   await profileImageContract.deployed();

//   console.log("Profile Iamge Minter Contract deployed to:", profileImageContract.address);
// }

// ;async ()=>{
//   try{
//     await main()
//   } catch (error){
//     console.error(error)
//     process.exit(1)
//   }
// }


const main = async () => {
  const profileImageFactory = await hre.ethers.getContractFactory(
    'ProfileImageNfts',
  )
  const profileImageContract = await profileImageFactory.deploy()

  await profileImageContract.deployed()

  console.log('Profile Image Minter deployed to:', profileImageContract.address)
}

;(async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()

