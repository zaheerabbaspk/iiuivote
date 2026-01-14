export interface Election {
    id: string;
    name: string;
}

export interface Candidate {
    id: string;
    name: string;
    department: string;
    description: string;
    imageUrl: string;
    votes: number;
    color: string;
    election_id: string;
}

export interface ElectionStats {
    totalVotes: number;
    voterTurnout: number;
    eligibleVoters: number;
    timeRemaining: string;
    lastUpdated: string;
}

export interface ElectionResult {
    electionId: number;
    electionName: string;
    electionDescription: string;
    candidates: any[]; // Raw data from API
}
