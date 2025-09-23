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
    { name: 'Sophon', description: 'Sophon is gaining traction with its new modular blockchain design.' },
    { name: 'Kaia', description: 'Kaia is trending after announcing a major partnership in the DeFi space.' },
];

export type Follower = {
  name: string;
  handle: string;
  bio: string;
  followers: number;
  avatar: string;
};

export const followerMatches: Follower[] = [
    { name: 'CryptoChad', handle: '@ChadCrypto', bio: 'Investor in DeFi, NFTs, and AI. Building the future of Web3.', followers: 15200, avatar: PlaceHolderImages.find(img => img.id === 'avatar1')?.imageUrl || '' },
    { name: 'Anna_DeFi', handle: '@AnnaDeFi', bio: 'DeFi enthusiast and researcher. Exploring the potential of zkSync and Layer 2 solutions.', followers: 8500, avatar: PlaceHolderImages.find(img => img.id === 'avatar2')?.imageUrl || '' },
    { name: 'AI_Innovator', handle: '@AI_Innovate', bio: 'AI developer working on decentralized intelligence. Fascinated by GRID and emergent AI.', followers: 5300, avatar: PlaceHolderImages.find(img => img.id === 'avatar3')?.imageUrl || '' },
    { name: 'Web3Wendy', handle: '@WendyWeb3', bio: 'Community manager for a top Web3 project. Passionate about AI integration in blockchain.', followers: 2100, avatar: PlaceHolderImages.find(img => img.id === 'avatar4')?.imageUrl || '' },
    { name: 'TokenTitan', handle: '@TokenTitan', bio: 'Early-stage tokenomics advisor. Focused on DeFi protocols and AI-driven trading.', followers: 45000, avatar: PlaceHolderImages.find(img => img.id === 'avatar5')?.imageUrl || '' },
    { name: 'DAO_Dude', handle: '@DAO_Dude', bio: 'Building DAOs and exploring governance models. Big fan of Sophon\'s approach.', followers: 1200, avatar: PlaceHolderImages.find(img => img.id === 'avatar6')?.imageUrl || '' },
    { name: 'Layer2Laura', handle: '@L2Laura', bio: 'Technical writer covering all things Layer 2. zkSync, Arbitrum, Optimism. DeFi is the future.', followers: 3400, avatar: PlaceHolderImages.find(img => img.id === 'avatar7')?.imageUrl || '' },
];
