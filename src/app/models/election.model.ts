export interface Candidate {
    id: string;
    name: string;
    department: string;
    description: string;
    imageUrl: string;
    votes: number;
    color: string;
}

export interface ElectionStats {
    totalVotes: number;
    voterTurnout: number;
    eligibleVoters: number;
    timeRemaining: string;
    lastUpdated: string;
}
