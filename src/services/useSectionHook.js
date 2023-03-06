import { useEffect, useState } from 'react';
import service from './HomeSectionsServiceClass';

const useSectionHook = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    service
      .getAll()
      .then((res) => {
        debugger;
        setSections(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { sections };
};

export default useSectionHook;
