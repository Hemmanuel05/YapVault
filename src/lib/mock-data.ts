import { PlaceHolderImages } from './placeholder-images';

export type LeaderboardEntry = {
  rank: number;
  name: string;
  handle: string;
  yapScore: number;
  change: number;
  avatar: string;
};

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Synthara', handle: '@synthara', yapScore: 9850, change: 25, avatar: PlaceHolderImages.find(img => img.id === 'avatar1')?.imageUrl || '' },
  { rank: 2, name: 'Zkrypt', handle: '@zkrypt_labs', yapScore: 9730, change: -5, avatar: PlaceHolderImages.find(img => img.id === 'avatar2')?.imageUrl || '' },
  { rank: 3, name: 'DeFi_Dynamo', handle: '@DynamoDeFi', yapScore: 9600, change: 12, avatar: PlaceHolderImages.find(img => img.id === 'avatar3')?.imageUrl || '' },
  { rank: 4, name: 'AI_Alchemist', handle: '@AI_Alchemist', yapScore: 9550, change: 30, avatar: PlaceHolderImages.find(img => img.id === 'avatar4')?.imageUrl || '' },
  { rank: 5, name: 'GridRunner', handle: '@GridRunner', yapScore: 9400, change: -8, avatar: PlaceHolderImages.find(img => img.id === 'avatar5')?.imageUrl || '' },
  { rank: 6, name: 'Web3Weaver', handle: '@Web3Weaver', yapScore: 9320, change: 15, avatar: PlaceHolderImages.find(img => img.id === 'avatar6')?.imageUrl || '' },
  { rank: 7, name: 'Kaia_King', handle: '@KaiaKing', yapScore: 9210, change: 40, avatar: PlaceHolderImages.find(img => img.id === 'avatar7')?.imageUrl || '' },
  { rank: 8, name: 'SophonSage', handle: '@SophonSage', yapScore: 9150, change: -2, avatar: PlaceHolderImages.find(img => img.id === 'avatar8')?.imageUrl || '' },
];

export const trendingProjects = [
    { name: 'Sophon', description: 'Modular blockchain built on ZK technology.' },
    { name: 'Kaia', description: 'Unified blockchain platform combining Klaytn and Finschia.' },
    { name: 'Initia', description: 'Network for interwoven rollups.' },
    { name: 'Hyperpie', description: 'Decentralized AI infrastructure.' },
];
