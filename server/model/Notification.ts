export interface Notification {
    id: string;
    isRead: boolean;
    message: string;
    type: string;
    preview?: any;
    createdAt: string;
    proposalId?: string;
    userId: string;
}

export const notificationsTypes = {
    PROPOSAL_RECEIVED: 'ProposalReceived',
    PROPOSAL_ACCEPTED: 'ProposalAccepted',
    PROPOSAL_REJECTED: 'ProposalRejected'
}