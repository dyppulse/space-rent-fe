import { SWRConfig } from 'swr';
import { fetcher } from './fetcher';

const SwrProvider = ({ children }) => (
  <SWRConfig
    value={{
      fetcher,
      onError: (err) => {
        console.error('SWR Error:', err);
      },
      revalidateOnFocus: false,
    }}
  >
    {children}
  </SWRConfig>
);

export default SwrProvider;
