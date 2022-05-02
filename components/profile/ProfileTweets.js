import React from "react";
import Post from '../Post'
import { useContext } from "react";
import { TwitterContext } from "../../context/TwitterContext";

const style = {
    wrapper: `no-scrollbar`,
    header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
    headerTitle: `text-xl font-bold`,
  }

// const tweets = [
//     {
//         displayName:'Lucas',
//         userName: '0x606eFfCAD0f9b4DeA654343A1BB44911fC408F3B',
//         avatar: 'https://falaanimal.com.br/wp-content/uploads/2020/11/freakazoid_11112020.jpg',
//         text:'gm',
//         isProfileImageNFT: false,
//         timestamp: '2021-12-25T12:00:00.000Z'
//     },
//     {
//         displayName:'Lucas',
//         userName: '0x606eFfCAD0f9b4DeA654343A1BB44911fC408F3B',
//         avatar: 'https://falaanimal.com.br/wp-content/uploads/2020/11/freakazoid_11112020.jpg',
//         text:'Nice try',
//         isProfileImageNFT: false,
//         timestamp: '2022-04-20T12:00:00.000Z'
//     },
//     {
//         displayName:'Lucas',
//         userName: '0x606eFfCAD0f9b4DeA654343A1BB44911fC408F3B',
//         avatar: 'https://falaanimal.com.br/wp-content/uploads/2020/11/freakazoid_11112020.jpg',
//         text:'Whatch out',
//         isProfileImageNFT: false,
//         timestamp: '2022-02-25T12:00:00.000Z'
//     },
//     {
//         displayName:'Lucas',
//         userName: '0x606eFfCAD0f9b4DeA654343A1BB44911fC408F3B',
//         avatar: 'https://falaanimal.com.br/wp-content/uploads/2020/11/freakazoid_11112020.jpg',
//         text:'Not trying',
//         isProfileImageNFT: false,
//         timestamp: '2022-01-25T12:00:00.000Z'
//     },

// ]

const ProfileTweets =()=>{
    const {currentAccount, currentUser} = useContext(TwitterContext)
    return(
        <div className={style.wrapper}>
            {currentUser.tweets?.map((tweet, index) =>(
                <Post 
                    key={index}
                    displayName={
                        currentUser.name === 'Unnamed'
                          ? `${currentUser.walletAddress.slice(
                              0,
                              4,
                            )}...${currentUser.walletAddress.slice(41)}`
                          : currentUser.name
                      }
                      userName={`${currentUser.walletAddress.slice(
                        0,
                        4,
                      )}...${currentUser.walletAddress.slice(41)}`}
                      text={tweet.tweet}
                      avatar={currentUser.profileImage}
                      timestamp={tweet.timestamp}
                      isProfileImageNft={currentUser.isProfileImageNft}
                />
            ))}
        </div>
    )
}

export default ProfileTweets