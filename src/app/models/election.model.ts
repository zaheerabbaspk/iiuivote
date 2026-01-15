export interface Election {
    id: number;
    name: string;
    positions: string[];
    candidates: Candidate[];
}

export interface Candidate {
    id: number;
    name: string;
    position: string;
    image?: string;
    party?: string;
    color?: string;
    votes?: number;
}

export interface ElectionStats {
    totalVotes: number;
    voterTurnout: number;
    eligibleVoters: number;
    timeRemaining: string;
    lastUpdated: string;
}

export interface PositionResult {
    positionName: string;
    candidates: any[];
}

export interface ElectionResult {
    electionId: number;
    electionName: string;
    electionDescription: string;
    resultsByPosition?: PositionResult[];
    candidates?: any[]; // Keep for compatibility if needed
}
