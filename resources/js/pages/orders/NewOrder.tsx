import { NewOrder as NewOrderComponent } from './components/NewOrder';

interface NewOrderProps {
    orderCode?: string;
    branches?: any[];
}

export default function NewOrder(props: NewOrderProps) {
    return <NewOrderComponent {...props} />;
}
