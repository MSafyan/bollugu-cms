import { useEffect, useState } from 'react';
import layoutService from './LayoutServiceClass';

const useLayoutHook = () => {
  const [layouts, setLayouts] = useState([]);
  const [layoutsLoading, setLayoutsLoading] = useState([]);

  useEffect(() => {
    setLayoutsLoading(true);
    layoutService
      .getAll()
      .then((res) => {
        setLayouts(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLayoutsLoading(false);
      });
  }, []);

  return { layouts, layoutsLoading };
};

export default useLayoutHook;
