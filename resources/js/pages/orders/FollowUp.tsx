import { FollowUp as FollowUpComponent } from './components/FollowUp';

interface FollowUpProps {
    order: any;
    totalPaid: number;
    remainingBalance: number;
}

export default function FollowUp(props: FollowUpProps) {
    return <FollowUpComponent {...props} />;
}
