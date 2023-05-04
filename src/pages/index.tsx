import { useEffect } from 'react';
import { useRouter } from 'next/router';


const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/movies');
  }, []);

  return null;
};

export default IndexPage;
