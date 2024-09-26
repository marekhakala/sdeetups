import Link from 'next/link';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'

export default () => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
      <div className="text-xl font-semibold text-foreground">        
            &nbsp;<Link href="/">Starknet Deetups</Link>&nbsp;
      </div>
      <nav><DynamicWidget /></nav>
    </header>
    )
};
