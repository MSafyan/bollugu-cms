import { useEffect, useState } from 'react';
import layoutService from './LayoutServiceClass';

const useLayoutHook = () => {
  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    layoutService
      .getAll()
      .then((res) => {
        setLayouts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { layouts };
};

export default useLayoutHook;
