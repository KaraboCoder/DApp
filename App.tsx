/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ethers, formatEther} from 'ethers';
import LiquidityIcon from './assets/liquidity.png';
import APRIcon from './assets/apr.png';
import StakedIcon from './assets/staked.png';

const contractAddress = '0xc864D1eCF4dD39e9A88066bd0EE0ee53E8c31cE2';

const provider = new ethers.JsonRpcProvider(
  'https://bsc-dataseed.binance.org/',
);

function App(): React.JSX.Element {
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const [sections, setSections] = useState<SectionType[]>([]);

  console.log(contract);
  useEffect(() => {
    getAllUsersInfo();
  }, []);

  async function getAllUsersInfo() {
    try {
      const stakedTokenSupply = await contract.stakedTokenSupply();
      const rewardPerBlock = await contract.rewardPerBlock();

      //Get Price of LIQ in USD
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=liquidus-2',
      );
      const data = await res.json();
      const exchangeRate = data[0]?.current_price;

      let _sections: SectionType[] = [];
      if (exchangeRate) {
        _sections.push({
          title: 'Liquidity',
          value: `$ ${(
            Number(formatEther(stakedTokenSupply)) * exchangeRate
          ).toFixed(2)}`,
          icon: LiquidityIcon,
        });

        _sections.push({
          title: 'Staked',
          value: `${Number(formatEther(stakedTokenSupply)).toFixed(2)} LIQ`,
          icon: StakedIcon,
        });

        const blocksPerDay = (24 * 60 * 60) / 3;

        _sections.push({
          title: 'APR',
          value: `${(
            ((Number(formatEther(rewardPerBlock)) * blocksPerDay * 365) /
              Number(formatEther(stakedTokenSupply))) *
            100
          ).toFixed(2)}%`,
          icon: APRIcon,
        });

        setSections(_sections);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: Colors.lighter, flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lighter} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 45,
        }}>
        {sections.map(s => (
          <Section key={s.title} {...s} />
        ))}
      </View>
    </SafeAreaView>
  );
}

type SectionType = {
  title: string;
  value: string;
  icon?: any;
};

const Section = ({title, value, icon}: SectionType) => {
  return (
    <View style={{gap: 5}}>
      <Image source={icon} style={{height: 50, width: 50}} />
      <Text>{title}</Text>
      <Text>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

const abi = [
  {inputs: [], stateMutability: 'nonpayable', type: 'constructor'},
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenRecovered',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AdminTokenRecovery',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'EmergencyWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardPerBlock',
        type: 'uint256',
      },
    ],
    name: 'NewRewardPerBlock',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startBlock',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endBlock',
        type: 'uint256',
      },
    ],
    name: 'NewStartAndEndBlocks',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'RewardsStop',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, internalType: 'address', name: 'user', type: 'address'},
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PRECISION_FACTOR',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'accTokenPerShare',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bonusEndBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'depositReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'emergencyRewardWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRewardBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{internalType: 'address', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '_user', type: 'address'}],
    name: 'pendingReward',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'address', name: '_tokenAddress', type: 'address'},
      {internalType: 'uint256', name: '_tokenAmount', type: 'uint256'},
    ],
    name: 'recoverWrongTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardPerBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardTokenSupplyRemaining',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakedToken',
    outputs: [{internalType: 'contract IBEP20', name: '', type: 'address'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakedTokenSupply',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startBlock',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stopReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256'},
    ],
    name: 'updateRewardPerBlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {internalType: 'uint256', name: '_startBlock', type: 'uint256'},
      {internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256'},
    ],
    name: 'updateStartAndEndBlocks',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: 'priodInSecond', type: 'uint256'}],
    name: 'updateVestingTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: '', type: 'address'}],
    name: 'userInfo',
    outputs: [
      {internalType: 'uint256', name: 'amount', type: 'uint256'},
      {internalType: 'uint256', name: 'rewardDebt', type: 'uint256'},
      {internalType: 'uint256', name: 'lastDepositedAt', type: 'uint256'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vestingTime',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '_amount', type: 'uint256'}],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
