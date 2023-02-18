import { useEffect, useState } from 'react';
import backgroundService from './BackgroudServiceClass';

const useBackgroundHook = () => {
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    backgroundService
      .getAll()
      .then((res) => {
        setBackgrounds(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { backgrounds };
};

export default useBackgroundHook;
