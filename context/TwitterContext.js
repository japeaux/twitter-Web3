import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'

export const TwitterContext = createContext()

export const TwitterProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState({})
  const [tweets, setTweets] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])


  useEffect(() => {
    if (!currentAccount || appStatus !== 'connected') return
    getCurrentUserDetails(currentAccount)
    fetchTweets()
  }, [currentAccount, appStatus])

  /**
   * Checks if there is an active wallet connection
   */
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        setAppStatus('connected')
        setCurrentAccount(addressArray[0])
        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      router.push('/')
      setAppStatus('error')
    }
  }

  /**
   * Initiates MetaMask wallet connection
   */
  const connectWallet = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      setAppStatus('loading')

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      setAppStatus('error')
    }
  }


  /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userAddress Wallet address of the currently logged in user
   */
  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const userDoc = {
        _type: 'users',
        _id: userAddress,
        name: 'Lucas C',
        isProfileImageNft: false,
        profileImage:
          'https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg',
        walletAddress: userAddress,
      }

      await client.createIfNotExists(userDoc)

      setAppStatus('connected')
    } catch (error) {
      router.push('/')
      setAppStatus('error')
    }
  }


  const getNftProfileImage = async (imageUri, isNft) => {
    if (isNft) {
      return `https://gateway.pinata.cloud/ipfs/${imageUri}`
    } else if (!isNft) {
      return imageUri
    }
  }


  const fetchTweets = async () => {

    const query = `*[_type == "tweets"]{
      "author": author->{name, walletAddress, profileImage, isProfileImageNft},
      tweet,
      timestamp
    }|order(timestamp desc)`

    const sanityResponse = await client.fetch(query)

    setTweets([])

    sanityResponse.forEach(async (items) => {

      const profileImageUrl = await getNftProfileImage(
        items.author.profileImage,
        items.author.isProfileImageNft,
      )

      const newItem = {
        tweet: items.tweet,
        timestamp: items.timestamp,
        author:{
          name:items.author.name,
          walletAddress: items.author.walletAddress,
          isProfileImageNft: items.author.isProfileImageNft,
          profileImage: profileImageUrl,
        }
      }
      setTweets((prevState)=>[...prevState,newItem])
    });

  }

  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if(appStatus !== 'connected') return

    const query = `*[_type == "users" && _id == "${userAccount}"]{
      "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
      name,
      profileImage,
      isProfileImageNft,
      coverImage,
      walletAddress
    }`

    const sanityResponse = await client.fetch(query)

    const profileImageUri = await getNftProfileImage(
      sanityResponse[0].profileImage,
      sanityResponse[0].isProfileImageNft,
    )


    setCurrentUser({
      tweets: sanityResponse[0].tweets,
      name: sanityResponse[0].name,
      profileImage: profileImageUri,
      walletAddress: sanityResponse[0].walletAddress,
      coverImage: sanityResponse[0].coverImage,
      isProfileImageNft: sanityResponse[0].isProfileImageNft,
    })

  }


  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectWallet,
        fetchTweets,
        tweets,
        currentUser,
        getCurrentUserDetails, 
      }}
    >
      {children}
    </TwitterContext.Provider>
  )
}